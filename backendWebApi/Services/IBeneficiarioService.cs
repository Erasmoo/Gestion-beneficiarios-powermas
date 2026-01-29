using backendWebApi.Models;

namespace backendWebApi.Services
{
    public interface IBeneficiarioService
    {
        Task<IEnumerable<Beneficiario>> ObtenerTodosAsync();
        Task<Beneficiario?> ObtenerPorIdAsync(int id);
        Task<int> CrearAsync(BeneficiarioCreateDto beneficiario);
        Task ActualizarAsync(BeneficiarioUpdateDto beneficiario);
        Task EliminarAsync(int id);
    }
}