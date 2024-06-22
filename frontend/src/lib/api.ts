import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number';
  order: number;
}

export interface FormSection {
  id: string;
  name: string;
  order: number;
  fields: FormField[];
}

export interface Form {
  id: string;
  title?: string;
  token: string;
  sections: FormSection[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormData {
  title?: string;
  sections: {
    name: string;
    fields: {
      label: string;
      type: 'text' | 'number';
    }[];
  }[];
}

export interface SubmissionValue {
  fieldId: string;
  value: string;
}

export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  verify: async (): Promise<{ valid: boolean; user: any }> => {
    const response = await api.post('/auth/verify');
    return response.data;
  },
};

export const formsApi = {
  create: async (formData: CreateFormData): Promise<{ form: Form; url: string }> => {
    const response = await api.post('/forms', formData);
    return response.data;
  },

  getAll: async (): Promise<Form[]> => {
    const response = await api.get('/forms');
    return response.data;
  },

  getByToken: async (token: string): Promise<Form> => {
    const response = await api.get(`/forms/token/${token}`);
    return response.data;
  },
};

export const submissionsApi = {
  submit: async (token: string, values: SubmissionValue[]): Promise<{ message: string; submissionId: string }> => {
    const response = await api.post(`/submissions/${token}`, { values });
    return response.data;
  },
};

export default api; 