import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenExpiry: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY) || 60 * 60,
  refreshTokenExpiry:
    parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY) || 60 * 60 * 24 * 30,
}));
