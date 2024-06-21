import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { createFormSchema } from '../utils/validation';
import { generateSecureToken, isValidToken, generateFormUrl } from '../utils/crypto';

const router = Router();
const prisma = new PrismaClient();

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = createFormSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details.map(d => d.message) 
      });
    }

    const { title, sections } = value;
    const token = generateSecureToken();

    const form = await prisma.form.create({
      data: {
        title: title || 'Untitled Form',
        token,
        sections: {
          create: sections.map((section: any, sectionIndex: number) => ({
            name: section.name,
            order: sectionIndex,
            fields: {
              create: section.fields.map((field: any, fieldIndex: number) => ({
                label: field.label,
                type: field.type,
                order: fieldIndex
              }))
            }
          }))
        }
      },
      include: {
        sections: {
          include: {
            fields: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const formUrl = generateFormUrl(baseUrl, token);

    res.status(201).json({
      form,
      url: formUrl
    });
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

router.get('/token/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!isValidToken(token)) {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    const form = await prisma.form.findUnique({
      where: { token },
      include: {
        sections: {
          include: {
            fields: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ error: 'Failed to retrieve form' });
  }
});

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const forms = await prisma.form.findMany({
      include: {
        sections: {
          include: {
            fields: true
          }
        },
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    const formsWithUrls = forms.map(form => ({
      ...form,
      url: generateFormUrl(baseUrl, form.token),
      submissionCount: form._count.submissions
    }));

    res.json(formsWithUrls);
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ error: 'Failed to retrieve forms' });
  }
});

export default router; 