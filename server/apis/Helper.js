import crypto from 'crypto';

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const encryptPassword = (text) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(process.env.PASSWORD_SECRET).digest('base64').substring(0, 32);
  const iv = crypto
    .createHash('sha256')
    .update(process.env.PASSWORD_IV_SECRET)
    .digest('base64')
    .substring(0, 16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
};

export const decryptPassword = (text) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(process.env.PASSWORD_SECRET).digest('base64').substring(0, 32);
  const iv = crypto
    .createHash('sha256')
    .update(process.env.PASSWORD_IV_SECRET)
    .digest('base64')
    .substring(0, 16);
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
