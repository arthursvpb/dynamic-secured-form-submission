import { createFormSchema, submitFormSchema, authSchema } from '../utils/validation';

describe('Validation Schemas', () => {
  describe('createFormSchema', () => {
    it('should validate a correct form structure', () => {
      const validForm = {
        title: 'Test Form',
        sections: [
          {
            name: 'Personal Info',
            fields: [
              { label: 'Full Name', type: 'text' },
              { label: 'Age', type: 'number' }
            ]
          }
        ]
      };

      const { error } = createFormSchema.validate(validForm);
      expect(error).toBeUndefined();
    });

    it('should reject form without sections', () => {
      const invalidForm = {
        title: 'Test Form',
        sections: []
      };

      const { error } = createFormSchema.validate(invalidForm);
      expect(error).toBeDefined();
    });

    it('should reject section without fields', () => {
      const invalidForm = {
        title: 'Test Form',
        sections: [
          {
            name: 'Empty Section',
            fields: []
          }
        ]
      };

      const { error } = createFormSchema.validate(invalidForm);
      expect(error).toBeDefined();
    });

    it('should reject invalid field types', () => {
      const invalidForm = {
        sections: [
          {
            name: 'Test Section',
            fields: [
              { label: 'Test Field', type: 'invalid-type' }
            ]
          }
        ]
      };

      const { error } = createFormSchema.validate(invalidForm);
      expect(error).toBeDefined();
    });

    it('should allow form without title', () => {
      const validForm = {
        sections: [
          {
            name: 'Test Section',
            fields: [
              { label: 'Test Field', type: 'text' }
            ]
          }
        ]
      };

      const { error } = createFormSchema.validate(validForm);
      expect(error).toBeUndefined();
    });
  });

  describe('submitFormSchema', () => {
    it('should validate correct submission data', () => {
      const validSubmission = {
        values: [
          { fieldId: '123e4567-e89b-12d3-a456-426614174000', value: 'John Doe' },
          { fieldId: '123e4567-e89b-12d3-a456-426614174001', value: '25' }
        ]
      };

      const { error } = submitFormSchema.validate(validSubmission);
      expect(error).toBeUndefined();
    });

    it('should reject submission without values', () => {
      const invalidSubmission = {
        values: []
      };

      const { error } = submitFormSchema.validate(invalidSubmission);
      expect(error).toBeDefined();
    });

    it('should reject invalid field ID format', () => {
      const invalidSubmission = {
        values: [
          { fieldId: 'invalid-id', value: 'test' }
        ]
      };

      const { error } = submitFormSchema.validate(invalidSubmission);
      expect(error).toBeDefined();
    });

    it('should allow empty string values', () => {
      const validSubmission = {
        values: [
          { fieldId: '123e4567-e89b-12d3-a456-426614174000', value: '' }
        ]
      };

      const { error } = submitFormSchema.validate(validSubmission);
      expect(error).toBeUndefined();
    });
  });

  describe('authSchema', () => {
    it('should validate correct auth credentials', () => {
      const validAuth = {
        username: 'admin',
        password: 'password123'
      };

      const { error } = authSchema.validate(validAuth);
      expect(error).toBeUndefined();
    });

    it('should reject short username', () => {
      const invalidAuth = {
        username: 'ab',
        password: 'password123'
      };

      const { error } = authSchema.validate(invalidAuth);
      expect(error).toBeDefined();
    });

    it('should reject short password', () => {
      const invalidAuth = {
        username: 'admin',
        password: '12345'
      };

      const { error } = authSchema.validate(invalidAuth);
      expect(error).toBeDefined();
    });
  });
}); 