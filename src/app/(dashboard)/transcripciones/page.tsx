import { Send } from 'lucide-react'

export const metadata = {
    title: 'Transcripción EPS / ARL',
}

export default function TranscripcionesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Transcripción ante EPS / ARL
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Control de radicación, plazos perentorios y semáforo de vencimientos por entidad.
                    </p>
                </div>
            </div>

            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                    <Send className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo de Transcripciones (Prioridad 4)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Ruta configurada en el sistema. Integrará el listado de pendientes por radicar (<code className="text-amber-400">GET /incapacidades/transcripciones/pendientes</code>) y el registro de radicación con soporte de radicado.
                    </p>
                </div>
            </div>
        </div>
    )
}
