import Link from 'next/link'
import { PhoneCall, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Bitácora de Seguimientos',
}

export default function SeguimientosPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/cobros"
                        className="p-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-[#94a3b8] hover:text-white transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Bitácora de Seguimientos
                        </h1>
                        <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                            Historial y registro de interacciones con entidades pagadoras.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
                    <PhoneCall className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo de Seguimiento (Prioridad 5.1)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Ruta configurada en el sistema. Integrará la línea de tiempo de llamadas, correos y respuestas de las EPS (<code className="text-blue-400">GET /cobros/seguimientos</code>).
                    </p>
                </div>
            </div>
        </div>
    )
}
