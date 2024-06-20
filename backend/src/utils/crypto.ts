import crypto from 'crypto';

export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const isValidToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  return /^[a-f0-9]{64}$/.test(token);
};

export const generateFormUrl = (baseUrl: string, token: string): string => {
  return `${baseUrl}/form/${token}`;
}; 