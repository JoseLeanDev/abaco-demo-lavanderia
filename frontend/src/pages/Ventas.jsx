import AnalisisVentas from '../components/dashboard/AnalisisVentas'

export default function Ventas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ventas</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Análisis de ventas por producto, sucursal y cliente
          </p>
        </div>
      </div>
      <AnalisisVentas />
    </div>
  )
}
