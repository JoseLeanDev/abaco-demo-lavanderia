const express = require('express');
const router = express.Router();
const db = require('../../database/connection');
const { seedData } = require('../../database/seed');

router.get('/', async (req, res) => {
  try {
    // Verificar si la base está vacía
    const empresas = await db.getAsync('SELECT COUNT(*) as count FROM empresas');
    const count = parseInt(empresas?.count || 0);
    
    if (count === 0) {
      console.log('🌱 Base de datos vacía. Ejecutando seed...');
      await seedData();
      console.log('✅ Seed completado');
      
      // Verificar resultado
      const cb = await db.getAsync('SELECT COUNT(*) as c FROM cuentas_bancarias');
      const cxc = await db.getAsync('SELECT SUM(monto_total) as total FROM cuentas_cobrar');
      const cxp = await db.getAsync('SELECT SUM(monto_total) as total FROM cuentas_pagar');
      
      res.json({
        status: 'success',
        message: 'Seed ejecutado',
        timestamp: new Date().toISOString(),
        data: {
          cuentas_bancarias: cb?.c || 0,
          cxc_total: cxc?.total || 0,
          cxp_total: cxp?.total || 0
        }
      });
    } else {
      res.json({
        status: 'skipped',
        message: 'Base de datos ya tiene datos',
        empresas: count
      });
    }
  } catch (error) {
    console.error('Error en seed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;