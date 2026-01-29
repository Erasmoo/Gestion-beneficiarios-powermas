import axios from 'axios';
import type { Beneficiario, BeneficiarioCreate, BeneficiarioUpdate, DocumentoIdentidad } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5122/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== DOCUMENTOS ====================

export const obtenerDocumentosActivos = async (): Promise<DocumentoIdentidad[]> => {
  const response = await api.get<DocumentoIdentidad[]>('/documentos');
  return response.data;
};

export const obtenerDocumentoPorId = async (id: number): Promise<DocumentoIdentidad> => {
  const response = await api.get<DocumentoIdentidad>(`/documentos/${id}`);
  return response.data;
};

// ==================== BENEFICIARIOS ====================

export const obtenerBeneficiarios = async (): Promise<Beneficiario[]> => {
  const response = await api.get<Beneficiario[]>('/beneficiarios');
  return response.data;
};

export const obtenerBeneficiarioPorId = async (id: number): Promise<Beneficiario> => {
  const response = await api.get<Beneficiario>(`/beneficiarios/${id}`);
  return response.data;
};

export const crearBeneficiario = async (beneficiario: BeneficiarioCreate): Promise<Beneficiario> => {
  const response = await api.post<Beneficiario>('/beneficiarios', beneficiario);
  return response.data;
};

export const actualizarBeneficiario = async (id: number, beneficiario: BeneficiarioUpdate): Promise<void> => {
  await api.put(`/beneficiarios/${id}`, beneficiario);
};

export const eliminarBeneficiario = async (id: number): Promise<void> => {
  await api.delete(`/beneficiarios/${id}`);
};
