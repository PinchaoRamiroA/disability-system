import Link from 'next/link'
import { Scale, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Cobro Jurídico & Escalación',
}

export default function CobroJuridicoPage() {
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
                            Cobro Jurídico & Casos Críticos
                        </h1>
                        <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                            Gestión legal de cartera vencida &gt;180 días y desacatos de tutela.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
                    <Scale className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo de Cobro Jurídico (Prioridad 5.2)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Ruta configurada en el sistema. Integrará la visualización de casos críticos, días en mora, valor adeudado y flujo de escalación jurídica.
                    </p>
                </div>
            </div>
        </div>
    )
}
