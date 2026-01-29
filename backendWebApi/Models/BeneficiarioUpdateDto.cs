using System.ComponentModel.DataAnnotations;

namespace backendWebApi.Models
{
    public class BeneficiarioUpdateDto
    {
        [Required]
        public int Id { get; set; }

        [Required(ErrorMessage = "Los nombres son obligatorios")]
        [StringLength(100)]
        public string Nombres { get; set; } = string.Empty;

        [Required(ErrorMessage = "Los apellidos son obligatorios")]
        [StringLength(100)]
        public string Apellidos { get; set; } = string.Empty;

        [Required(ErrorMessage = "El tipo de documento es obligatorio")]
        public int DocumentoIdentidadId { get; set; }

        [Required(ErrorMessage = "El número de documento es obligatorio")]
        [StringLength(20)]
        public string NumeroDocumento { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria")]
        public DateTime FechaNacimiento { get; set; }

        [Required(ErrorMessage = "El sexo es obligatorio")]
        [RegularExpression("^[MF]$")]
        public char Sexo { get; set; }
    }
}