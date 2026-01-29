-- ============================================
-- PASO 1: CREAR BASE DE DATOS
-- ============================================
USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'BeneficiariosDB')
BEGIN
    ALTER DATABASE BeneficiariosDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BeneficiariosDB;
END
GO

CREATE DATABASE BeneficiariosDB;
GO

USE BeneficiariosDB;
GO

-- ============================================
-- PASO 2: CREAR TABLAS
-- ============================================

-- Tabla: DocumentoIdentidad (Catálogo de TIPOS de documentos)
CREATE TABLE DocumentoIdentidad (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,           -- Ej: "Documento Nacional de Identidad"
    Abreviatura VARCHAR(10) NOT NULL,      -- Ej: "DNI"
    Pais VARCHAR(50) NOT NULL,             -- Ej: "Perú"
    Longitud INT NOT NULL,                 -- Ej: 8
    SoloNumeros BIT NOT NULL,              -- Ej: 1 (true)
    Activo BIT NOT NULL DEFAULT 1
);
GO

-- Tabla: Beneficiario (Personas registradas)
CREATE TABLE Beneficiario (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombres VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    DocumentoIdentidadId INT NOT NULL,     -- FK al TIPO de documento
    NumeroDocumento VARCHAR(20) NOT NULL,  -- El número específico
    FechaNacimiento DATE NOT NULL,
    Sexo CHAR(1) NOT NULL CHECK (Sexo IN ('M', 'F')),
    CONSTRAINT FK_Beneficiario_DocumentoIdentidad 
        FOREIGN KEY (DocumentoIdentidadId) 
        REFERENCES DocumentoIdentidad(Id)
);
GO

-- ============================================
-- PASO 3: INSERTAR DATOS DE EJEMPLO
-- ============================================

-- Documentos de Identidad de varios países
INSERT INTO DocumentoIdentidad (Nombre, Abreviatura, Pais, Longitud, SoloNumeros, Activo)
VALUES 
    ('Documento Nacional de Identidad', 'DNI', 'Perú', 8, 1, 1),
    ('Pasaporte', 'PAS', 'Perú', 12, 0, 1),
    ('Carnet de Extranjería', 'CE', 'Perú', 9, 0, 1),
    ('Cédula de Ciudadanía', 'CC', 'Colombia', 10, 1, 1),
    ('Cédula de Identidad', 'CI', 'Ecuador', 10, 1, 1),
    ('RUT', 'RUT', 'Chile', 9, 0, 1);
GO

-- Beneficiarios de ejemplo
INSERT INTO Beneficiario (Nombres, Apellidos, DocumentoIdentidadId, NumeroDocumento, FechaNacimiento, Sexo)
VALUES 
    ('Juan Carlos', 'Pérez López', 1, '12345678', '1990-05-15', 'M'),
    ('María Isabel', 'García Torres', 1, '87654321', '1985-08-20', 'F'),
    ('Pedro José', 'Ramírez Silva', 4, '1234567890', '1992-03-10', 'M'),
    ('Ana Lucía', 'Martínez Flores', 5, '0987654321', '1988-11-25', 'F');
GO

-- ============================================
-- PASO 4: STORED PROCEDURES
-- ============================================

-- SP 1: Listar documentos activos
CREATE PROCEDURE sp_ListarDocumentosActivos
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Nombre,
        Abreviatura,
        Pais,
        Longitud,
        SoloNumeros,
        Activo
    FROM DocumentoIdentidad 
    WHERE Activo = 1
    ORDER BY Pais, Nombre;
END
GO

-- SP 2: Obtener un documento por ID
CREATE PROCEDURE sp_ObtenerDocumentoPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Nombre,
        Abreviatura,
        Pais,
        Longitud,
        SoloNumeros,
        Activo
    FROM DocumentoIdentidad 
    WHERE Id = @Id;
END
GO

