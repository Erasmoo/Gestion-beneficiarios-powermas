using backendWebApi.Data;
using backendWebApi.Models;
using Dapper;
using System.Data;

namespace backendWebApi.Services
{
    public class BeneficiarioService : IBeneficiarioService
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public BeneficiarioService(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<Beneficiario>> ObtenerTodosAsync()
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryAsync<Beneficiario>(
                "sp_ListarBeneficiarios",
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<Beneficiario?> ObtenerPorIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryFirstOrDefaultAsync<Beneficiario>(
                "sp_ObtenerBeneficiarioPorId",
                new { Id = id },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> CrearAsync(BeneficiarioCreateDto beneficiario)
        {
            using var connection = _connectionFactory.CreateConnection();

            var resultado = await connection.QueryFirstAsync<int>(
                "sp_InsertarBeneficiario",
                new
                {
                    Nombres = beneficiario.Nombres,
                    Apellidos = beneficiario.Apellidos,
                    DocumentoIdentidadId = beneficiario.DocumentoIdentidadId,
                    NumeroDocumento = beneficiario.NumeroDocumento,
                    FechaNacimiento = beneficiario.FechaNacimiento,
                    Sexo = beneficiario.Sexo
                },
                commandType: CommandType.StoredProcedure
            );

            return resultado;
        }

        public async Task ActualizarAsync(BeneficiarioUpdateDto beneficiario)
        {
            using var connection = _connectionFactory.CreateConnection();

            await connection.ExecuteAsync(
                "sp_ActualizarBeneficiario",
                new
                {
                    Id = beneficiario.Id,
                    Nombres = beneficiario.Nombres,
                    Apellidos = beneficiario.Apellidos,
                    DocumentoIdentidadId = beneficiario.DocumentoIdentidadId,
                    NumeroDocumento = beneficiario.NumeroDocumento,
                    FechaNacimiento = beneficiario.FechaNacimiento,
                    Sexo = beneficiario.Sexo
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task EliminarAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();

            await connection.ExecuteAsync(
                "sp_EliminarBeneficiario",
                new { Id = id },
                commandType: CommandType.StoredProcedure
            );
        }
    }
}