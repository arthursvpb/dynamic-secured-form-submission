import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { authSchema } from '../utils/validation';
import { generateToken } from '../middleware/auth';

const router = Router();

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '$2a$10$rZ7qHY8nXj.V6qO4pAK8Ue5FJZvLdoQ7Kv4sS3xB9cR1wE2oP8mTy'
};

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details.map(d => d.message) 
      });
    }

    const { username, password } = value;

    if (username !== ADMIN_CREDENTIALS.username) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken('admin');
    
    res.json({ 
      token,
      user: { id: 'admin', username: 'admin' }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = generateToken('admin');
    res.json({ valid: true, user: { id: 'admin', username: 'admin' } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router; 