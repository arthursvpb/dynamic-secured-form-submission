import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { submitFormSchema } from '../utils/validation';
import { isValidToken } from '../utils/crypto';

const router = Router();
const prisma = new PrismaClient();

router.post('/:token', async (req: Request, res: Response) => {
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
            fields: true
          }
        }
      }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found or expired' });
    }

    const { error, value } = submitFormSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details.map(d => d.message) 
      });
    }

    const { values } = value;
    
    const allFieldIds = form.sections.flatMap(section => 
      section.fields.map(field => field.id)
    );
    
    const submittedFieldIds = values.map((v: any) => v.fieldId);
    const invalidFieldIds = submittedFieldIds.filter(id => !allFieldIds.includes(id));
    
    if (invalidFieldIds.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid field IDs provided',
        invalidIds: invalidFieldIds
      });
    }

    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        token,
        values: {
          create: values.map((val: any) => ({
            fieldId: val.fieldId,
            value: val.value
          }))
        }
      },
      include: {
        values: {
          include: {
            field: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Form submitted successfully',
      submissionId: submission.id,
      submittedAt: submission.createdAt
    });
  } catch (error) {
    console.error('Submit form error:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

router.get('/form/:formId', async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    
    const submissions = await prisma.submission.findMany({
      where: { formId },
      include: {
        values: {
          include: {
            field: {
              include: {
                section: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to retrieve submissions' });
  }
});

export default router; 