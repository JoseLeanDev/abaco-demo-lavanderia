const express = require('express');
const router = express.Router();
const db = require('../../database/connection');

router.get('/', async (req, res) => {
  try {
    // Ver todas las empresas
    const empresas = await db.allAsync('SELECT id, nombre FROM empresas ORDER BY id');
    
    // Ver datos por empresa
    const resultados = [];
    for (const emp of empresas) {
      const cb = await db.getAsync('SELECT COUNT(*) as c, SUM(saldo) as total FROM cuentas_bancarias WHERE empresa_id = ?', [emp.id]);
      const cxc = await db.getAsync('SELECT SUM(monto_total) as total FROM cuentas_cobrar WHERE empresa_id = ?', [emp.id]);
      const cxp = await db.getAsync('SELECT SUM(monto_total) as total FROM cuentas_pagar WHERE empresa_id = ?', [emp.id]);
      const trans = await db.getAsync('SELECT COUNT(*) as c, SUM(monto) as total FROM transacciones WHERE empresa_id = ?', [emp.id]);
      
      resultados.push({
        empresa_id: emp.id,
        nombre: emp.nombre,
        cuentas_bancarias: cb?.c || 0,
        saldo_bancario: cb?.total || 0,
        cxc_total: cxc?.total || 0,
        cxp_total: cxp?.total || 0,
        transacciones: trans?.c || 0,
        monto_transacciones: trans?.total || 0
      });
    }
    
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      empresas: resultados
    });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;