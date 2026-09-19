import Link from 'next/link'
import { PhoneCall, Scale, CreditCard } from 'lucide-react'

export const metadata = {
    title: 'Gestión de Cobro',
}

export default function CobrosPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Gestión y Seguimiento de Cobro
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Recuperación de cartera ante entidades de salud, bitácora de llamadas y pagos.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/cobros/seguimientos"
                    className="p-6 rounded-xl bg-[#111827] border border-[#334155] hover:border-blue-500/40 transition group"
                >
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-4 group-hover:scale-105 transition">
                        <PhoneCall className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition">
                        Bitácora de Seguimientos
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-1">
                        Registro de llamadas, respuestas de EPS, emails y compromisos de pago.
                    </p>
                </Link>

                <Link
                    href="/cobros/juridico"
                    className="p-6 rounded-xl bg-[#111827] border border-[#334155] hover:border-red-500/40 transition group"
                >
                    <div className="p-3 rounded-lg bg-red-500/10 text-red-400 w-fit mb-4 group-hover:scale-105 transition">
                        <Scale className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-white group-hover:text-red-400 transition">
                        Cobro Jurídico & Escalación
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-1">
                        Gestión de casos en mora &gt;180 días, requerimientos legales y tutelas.
                    </p>
                </Link>

                <Link
                    href="/cobros/pagos"
                    className="p-6 rounded-xl bg-[#111827] border border-[#334155] hover:border-emerald-500/40 transition group"
                >
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-4 group-hover:scale-105 transition">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition">
                        Registro de Pagos
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-1">
                        Ingreso de consignaciones bancarias, transferencias y cruce de liquidaciones.
                    </p>
                </Link>
            </div>
        </div>
    )
}
