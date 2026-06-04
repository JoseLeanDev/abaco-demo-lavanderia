require('dotenv').config();
const db = require('./database/connection');
const { seedData } = require('./database/seed');

async function setupDatabase() {
  console.log('\n🚀 Verificando schema de base de datos...');
  
  try {
    // Verificar si snapshots_diarios existe
    const snapshotsExists = await db.getAsync(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'snapshots_diarios'
      ) as exists
    `);
    
    if (!snapshotsExists?.exists) {
      console.log('📦 Creando tablas faltantes...');
      
      // Crear snapshots_diarios
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS snapshots_diarios (
          id SERIAL PRIMARY KEY,
          empresa_id INTEGER DEFAULT 1,
          fecha DATE,
          datos_json JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `, []);
      
      // Agregar metricas_json a snapshots_financieros si no existe
      await db.runAsync(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'snapshots_financieros' AND column_name = 'metricas_json'
          ) THEN
            ALTER TABLE snapshots_financieros ADD COLUMN metricas_json JSONB;
          END IF;
        END $$;
      `, []);
      
      console.log('✅ Tablas faltantes creadas');
    } else {
      console.log('✅ Schema completo');
    }
    
    // Verificar si hay datos
    const empresaCount = await db.getAsync('SELECT COUNT(*) as count FROM empresas');
    
    if (parseInt(empresaCount?.count || 0) === 0) {
      console.log('🌱 Base de datos vacía. Ejecutando seed...');
      await seedData();
      console.log('✅ Datos demo cargados');
    } else {
      console.log(`✅ Base de datos ya tiene ${empresaCount.count} empresa(s)`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error en setup:', error.message);
    return false;
  }
}

module.exports = { setupDatabase };

// Si se ejecuta directamente
if (require.main === module) {
  setupDatabase().then(() => process.exit(0));
}
