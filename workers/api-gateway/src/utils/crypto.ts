// Cryptographic utilities for password hashing and JWT

/**
 * Hash a password using SHA-256
 * Note: In production, consider using a proper password hashing library like bcrypt/argon2
 * For Cloudflare Workers, we'll use the Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Generate a simple JWT token
 * Note: This is a basic implementation. Consider using a JWT library for production
 */
export async function signJWT(payload: any, secret: string, expiresIn: string = '7d'): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseExpiry(expiresIn);

  const jwtPayload = {
    ...payload,
    iat: now,
    exp,
  };

  // Base64URL encode
  const encodeBase64URL = (data: any) => {
    const str = JSON.stringify(data);
    const base64 = btoa(str);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const headerEncoded = encodeBase64URL(header);
  const payloadEncoded = encodeBase64URL(jwtPayload);

  const message = `${headerEncoded}.${payloadEncoded}`;

  // Sign with HMAC SHA-256
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${message}.${signatureBase64}`;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJWT(token: string, secret: string): Promise<any> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
  const message = `${headerEncoded}.${payloadEncoded}`;

  // Verify signature
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  // Decode signature from Base64URL
  const signatureBase64 = signatureEncoded
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const paddedSignature = signatureBase64 + '=='.substring(0, (3 * signatureBase64.length) % 4);
  const signatureStr = atob(paddedSignature);
  const signatureArray = new Uint8Array(signatureStr.length);
  for (let i = 0; i < signatureStr.length; i++) {
    signatureArray[i] = signatureStr.charCodeAt(i);
  }

  const isValid = await crypto.subtle.verify('HMAC', key, signatureArray, messageData);

  if (!isValid) {
    throw new Error('Invalid signature');
  }

  // Decode payload
  const decodeBase64URL = (str: string) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '=='.substring(0, (3 * base64.length) % 4);
    return JSON.parse(atob(padded));
  };

  const payload = decodeBase64URL(payloadEncoded);

  // Check expiration
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}

/**
 * Parse expiry string (e.g., '7d', '24h', '60m') to seconds
 */
function parseExpiry(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) {
    throw new Error('Invalid expiry format');
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60;
    case 'h':
      return value * 60 * 60;
    case 'm':
      return value * 60;
    case 's':
      return value;
    default:
      throw new Error('Invalid expiry unit');
  }
}

/**
 * Generate a random ID
 */
export function generateId(prefix: string = ''): string {
  const randomPart = crypto.randomUUID();
  return prefix ? `${prefix}_${randomPart}` : randomPart;
}
