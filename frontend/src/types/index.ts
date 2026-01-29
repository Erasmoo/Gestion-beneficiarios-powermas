export interface DocumentoIdentidad {
  id: number;
  nombre: string;
  abreviatura: string;
  pais: string;
  longitud: number;
  soloNumeros: boolean;
  activo: boolean;
}

export interface Beneficiario {
  id: number;
  nombres: string;
  apellidos: string;
  documentoIdentidadId: number;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
  tipoDocumento?: string;
  abreviaturaDocumento?: string;
}

export interface BeneficiarioCreate {
  nombres: string;
  apellidos: string;
  documentoIdentidadId: number;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
}

export interface BeneficiarioUpdate extends BeneficiarioCreate {
  id: number;
}