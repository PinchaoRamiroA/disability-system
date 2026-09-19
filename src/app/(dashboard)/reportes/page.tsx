import { BarChart3 } from 'lucide-react'

export const metadata = {
    title: 'Reportes y Estadísticas',
}

export default function ReportesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Reportes y Estadísticas SG-SST
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Métricas de ausentismo laboral, días perdidos, recobro de cartera y resúmenes ejecutivos.
                    </p>
                </div>
            </div>

            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                    <BarChart3 className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo de Reportes (Prioridad 9)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Ruta configurada en el sistema. Integrará la generación de reportes ejecutivos con filtros por rango de fechas, entidad, tipo de incapacidad y exportación a PDF y Excel.
                    </p>
                </div>
            </div>
        </div>
    )
}
