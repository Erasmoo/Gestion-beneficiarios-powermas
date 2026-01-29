import React, { useEffect, useState } from 'react';
import type { Beneficiario } from '../types';
import { obtenerBeneficiarios, eliminarBeneficiario } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BeneficiarioList: React.FC = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [beneficiarioAEliminar, setBeneficiarioAEliminar] = useState<{
    id: number;
    nombre: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarBeneficiarios();
  }, []);

  const cargarBeneficiarios = async () => {
    try {
      setLoading(true);
      const data = await obtenerBeneficiarios();
      setBeneficiarios(data);
    } catch (error) {
      toast.error('Error al cargar los beneficiarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const solicitarEliminar = (id: number, nombre: string) => {
    setBeneficiarioAEliminar({ id, nombre });
    setConfirmOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!beneficiarioAEliminar) return;

    try {
      setEliminando(true);
      await eliminarBeneficiario(beneficiarioAEliminar.id);
      toast.success('Beneficiario eliminado correctamente');
      setConfirmOpen(false);
      setBeneficiarioAEliminar(null);
      cargarBeneficiarios();
    } catch (error) {
      toast.error('Error al eliminar el beneficiario');
      console.error(error);
    } finally {
      setEliminando(false);
    }
  };

  const beneficiariosFiltrados = beneficiarios.filter(
    (b) =>
      b.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.numeroDocumento.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-[0_0_40px_rgba(15,23,42,0.9)] p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-50 tracking-tight">
              Lista de Beneficiarios
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              Total: {beneficiarios.length} beneficiario(s)
            </p>
          </div>
          <button
            onClick={() => navigate('/nuevo')}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-[0_0_16px_rgba(148,163,184,0.4)] hover:shadow-[0_0_22px_rgba(148,163,184,0.65)] hover:brightness-105 transition-all border border-slate-500/70 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Beneficiario
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-[0_0_50px_rgba(15,23,42,0.95)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">
                  Nombres
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">
                  Apellidos
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">
                  Documento
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">
                  Fecha Nacimiento
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">
                  Sexo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.18em]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-950/40 divide-y divide-slate-800/80">
              {beneficiariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    {searchTerm
                      ? 'No se encontraron resultados'
                      : 'No hay beneficiarios registrados'}
                  </td>
                </tr>
              ) : (
                beneficiariosFiltrados.map((beneficiario) => (
                  <tr
                    key={beneficiario.id}
                    className="hover:bg-slate-900/70 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-50">
                      {beneficiario.nombres}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {beneficiario.apellidos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-50">
                          {beneficiario.abreviaturaDocumento}
                        </span>
                        <span className="text-slate-400">
                          {beneficiario.numeroDocumento}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {new Date(beneficiario.fechaNacimiento).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          beneficiario.sexo === 'M'
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40'
                            : 'bg-pink-500/15 text-pink-300 border border-pink-500/40'
                        }`}
                      >
                        {beneficiario.sexo === 'M' ? 'Masculino' : 'Femenino'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/editar/${beneficiario.id}`)}
                        className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          solicitarEliminar(
                            beneficiario.id,
                            `${beneficiario.nombres} ${beneficiario.apellidos}`
                          )
                        }
                        className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {confirmOpen && beneficiarioAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl shadow-[0_0_40px_rgba(15,23,42,0.9)] max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-slate-50">
              ¿Eliminar beneficiario?
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Estás a punto de eliminar a{' '}
              <span className="font-semibold text-slate-100">
                {beneficiarioAEliminar.nombre}
              </span>
              . Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (eliminando) return;
                  setConfirmOpen(false);
                  setBeneficiarioAEliminar(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-600 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={eliminando}
                onClick={confirmarEliminar}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-slate-50 font-semibold border border-rose-500/70 shadow-[0_0_20px_rgba(244,63,94,0.55)] hover:shadow-[0_0_26px_rgba(248,113,113,0.75)] disabled:bg-rose-900 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiarioList;
