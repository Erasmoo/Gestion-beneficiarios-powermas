using backendWebApi.Models;
using backendWebApi.Services;

using Microsoft.AspNetCore.Mvc;

namespace backendWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BeneficiariosController : ControllerBase
    {
        private readonly IBeneficiarioService _beneficiarioService;
        private readonly ILogger<BeneficiariosController> _logger;

        public BeneficiariosController(
            IBeneficiarioService beneficiarioService,
            ILogger<BeneficiariosController> logger)
        {
            _beneficiarioService = beneficiarioService;
            _logger = logger;
        }

        // GET: api/beneficiarios
        [HttpGet]
        public async Task<IActionResult> GetBeneficiarios()
        {
            try
            {
                var beneficiarios = await _beneficiarioService.ObtenerTodosAsync();
                return Ok(beneficiarios);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener beneficiarios");
                return StatusCode(500, new { message = "Error al obtener los beneficiarios" });
            }
        }

        // GET: api/beneficiarios/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBeneficiario(int id)
        {
            try
            {
                var beneficiario = await _beneficiarioService.ObtenerPorIdAsync(id);

                if (beneficiario == null)
                    return NotFound(new { message = $"Beneficiario con ID {id} no encontrado" });

                return Ok(beneficiario);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener beneficiario {Id}", id);
                return StatusCode(500, new { message = "Error al obtener el beneficiario" });
            }
        }

        // POST: api/beneficiarios
        [HttpPost]
        public async Task<IActionResult> CreateBeneficiario([FromBody] BeneficiarioCreateDto beneficiario)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var nuevoId = await _beneficiarioService.CrearAsync(beneficiario);

                var beneficiarioCreado = await _beneficiarioService.ObtenerPorIdAsync(nuevoId);

                return CreatedAtAction(
                    nameof(GetBeneficiario),
                    new { id = nuevoId },
                    beneficiarioCreado
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear beneficiario");
                return StatusCode(500, new { message = "Error al crear el beneficiario: " + ex.Message });
            }
        }

        // PUT: api/beneficiarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBeneficiario(int id, [FromBody] BeneficiarioUpdateDto beneficiario)
        {
            try
            {
                if (id != beneficiario.Id)
                    return BadRequest(new { message = "El ID de la URL no coincide con el ID del beneficiario" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var beneficiarioExistente = await _beneficiarioService.ObtenerPorIdAsync(id);
                if (beneficiarioExistente == null)
                    return NotFound(new { message = $"Beneficiario con ID {id} no encontrado" });

                await _beneficiarioService.ActualizarAsync(beneficiario);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar beneficiario {Id}", id);
                return StatusCode(500, new { message = "Error al actualizar el beneficiario: " + ex.Message });
            }
        }

        // DELETE: api/beneficiarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBeneficiario(int id)
        {
            try
            {
                var beneficiario = await _beneficiarioService.ObtenerPorIdAsync(id);
                if (beneficiario == null)
                    return NotFound(new { message = $"Beneficiario con ID {id} no encontrado" });

                await _beneficiarioService.EliminarAsync(id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar beneficiario {Id}", id);
                return StatusCode(500, new { message = "Error al eliminar el beneficiario: " + ex.Message });
            }
        }
    }
}