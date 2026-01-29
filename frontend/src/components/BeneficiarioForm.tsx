import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import type { DocumentoIdentidad, BeneficiarioCreate } from '../types';
import {
  obtenerDocumentosActivos,
  crearBeneficiario,
  actualizarBeneficiario,
  obtenerBeneficiarioPorId,
  obtenerDocumentoPorId,
  obtenerBeneficiarios,
} from '../services/api';
import toast from 'react-hot-toast';

const BeneficiarioForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [documentos, setDocumentos] = useState<DocumentoIdentidad[]>([]);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<DocumentoIdentidad | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDocumentos, setLoadingDocumentos] = useState(true);

  const [formData, setFormData] = useState<BeneficiarioCreate>({
    nombres: '',
    apellidos: '',
    documentoIdentidadId: 0,
    numeroDocumento: '',
    fechaNacimiento: '',
    sexo: 'M',
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const cargarDocumentos = useCallback(async () => {
    try {
      setLoadingDocumentos(true);
      const data = await obtenerDocumentosActivos();
      setDocumentos(data);
    } catch (error) {
      toast.error('Error al cargar los tipos de documento');
      console.error(error);
    } finally {
      setLoadingDocumentos(false);
    }
  }, []);

  const cargarBeneficiario = useCallback(async (beneficiarioId: number) => {
    try {
      setLoading(true);
      const beneficiario = await obtenerBeneficiarioPorId(beneficiarioId);
      
      setFormData({
        nombres: beneficiario.nombres,
        apellidos: beneficiario.apellidos,
        documentoIdentidadId: beneficiario.documentoIdentidadId,
        numeroDocumento: beneficiario.numeroDocumento,
        fechaNacimiento: beneficiario.fechaNacimiento.split('T')[0],
        sexo: beneficiario.sexo,
      });

      // Cargar el documento seleccionado
      const doc = await obtenerDocumentoPorId(beneficiario.documentoIdentidadId);
      setDocumentoSeleccionado(doc);
    } catch (error) {
      toast.error('Error al cargar el beneficiario');
      console.error(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleDocumentoChange = async (documentoId: number) => {
    const doc = documentos.find((d) => d.id === documentoId);
    setDocumentoSeleccionado(doc || null);
    setFormData((prev) => ({
      ...prev,
      documentoIdentidadId: documentoId,
      numeroDocumento: '',
    }));
    setErrores((prev) => {
      const nuevos = { ...prev };
      delete nuevos.numeroDocumento;
      delete nuevos.documentoIdentidadId;
      return nuevos;
    });
  };

  const validarNumeroDocumento = useCallback(
    (valor: string): string | null => {
      if (!documentoSeleccionado) return null;

      if (valor.length !== documentoSeleccionado.longitud) {
        return `Debe tener exactamente ${documentoSeleccionado.longitud} caracteres`;
      }

      if (documentoSeleccionado.soloNumeros && !/^\d+$/.test(valor)) {
        return 'Solo se permiten números';
      }

      return null;
    },
    [documentoSeleccionado],
  );

  // Cargar documentos activos
  useEffect(() => {
    cargarDocumentos();
  }, [cargarDocumentos]);

  // Cargar datos del beneficiario si es edición
  useEffect(() => {
    if (esEdicion && id) {
      cargarBeneficiario(parseInt(id));
    }
  }, [esEdicion, id, cargarBeneficiario]);

  // Validar documento cuando cambia el tipo o el número
  useEffect(() => {
    if (documentoSeleccionado && formData.numeroDocumento) {
      const mensajeError = validarNumeroDocumento(formData.numeroDocumento);

      if (mensajeError) {
        setErrores((prev) => ({
          ...prev,
          numeroDocumento: mensajeError,
        }));
      } else {
        setErrores((prev) => {
          const nuevos = { ...prev };
          delete nuevos.numeroDocumento;
          return nuevos;
        });
      }
    }
  }, [documentoSeleccionado, formData.numeroDocumento, validarNumeroDocumento]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrores((prev) => {
      const nuevos = { ...prev };

      if (name === 'nombres' || name === 'apellidos') {
        const nuevoNombre =
          name === 'nombres' ? value : formData.nombres;
        const nuevoApellido =
          name === 'apellidos' ? value : formData.apellidos;

        if (!nuevoNombre.trim()) {
          nuevos.nombres = 'Los nombres son obligatorios';
        } else if (
          !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nuevoNombre.trim())
        ) {
          nuevos.nombres =
            'Los nombres solo pueden contener letras y espacios';
        } else {
          delete nuevos.nombres;
        }

        if (!nuevoApellido.trim()) {
          nuevos.apellidos = 'Los apellidos son obligatorios';
        } else if (
          !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nuevoApellido.trim())
        ) {
          nuevos.apellidos =
            'Los apellidos solo pueden contener letras y espacios';
        } else {
          delete nuevos.apellidos;
        }

        if (
          nuevoNombre.trim() &&
          nuevoApellido.trim() &&
          nuevoNombre.trim().toLowerCase() ===
            nuevoApellido.trim().toLowerCase()
        ) {
          nuevos.apellidos = 'Los nombres y apellidos no pueden ser iguales';
        }
      }

      if (name === 'fechaNacimiento') {
        if (!value) {
          nuevos.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
        } else {
          delete nuevos.fechaNacimiento;
        }
      }

      if (name === 'numeroDocumento') {
        delete nuevos.numeroDocumento;
      }

      return nuevos;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: { [key: string]: string } = {};

    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres son obligatorios';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.nombres.trim())) {
      nuevosErrores.nombres = 'Los nombres solo pueden contener letras y espacios';
    }

    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.apellidos.trim())) {
      nuevosErrores.apellidos = 'Los apellidos solo pueden contener letras y espacios';
    }

    if (
      formData.nombres.trim() &&
      formData.apellidos.trim() &&
      formData.nombres.trim().toLowerCase() === formData.apellidos.trim().toLowerCase()
    ) {
      nuevosErrores.apellidos = 'Los nombres y apellidos no pueden ser iguales';
    }

    if (formData.documentoIdentidadId === 0) {
      nuevosErrores.documentoIdentidadId = 'Debe seleccionar un tipo de documento';
    }

    if (!formData.numeroDocumento.trim()) {
      nuevosErrores.numeroDocumento = 'El número de documento es obligatorio';
    } else if (documentoSeleccionado) {
      const mensajeError = validarNumeroDocumento(formData.numeroDocumento);
      if (mensajeError) {
        nuevosErrores.numeroDocumento = mensajeError;
      }
    }

    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);

      if (formData.documentoIdentidadId !== 0 && formData.numeroDocumento.trim()) {
        const numeroDocumentoLimpio = formData.numeroDocumento.trim();
        const beneficiarios = await obtenerBeneficiarios();
        const idActual = esEdicion && id ? parseInt(id) : null;

        const existeDni = beneficiarios.some(
          (b) =>
            b.documentoIdentidadId === formData.documentoIdentidadId &&
            b.numeroDocumento === numeroDocumentoLimpio &&
            (idActual === null || b.id !== idActual),
        );

        if (existeDni) {
          setErrores((prev) => ({
            ...prev,
            numeroDocumento: 'Ese número de documento ya existe',
          }));
          toast.error('Ese número de documento ya está registrado');
          setLoading(false);
          return;
        }
      }

      if (esEdicion && id) {
        await actualizarBeneficiario(parseInt(id), {
          id: parseInt(id),
          ...formData,
        });
        toast.success('Beneficiario actualizado correctamente');
      } else {
        await crearBeneficiario(formData);
        toast.success('Beneficiario creado correctamente');
      }

      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError.response?.data?.message || 'Error al guardar el beneficiario'
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingDocumentos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl shadow-[0_0_50px_rgba(15,23,42,0.95)] p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-50 tracking-tight">
            {esEdicion ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}
          </h2>
          <p className="text-slate-400 mt-1 text-sm">
            Complete todos los campos del formulario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Nombres <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                errores.nombres ? 'border-red-500/80' : 'border-slate-700'
              }`}
              placeholder="Ej: Juan Carlos"
            />
            {errores.nombres && (
              <p className="text-red-500 text-sm mt-1">{errores.nombres}</p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                errores.apellidos ? 'border-red-500/80' : 'border-slate-700'
              }`}
              placeholder="Ej: Pérez López"
            />
            {errores.apellidos && (
              <p className="text-red-500 text-sm mt-1">{errores.apellidos}</p>
            )}
          </div>

          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Tipo de Documento <span className="text-red-500">*</span>
            </label>
            <select
              name="documentoIdentidadId"
              value={formData.documentoIdentidadId}
              onChange={(e) => handleDocumentoChange(parseInt(e.target.value))}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                errores.documentoIdentidadId ? 'border-red-500/80' : 'border-slate-700'
              }`}
            >
              <option value={0}>Seleccione un tipo de documento</option>
              {documentos.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nombre} ({doc.abreviatura}) - {doc.pais}
                </option>
              ))}
            </select>
            {errores.documentoIdentidadId && (
              <p className="text-red-500 text-sm mt-1">
                {errores.documentoIdentidadId}
              </p>
            )}
          </div>

          {/* Número de Documento */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Número de Documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              disabled={!documentoSeleccionado}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                errores.numeroDocumento ? 'border-red-500/80' : 'border-slate-700'
              } ${!documentoSeleccionado ? 'opacity-70 cursor-not-allowed' : ''}`}
              placeholder={
                documentoSeleccionado
                  ? `Ingrese ${documentoSeleccionado.longitud} ${
                      documentoSeleccionado.soloNumeros ? 'dígitos' : 'caracteres'
                    }`
                  : 'Seleccione primero un tipo de documento'
              }
            />
            {documentoSeleccionado && (
              <p className="text-sm text-slate-400 mt-1">
                ℹ️ Debe tener {documentoSeleccionado.longitud}{' '}
                {documentoSeleccionado.soloNumeros
                  ? 'dígitos numéricos'
                  : 'caracteres alfanuméricos'}
              </p>
            )}
            {errores.numeroDocumento && (
              <p className="text-red-500 text-sm mt-1">
                {errores.numeroDocumento}
              </p>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Fecha de Nacimiento <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
                errores.fechaNacimiento ? 'border-red-500/80' : 'border-slate-700'
              }`}
            />
            {errores.fechaNacimiento && (
              <p className="text-red-500 text-sm mt-1">
                {errores.fechaNacimiento}
              </p>
            )}
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Sexo <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="M"
                  checked={formData.sexo === 'M'}
                  onChange={handleChange}
                  className="w-4 h-4 text-sky-400 focus:ring-sky-500 bg-slate-900 border-slate-600"
                />
                <span className="ml-2 text-slate-200">Masculino</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sexo"
                  value="F"
                  checked={formData.sexo === 'F'}
                  onChange={handleChange}
                  className="w-4 h-4 text-sky-400 focus:ring-sky-500 bg-slate-900 border-slate-600"
                />
                <span className="ml-2 text-slate-200">Femenino</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 text-slate-900 px-6 py-3 rounded-xl hover:shadow-[0_0_22px_rgba(148,163,184,0.65)] disabled:bg-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed font-semibold shadow-[0_0_16px_rgba(148,163,184,0.4)] transition-all border border-slate-500/70 cursor-pointer"
            >
              {loading
                ? 'Guardando...'
                : esEdicion
                ? 'Actualizar Beneficiario'
                : 'Crear Beneficiario'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={loading}
              className="flex-1 bg-slate-800 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-700 disabled:cursor-not-allowed font-medium transition-all border border-slate-600 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeneficiarioForm;
