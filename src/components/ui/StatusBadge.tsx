'use client'

import React from 'react'

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface StatusBadgeProps {
    status?: string | null
    variant?: StatusVariant
    className?: string
}

export function getStatusVariant(statusName?: string | null): StatusVariant {
    if (!statusName) return 'neutral'
    const s = statusName.toLowerCase().trim()

    // Success (Green)
    if (
        s.includes('aprobada') ||
        s.includes('aprovada') ||
        s.includes('pagada') ||
        s.includes('transcrita') ||
        s.includes('conciliada') ||
        s.includes('cobrada') ||
        s.includes('completado') ||
        s.includes('validado')
    ) {
        return 'success'
    }

    // Danger (Red)
    if (
        s.includes('rechazada') ||
        s.includes('jurídico') ||
        s.includes('juridico') ||
        s.includes('persuasivo') ||
        s.includes('incompleta') ||
        s.includes('vencid') ||
        s.includes('mora')
    ) {
        return 'danger'
    }

    // Warning (Amber)
    if (
        s.includes('pendiente') ||
        s.includes('proceso') ||
        s.includes('verificación') ||
        s.includes('verificacion') ||
        s.includes('validación') ||
        s.includes('validacion') ||
        s.includes('conciliación') ||
        s.includes('conciliacion')
    ) {
        return 'warning'
    }

    // Info (Blue)
    if (s.includes('recibida') || s.includes('radicada')) {
        return 'info'
    }

    // Neutral (Slate)
    return 'neutral'
}

const VARIANT_STYLES: Record<
    StatusVariant,
    { badge: string; dot: string; ping: string }
> = {
    success: {
        badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-500',
        ping: 'bg-emerald-400',
    },
    warning: {
        badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        dot: 'bg-amber-500',
        ping: 'bg-amber-400',
    },
    danger: {
        badge: 'bg-red-500/15 text-red-400 border-red-500/30',
        dot: 'bg-red-500',
        ping: 'bg-red-400',
    },
    info: {
        badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-500',
        ping: 'bg-blue-400',
    },
    neutral: {
        badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
        dot: 'bg-slate-400',
        ping: 'bg-slate-300',
    },
}

export function StatusBadge({ status, variant, className = '' }: StatusBadgeProps) {
    const resolvedVariant = variant || getStatusVariant(status)
    const style = VARIANT_STYLES[resolvedVariant]

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border select-none transition-colors ${style.badge} ${className}`}
        >
            <span className="relative flex h-1.5 w-1.5">
                <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.ping}`}
                />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${style.dot}`} />
            </span>
            <span className="capitalize">{status || 'Sin estado'}</span>
        </span>
    )
}

export default StatusBadge
