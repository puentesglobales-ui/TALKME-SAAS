const fs = require('fs');
const path = require('path');

// Configuración
const ASSETS_DIR = path.join(__dirname, 'assets');
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('-v');

// Archivos requeridos vs opcionales
const REQUIRED_FILES = [
    'icon.png',
    'adaptive-icon.png'
];

const OPTIONAL_FILES = [
    'puentes_logo.png',
    'splash-icon.png'
];

const ALL_FILES = [...REQUIRED_FILES, ...OPTIONAL_FILES];

// Firma PNG: 89 50 4E 47 0D 0A 1A 0A
const PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
const JPEG_SIGNATURE = [0xFF, 0xD8, 0xFF]; // Common JPEG signature
const MIN_PNG_SIZE = 67; // Tamaño mínimo de un PNG válido

function validatePng(fileName) {
    const filePath = path.join(ASSETS_DIR, fileName);
    const isRequired = REQUIRED_FILES.includes(fileName);

    // Verificar existencia
    if (!fs.existsSync(filePath)) {
        if (isRequired) {
            console.error(`❌ MISSING REQUIRED: ${fileName}`);
            return false;
        } else {
            console.warn(`⚠️  Optional file not found: ${fileName} (Skipping)`);
            return true;
        }
    }

    try {
        const stats = fs.statSync(filePath);
        const fileSize = stats.size;

        if (VERBOSE) {
            console.log(`\n🔍 Checking: ${fileName}`);
            console.log(`   Path: ${filePath}`);
            console.log(`   Size: ${fileSize} bytes (${(fileSize / 1024).toFixed(2)} KB)`);
        }

        // Validar tamaño mínimo
        if (fileSize < MIN_PNG_SIZE) {
            console.error(`❌ INVALID SIZE: ${fileName}`);
            console.error(`   File is only ${fileSize} bytes (minimum valid PNG is ${MIN_PNG_SIZE} bytes)`);
            return false;
        }

        // Validar firma PNG
        const buffer = Buffer.alloc(8);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 8, 0);

        const isValidSignature = PNG_SIGNATURE.every((byte, index) => buffer[index] === byte);

        if (!isValidSignature) {
            console.error(`❌ CORRUPT/INVALID SIGNATURE: ${fileName}`);
            const hexHeader = buffer.toString('hex').toUpperCase();
            console.error(`   Header found: ${hexHeader}`);
            console.error(`   Expected:     89504E470D0A1A0A`);

            // Check if it's a JPEG disguised as PNG
            const isJpeg = JPEG_SIGNATURE.every((byte, index) => buffer[index] === byte);
            if (isJpeg) {
                console.error(`   🚨 DETECTED: This is actually a JPEG file! Rename it to .jpg or convert it to PNG.`);
            }

            fs.closeSync(fd);
            return false;
        }

        // Validación adicional: verificar chunk IHDR
        const ihdrLengthBuffer = Buffer.alloc(4);
        fs.readSync(fd, ihdrLengthBuffer, 0, 4, 8);

        const ihdrNameBuffer = Buffer.alloc(4);
        fs.readSync(fd, ihdrNameBuffer, 0, 4, 12);
        const ihdrName = ihdrNameBuffer.toString('ascii');

        fs.closeSync(fd);

        if (ihdrName !== 'IHDR') {
            console.warn(`⚠️  ${fileName} has valid signature but unexpected structure`);
            console.warn(`   Expected IHDR chunk, found: ${ihdrName}`);
            // No es crítico, pero advertimos
        }

        const sizeKB = (fileSize / 1024).toFixed(2);
        console.log(`✅ Valid PNG: ${fileName} (${sizeKB} KB)`);
        return true;

    } catch (error) {
        console.error(`💥 Error reading file ${fileName}:`, error.message);
        return false;
    }
}

// Ejecución principal
console.log('🔍 Iniciando Validación de Assets PNG...');
console.log(`📁 Directorio: ${ASSETS_DIR}\n`);

const results = ALL_FILES.map(file => ({
    name: file,
    required: REQUIRED_FILES.includes(file),
    valid: validatePng(file)
}));

// Resumen
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 RESUMEN DE VALIDACIÓN');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const totalFiles = results.length;
const validFiles = results.filter(r => r.valid).length;
const invalidFiles = results.filter(r => !r.valid).length;
const requiredChecked = results.filter(r => r.required).length;

console.log(`Total archivos verificados:  ${totalFiles}`);
console.log(`  ├─ Requeridos:             ${requiredChecked}`);
console.log(`  └─ Opcionales:             ${totalFiles - requiredChecked}`);
console.log(`\nResultados:`);
console.log(`  ✅ Válidos:                ${validFiles}`);
console.log(`  ❌ Inválidos/Faltantes:    ${invalidFiles}`);

const failedFiles = results.filter(r => !r.valid);
if (failedFiles.length > 0) {
    console.log('\n⚠️  Archivos con problemas:');
    failedFiles.forEach(f => {
        const type = f.required ? '[REQUERIDO]' : '[OPCIONAL]';
        console.log(`   • ${f.name} ${type}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('⛔ VALIDACIÓN FALLIDA');
    console.error('   Solución: Reemplaza los archivos marcados antes del build.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
} else {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ VALIDACIÓN EXITOSA - Todos los assets están correctos');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
}
