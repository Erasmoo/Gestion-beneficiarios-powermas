using backendWebApi.Models;


namespace backendWebApi.Services
{
    public interface IDocumentoService
    {
        Task<IEnumerable<DocumentoIdentidad>> ObtenerDocumentosActivosAsync();
        Task<DocumentoIdentidad?> ObtenerDocumentoPorIdAsync(int id);
    }
}