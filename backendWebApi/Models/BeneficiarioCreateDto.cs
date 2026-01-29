using System.ComponentModel.DataAnnotations;

namespace backendWebApi.Models
{
    public class BeneficiarioCreateDto
    {
        [Required(ErrorMessage = "Los nombres son obligatorios")]
        [StringLength(100, ErrorMessage = "Los nombres no pueden exceder 100 caracteres")]
        public string Nombres { get; set; } = string.Empty;

        [Required(ErrorMessage = "Los apellidos son obligatorios")]
        [StringLength(100, ErrorMessage = "Los apellidos no pueden exceder 100 caracteres")]
        public string Apellidos { get; set; } = string.Empty;

        [Required(ErrorMessage = "El tipo de documento es obligatorio")]
        public int DocumentoIdentidadId { get; set; }

        [Required(ErrorMessage = "El número de documento es obligatorio")]
        [StringLength(20, ErrorMessage = "El número de documento no puede exceder 20 caracteres")]
        public string NumeroDocumento { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria")]
        public DateTime FechaNacimiento { get; set; }

        [Required(ErrorMessage = "El sexo es obligatorio")]
        [RegularExpression("^[MF]$", ErrorMessage = "El sexo debe ser 'M' o 'F'")]
        public char Sexo { get; set; }
    }
}