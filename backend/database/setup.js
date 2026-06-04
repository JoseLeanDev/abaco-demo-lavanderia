require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando setup completo de base de datos...\n');

// 1. Ejecutar migración de schema
console.log('📦 Paso 1: Creando tablas...');
try {
  execSync('node database/migrate-postgres.js', {
    cwd: path.resolve(__dirname),
    stdio: 'inherit'
  });
} catch (e) {
  console.log('⚠️  Algunas tablas ya existen, continuando...');
}

// 2. Ejecutar seed de datos
console.log('\n🌱 Paso 2: Cargando datos demo...');
require('./seed').seedData()
  .then(() => {
    console.log('\n✅ Setup completo!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Error en seed:', err);
    process.exit(1);
  });
