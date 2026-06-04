require('dotenv').config();
const db = require('./database/connection');

async function testDashboard() {
  try {
    const empresaId = 1;
    
    console.log('Testing dashboard endpoint logic...');
    
    // KPIs de tesorería
    const posicionBancaria = await db.getAsync(`
      SELECT 
        SUM(CASE WHEN moneda = 'GTQ' THEN saldo ELSE 0 END) as total_gtq,
        SUM(CASE WHEN moneda = 'USD' THEN saldo ELSE 0 END) as total_usd,
        COUNT(*) as num_cuentas
      FROM cuentas_bancarias 
      WHERE empresa_id = ? AND activa = TRUE
    `, [empresaId]);
    console.log('posicionBancaria:', posicionBancaria);
    
    const totalGTQ = parseFloat(posicionBancaria?.total_gtq) || 0;
    const totalUSD = parseFloat(posicionBancaria?.total_usd) || 0;
    console.log('totalGTQ:', totalGTQ, 'totalUSD:', totalUSD);
    
    // CxC
    const cxcResumen = await db.getAsync(`
      SELECT SUM(monto_total) as total_cxc
      FROM cuentas_cobrar 
      WHERE empresa_id = ? AND estado != 'cobrada'
    `, [empresaId]);
    console.log('cxcResumen:', cxcResumen);
    const totalCxC = parseFloat(cxcResumen?.total_cxc) || 0;
    console.log('totalCxC:', totalCxC);
    
    // CxP
    const cxpResumen = await db.getAsync(`
      SELECT SUM(monto_total) as total_cxp
      FROM cuentas_pagar 
      WHERE empresa_id = ? AND estado = 'pendiente'
    `, [empresaId]);
    console.log('cxpResumen:', cxpResumen);
    const totalCxP = parseFloat(cxpResumen?.total_cxp) || 0;
    console.log('totalCxP:', totalCxP);
    
    console.log('\n=== RESUMEN ===');
    console.log('Tesorería GTQ:', totalGTQ);
    console.log('Tesorería USD:', totalUSD);
    console.log('CxC:', totalCxC);
    console.log('CxP:', totalCxP);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

testDashboard().then(() => process.exit(0));
