import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateAdmin, newBookingAccessToken, requireBookingAccess } from '../middleware/auth.js';

function response() {
  return { statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } };
}

test('admin access requires a verified Supabase bearer token', async () => {
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'public-test-key';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer valid-test-token');
    return { ok: true, json: async () => ({ id: 'trusted-id', app_metadata: { role: 'admin' } }) };
  };
  try {
    let proceeded = false;
    const res = response();
    await authenticateAdmin({ get: () => 'Bearer valid-test-token' }, res, () => { proceeded = true; });
    assert.equal(proceeded, true);
    assert.equal(res.statusCode, 200);
  } finally { globalThis.fetch = originalFetch; }
});

test('user editable metadata does not grant admin access', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ id: 'untrusted', user_metadata: { role: 'admin' } }) });
  try {
    const res = response();
    await authenticateAdmin({ get: () => 'Bearer valid-test-token' }, res, () => assert.fail('must deny'));
    assert.equal(res.statusCode, 403);
  } finally { globalThis.fetch = originalFetch; }
});

test('booking access uses a random bearer capability and denies missing credentials', () => {
  const { token, hash } = newBookingAccessToken();
  const res = response();
  requireBookingAccess({ booking: { paymentAccessTokenHash: hash }, get: () => `Bearer ${token}` }, res, () => { res.proceeded = true; });
  assert.equal(res.proceeded, true);
  const denied = response();
  requireBookingAccess({ booking: { paymentAccessTokenHash: hash }, get: () => null }, denied, () => assert.fail('must deny'));
  assert.equal(denied.statusCode, 404);
});

