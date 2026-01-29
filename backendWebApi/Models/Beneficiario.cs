namespace backendWebApi.Models
{
    public class Beneficiario
    {
        public int Id { get; set; }
        public string Nombres { get; set; } = string.Empty;
        public string Apellidos { get; set; } = string.Empty;
        public int DocumentoIdentidadId { get; set; }
        public string NumeroDocumento { get; set; } = string.Empty;
        public DateTime FechaNacimiento { get; set; }
        public char Sexo { get; set; }

        // Propiedades adicionales del JOIN
        public string? TipoDocumento { get; set; }
        public string? AbreviaturaDocumento { get; set; }
    }
}