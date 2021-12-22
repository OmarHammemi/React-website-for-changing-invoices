import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRATION_TIME,
}));
