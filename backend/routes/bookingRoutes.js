import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { authenticateAdmin, newBookingAccessToken, requireBookingAccess } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
const uploadPath = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));
const destinations = {
  'Adventure Sports': 4500, Trekking: 6000, 'Scuba Diving': 3800,
  'Environmental Study': 5200, Cycling: 3800, 'Cultural Activities': 6000,
  'Nature tours': 9000, 'Water Sports': 1000, Cinema: 2000,
};

function imageType(buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP') return 'webp';
  if (buffer.subarray(0, 6).toString().match(/^GIF8[79]a$/)) return 'gif';
  return null;
}

function loadBooking(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Booking not found' });
  Booking.findById(req.params.id).select('+paymentAccessTokenHash').then((booking) => {
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    req.booking = booking;
    next();
  }).catch(() => res.status(500).json({ error: 'Unable to load booking' }));
}

router.get('/services', async (_req, res) => {
  try { res.json(await Service.find({})); }
  catch { res.status(500).json({ error: 'Unable to load services' }); }
});

router.get('/service/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Service not found' });
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch { res.status(500).json({ error: 'Unable to load service' }); }
});

router.get('/disabled-dates/:serviceId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.serviceId)) return res.status(404).json({ error: 'Service not found' });
    const service = await Service.findById(req.params.serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    const bookings = await Booking.find({ serviceId: service._id, status: 'paid' }).select('checkin guests');
    const counts = {};
    bookings.forEach((booking) => booking.checkin.forEach((date) => {
      const day = new Date(date).toISOString().slice(0, 10);
      counts[day] = (counts[day] || 0) + booking.guests;
    }));
    res.json(Object.keys(counts).filter((day) => counts[day] >= service.maxGuestsPerDay));
  } catch { res.status(500).json({ error: 'Unable to load availability' }); }
});

router.post('/create-order', async (req, res) => {
  try {
    const { name, email, phone, altPhone, destination, checkin, checkout, guests, age, hiText, guestDetails } = req.body;
    const count = Number(guests);
    const rate = destinations[destination];
    const start = new Date(checkin);
    const end = new Date(checkout);
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !phone || !rate || !Number.isInteger(count) || count < 1 || count > 20 || !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start || !Array.isArray(guestDetails) || guestDetails.length > 20) {
      return res.status(400).json({ error: 'Invalid booking details' });
    }
    const access = newBookingAccessToken();
    const booking = new Booking({
      name: name.trim().slice(0, 120), email: email.trim().slice(0, 254), phone: String(phone).slice(0, 30),
      altPhone: String(altPhone || '').slice(0, 30), destination, checkin: [start], checkout: [end], guests: count,
      age: Number(age), hiText: String(hiText || '').slice(0, 1000), totalAmount: rate * count,
      guestDetails: guestDetails.map((g) => ({ name: String(g.name || '').slice(0, 120), age: Number(g.age), bloodGroup: String(g.bloodGroup || '').slice(0, 8), diabetes: Boolean(g.diabetes) })),
      paymentAccessTokenHash: access.hash,
    });
    await booking.save();
    res.status(201).json({ booking: booking.toObject({ transform: (_doc, ret) => { delete ret.paymentAccessTokenHash; return ret; } }), accessToken: access.token });
  } catch { res.status(400).json({ error: 'Invalid booking details' }); }
});

// Confirmation is an admin action. UTR or an uploaded image is not payment verification.
router.post('/verify-payment', authenticateAdmin, async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!mongoose.isValidObjectId(bookingId)) return res.status(404).json({ error: 'Booking not found' });
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'paid') return res.status(409).json({ error: 'Payment must be verified before confirmation' });
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com', port: Number(process.env.EMAIL_PORT || 587),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: process.env.EMAIL_USER && process.env.EMAIL_PASS ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } : undefined,
    });
    await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to: booking.email,
      subject: `Booking Confirmation - ${booking._id}`,
      text: `Hi ${booking.name}, your booking ${booking._id} for ${booking.destination} has been confirmed.` });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Unable to send confirmation' }); }
});

router.get('/admin/bookings', authenticateAdmin, async (_req, res) => {
  try { res.json(await Booking.find({}).populate('serviceId')); }
  catch { res.status(500).json({ error: 'Unable to load bookings' }); }
});

router.delete('/admin/booking/:id', authenticateAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Booking not found' });
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Unable to delete booking' }); }
});

router.patch('/admin/booking/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!mongoose.isValidObjectId(req.params.id) || !['pending', 'paid', 'Waiting...', 'confirmed', 'cancelled'].includes(status)) return res.status(400).json({ error: 'Invalid booking update' });
    const booking = await Booking.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking });
  } catch { res.status(500).json({ error: 'Unable to update booking' }); }
});

router.get('/admin/upload/:filename', authenticateAdmin, async (req, res) => {
  if (!/^[a-f0-9]{32}\.(png|jpg|webp|gif)$/.test(req.params.filename)) return res.sendStatus(404);
  try { res.type(path.extname(req.params.filename)).send(await fs.readFile(path.join(uploadPath, req.params.filename))); }
  catch { res.sendStatus(404); }
});

router.get('/booking/:id', loadBooking, requireBookingAccess, (req, res) => {
  const booking = req.booking.toObject();
  delete booking.paymentAccessTokenHash;
  res.json({ booking });
});

router.patch('/booking/:id', loadBooking, requireBookingAccess, upload.single('screenshot'), async (req, res) => {
  try {
    const utr = String(req.body.utr || '').trim();
    if (utr && !/^[A-Za-z0-9-]{6,30}$/.test(utr)) return res.status(400).json({ error: 'Invalid UTR number' });
    const update = {};
    if (utr) update.utrNumber = utr;
    if (req.file) {
      const extension = imageType(req.file.buffer);
      if (!extension) return res.status(415).json({ error: 'Only valid PNG, JPEG, WebP, or GIF images are accepted' });
      await fs.mkdir(uploadPath, { recursive: true });
      const filename = `${crypto.randomBytes(16).toString('hex')}.${extension}`;
      await fs.writeFile(path.join(uploadPath, filename), req.file.buffer, { flag: 'wx', mode: 0o600 });
      update.paymentScreenshot = filename;
    }
    if (!utr && !req.file) return res.status(400).json({ error: 'Payment proof is required' });
    update.status = 'Waiting...';
    Object.assign(req.booking, update);
    await req.booking.save();
    const booking = req.booking.toObject();
    delete booking.paymentAccessTokenHash;
    res.json({ success: true, booking });
  } catch { res.status(500).json({ error: 'Unable to submit payment proof' }); }
});

export default router;

