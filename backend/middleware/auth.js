import crypto from 'node:crypto';

export async function authenticateAdmin(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!token || !supabaseUrl || !supabaseKey) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return res.status(401).json({ error: 'Unauthorized' });
    const user = await response.json();
    const trustedIds = (process.env.SUPABASE_ADMIN_USER_IDS || '').split(',').map((id) => id.trim()).filter(Boolean);
    if (user.app_metadata?.role !== 'admin' && !trustedIds.includes(user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.admin = { id: user.id, email: user.email };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireBookingAccess(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  const expected = req.booking?.paymentAccessTokenHash;
  if (!token || !expected) return res.status(404).json({ error: 'Booking not found' });
  const actual = crypto.createHash('sha256').update(token).digest();
  const stored = Buffer.from(expected, 'hex');
  if (stored.length !== actual.length || !crypto.timingSafeEqual(stored, actual)) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  next();
}

export function newBookingAccessToken() {
  const token = crypto.randomBytes(32).toString('base64url');
  return { token, hash: crypto.createHash('sha256').update(token).digest('hex') };
}

