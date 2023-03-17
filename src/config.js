import dotenv from 'dotenv'

dotenv.config();

export const PORT = process.env.PORT || 4000;
export const TOKEN_SECRET = process.env.SECRET || 'ASÑLDKASKLÑFJLSAKDFKLSAFfsadñlfasd213423f';
export const CONNECTION_STRING = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/RegistroDb';

export const ADMIN_USER = process.env.ADMIN_USER || 'admin';
export const ADMIN_PASS = process.env.ADMIN_PASS || 'admin1234.';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com';