-- SP 3: Listar todos los beneficiarios
CREATE PROCEDURE sp_ListarBeneficiarios
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        b.Id,
        b.Nombres,
        b.Apellidos,
        b.DocumentoIdentidadId,
        d.Nombre AS TipoDocumento,
        d.Abreviatura AS AbreviaturaDocumento,
        b.NumeroDocumento,
        b.FechaNacimiento,
        b.Sexo
    FROM Beneficiario b
    INNER JOIN DocumentoIdentidad d ON b.DocumentoIdentidadId = d.Id
    ORDER BY b.Apellidos, b.Nombres;
END
GO

-- SP 4: Obtener beneficiario por ID
CREATE PROCEDURE sp_ObtenerBeneficiarioPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        b.Id,
        b.Nombres,
        b.Apellidos,
        b.DocumentoIdentidadId,
        d.Nombre AS TipoDocumento,
        d.Abreviatura AS AbreviaturaDocumento,
        b.NumeroDocumento,
        b.FechaNacimiento,
        b.Sexo
    FROM Beneficiario b
    INNER JOIN DocumentoIdentidad d ON b.DocumentoIdentidadId = d.Id
    WHERE b.Id = @Id;
END
GO

-- SP 5: Insertar beneficiario
CREATE PROCEDURE sp_InsertarBeneficiario
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento VARCHAR(20),
    @FechaNacimiento DATE,
    @Sexo CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que el tipo de documento existe
    IF NOT EXISTS (SELECT 1 FROM DocumentoIdentidad WHERE Id = @DocumentoIdentidadId AND Activo = 1)
    BEGIN
        RAISERROR ('El tipo de documento no existe o está inactivo', 16, 1);
        RETURN;
    END
    
    -- Insertar beneficiario
    INSERT INTO Beneficiario (
        Nombres, 
        Apellidos, 
        DocumentoIdentidadId, 
        NumeroDocumento, 
        FechaNacimiento, 
        Sexo
    )
    VALUES (
        @Nombres, 
        @Apellidos, 
        @DocumentoIdentidadId, 
        @NumeroDocumento, 
        @FechaNacimiento, 
        @Sexo
    );
    
    -- Retornar el ID del nuevo registro
    SELECT SCOPE_IDENTITY() AS NuevoId;
END
GO

-- SP 6: Actualizar beneficiario
CREATE PROCEDURE sp_ActualizarBeneficiario
    @Id INT,
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @DocumentoIdentidadId INT,
    @NumeroDocumento VARCHAR(20),
    @FechaNacimiento DATE,
    @Sexo CHAR(1)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que existe el beneficiario
    IF NOT EXISTS (SELECT 1 FROM Beneficiario WHERE Id = @Id)
    BEGIN
        RAISERROR ('El beneficiario no existe', 16, 1);
        RETURN;
    END
    
    -- Validar que el tipo de documento existe
    IF NOT EXISTS (SELECT 1 FROM DocumentoIdentidad WHERE Id = @DocumentoIdentidadId AND Activo = 1)
    BEGIN
        RAISERROR ('El tipo de documento no existe o está inactivo', 16, 1);
        RETURN;
    END
    
    -- Actualizar
    UPDATE Beneficiario
    SET 
        Nombres = @Nombres,
        Apellidos = @Apellidos,
        DocumentoIdentidadId = @DocumentoIdentidadId,
        NumeroDocumento = @NumeroDocumento,
        FechaNacimiento = @FechaNacimiento,
        Sexo = @Sexo
    WHERE Id = @Id;
END
GO

-- SP 7: Eliminar beneficiario
CREATE PROCEDURE sp_EliminarBeneficiario
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar que existe
    IF NOT EXISTS (SELECT 1 FROM Beneficiario WHERE Id = @Id)
    BEGIN
        RAISERROR ('El beneficiario no existe', 16, 1);
        RETURN;
    END
    
    -- Eliminar
    DELETE FROM Beneficiario WHERE Id = @Id;
END
GO

-- ============================================
-- PASO 5: VERIFICACIÓN
-- ============================================

-- Ver documentos
SELECT * FROM DocumentoIdentidad;

-- Ver beneficiarios
EXEC sp_ListarBeneficiarios;

GO
