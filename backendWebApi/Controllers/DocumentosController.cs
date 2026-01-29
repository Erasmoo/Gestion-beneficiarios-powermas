using backendWebApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace backendWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentosController : ControllerBase
    {
        private readonly IDocumentoService _documentoService;
        private readonly ILogger<DocumentosController> _logger;

        public DocumentosController(
            IDocumentoService documentoService,
            ILogger<DocumentosController> logger)
        {
            _documentoService = documentoService;
            _logger = logger;
        }

        // GET: api/documentos
        [HttpGet]
        public async Task<IActionResult> GetDocumentosActivos()
        {
            try
            {
                var documentos = await _documentoService.ObtenerDocumentosActivosAsync();
                return Ok(documentos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener documentos activos");
                return StatusCode(500, new { message = "Error al obtener los documentos" });
            }
        }

        // GET: api/documentos/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDocumento(int id)
        {
            try
            {
                var documento = await _documentoService.ObtenerDocumentoPorIdAsync(id);

                if (documento == null)
                    return NotFound(new { message = $"Documento con ID {id} no encontrado" });

                return Ok(documento);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener documento {Id}", id);
                return StatusCode(500, new { message = "Error al obtener el documento" });
            }
        }
    }
}