import { Settings } from 'lucide-react'

export const metadata = {
    title: 'Configuración del Sistema',
}

export default function ConfiguracionPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Configuración y Parámetros del Sistema
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Catálogos maestros, entidades de salud, tipos de documentos y reglas de notificación.
                    </p>
                </div>
            </div>

            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
                    <Settings className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo de Configuración (Prioridad 11)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Ruta configurada en el sistema. Integrará la administración de catálogos mediante <code className="text-blue-400">GET /catalogos/*</code> (tipos-documento, estados-documento, tipos-pago, entidades EPS/ARL).
                    </p>
                </div>
            </div>
        </div>
    )
}
