using backendWebApi.Data;
using backendWebApi.Models;
using Dapper;
using System.Data;

namespace backendWebApi.Services
{
    public class DocumentoService : IDocumentoService
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public DocumentoService(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<DocumentoIdentidad>> ObtenerDocumentosActivosAsync()
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryAsync<DocumentoIdentidad>(
                "sp_ListarDocumentosActivos",
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<DocumentoIdentidad?> ObtenerDocumentoPorIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryFirstOrDefaultAsync<DocumentoIdentidad>(
                "sp_ObtenerDocumentoPorId",
                new { Id = id },
                commandType: CommandType.StoredProcedure
            );
        }
    }
}