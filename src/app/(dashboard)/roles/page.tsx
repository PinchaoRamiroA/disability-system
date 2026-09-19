import { ShieldCheck } from 'lucide-react'

export const metadata = {
    title: 'Roles y Permisos',
}

export default function RolesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Roles y Matriz de Permisos
                    </h1>
                    <p className="text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        Definición de perfiles de acceso y permisos granulares por módulo.
                    </p>
                </div>
            </div>

            <div className="p-12 rounded-xl bg-[#111827] border border-[#334155] text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                    <h3 className="text-base font-semibold text-white">
                        Módulo de Roles (Prioridad 10.2)
                    </h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                        Ruta configurada en el sistema. Integrará la matriz de permisos por módulo (ver, crear, editar, eliminar, validar documentos, conciliar y gestionar cobros) conectada a <code className="text-purple-400">rol.permisos</code>.
                    </p>
                </div>
            </div>
        </div>
    )
}
