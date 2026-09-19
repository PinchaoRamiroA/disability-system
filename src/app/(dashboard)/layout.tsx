import type { Metadata } from 'next'
import { AppLayout } from '@/components/layout/AppLayout'

export const metadata: Metadata = {
    title: {
        template: '%s | MedFlow',
        default: 'MedFlow | Sistema de Gestión de Incapacidades',
    },
}

export default function DashboardGroupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AppLayout>{children}</AppLayout>
}
