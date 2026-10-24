// scripts/generate-zip.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const stagingDir = path.join(rootDir, 'temp_zip_staging');
const zipFileName = 'proyecto-2-sistemas-distribuidos-irina-rivera.zip';
const zipFilePath = path.join(rootDir, zipFileName);

// 1. Limpiar staging previo o zip previo
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
if (fs.existsSync(zipFilePath)) {
  fs.rmSync(zipFilePath, { force: true });
}

fs.mkdirSync(stagingDir, { recursive: true });

// 2. Función recursiva de copiado con exclusiones estrictas
const EXCLUDED_NAMES = new Set([
  'node_modules',
  'dist',
  '.git',
  '.git_backup',
  '.wrangler',
  '.env',
  '.env.local',
  'temp_zip_staging',
  'worker-configuration.d.ts',
  zipFileName
]);

function copyDirRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    const baseName = path.basename(src);
    if (EXCLUDED_NAMES.has(baseName)) {
      return;
    }
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (EXCLUDED_NAMES.has(entry)) continue;
      copyDirRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    const baseName = path.basename(src);
    if (EXCLUDED_NAMES.has(baseName)) {
      return;
    }
    // No incluir archivos .zip o .log temporales
    if (baseName.endsWith('.log') || baseName.endsWith('.tmp') || baseName.endsWith('.zip')) {
      return;
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('📦 Copiando archivos del proyecto al área de preparación...');

// Elementos a incluir
const ITEMS_TO_INCLUDE = [
  'README.md',
  'netlify.toml',
  'package.json',
  '.env.example',
  '.gitignore',
  'netlify',
  'data',
  'scripts',
  'frontend',
  'backend'
];

for (const item of ITEMS_TO_INCLUDE) {
  const itemPath = path.join(rootDir, item);
  if (fs.existsSync(itemPath)) {
    console.log(`  + Incluyendo ${item}...`);
    copyDirRecursive(itemPath, path.join(stagingDir, item));
  }
}

// 3. Crear el archivo ZIP usando PowerShell Compress-Archive
console.log('🗜️ Comprimiendo archivos en ZIP...');
const psCommand = `powershell -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipFilePath}' -Force"`;
execSync(psCommand, { stdio: 'inherit' });

// 4. Limpiar staging
fs.rmSync(stagingDir, { recursive: true, force: true });

// 5. Validar peso
const stats = fs.statSync(zipFilePath);
const sizeBytes = stats.size;
const sizeKB = (sizeBytes / 1024).toFixed(2);
const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);

console.log('====================================');
console.log(`✅ Archivo ZIP generado exitosamente: ${zipFileName}`);
console.log(`📊 Peso: ${sizeKB} KB (${sizeMB} MB)`);
console.log(`🎯 Límite: 2.00 MB`);
if (sizeBytes < 2 * 1024 * 1024) {
  console.log(`🎉 ¡CUMPLE EL REQUISITO! Pesa menos de 2 MB.`);
} else {
  console.log(`⚠️ Alerta: Pesa más de 2 MB.`);
}
console.log('====================================');
