using backendWebApi.Data;
using backendWebApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Forzar a escuchar solo en HTTP para el reto técnico
builder.WebHost.UseUrls("http://localhost:5122");

// Servicios
builder.Services.AddControllers();
builder.Services.AddSingleton<SqlConnectionFactory>();
builder.Services.AddScoped<IDocumentoService, DocumentoService>();
builder.Services.AddScoped<IBeneficiarioService, BeneficiarioService>();

// CORS - permitir todo temporalmente en desarrollo
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Página de errores en Development (ver excepciones en la salida)
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Aplicar CORS antes de Swagger y antes de MapControllers
app.UseCors("AllowFrontend");

app.UseSwagger();
            // Usar endpoint RELATIVO
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1"));

// NO redirigir a HTTPS nunca en este entorno de reto
// (si quieres mantener la llamada, envuélvela en: if (!app.Environment.IsDevelopment()) )
app.UseAuthorization();
app.MapControllers();
app.Run();