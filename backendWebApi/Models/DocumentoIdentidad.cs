namespace backendWebApi.Models
{
    public class DocumentoIdentidad
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Abreviatura { get; set; } = string.Empty;
        public string Pais { get; set; } = string.Empty;
        public int Longitud { get; set; }
        public bool SoloNumeros { get; set; }
        public bool Activo { get; set; }
    }
}