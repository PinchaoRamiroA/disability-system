import { FileCheck, Upload } from 'lucide-react'

export const metadata = {
    title: 'Expediente Documental',
}

export default function DocumentosPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Expediente y Validación Documental
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Recepción, validación técnica de soportes médicos y checklist según EPS/ARL.
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-semibold border border-[#334155] transition">
                    <Upload className="h-4 w-4" />
                    <span>Cargar Soportes</span>
                </button>
            </div>

            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                    <FileCheck className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo Documental (Prioridad 3)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Ruta configurada en el sistema. Integrará la carga drag & drop (PDF, JPG, PNG hasta 10MB), checklist visual y aprobación/rechazo de documentos con <code className="text-emerald-400">PATCH /documentos/:id/validar</code>.
                    </p>
                </div>
            </div>
        </div>
    )
}
