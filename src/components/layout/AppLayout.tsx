'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface AppLayoutProps {
    children: React.ReactNode
    requiredRole?: string
    requiredPermission?: string
    adminOnly?: boolean
}

export function AppLayout({
    children,
    requiredRole,
    requiredPermission,
    adminOnly = false,
}: AppLayoutProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    return (
        <ProtectedRoute
            requiredRole={requiredRole}
            requiredPermission={requiredPermission}
            adminOnly={adminOnly}
        >
            <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col antialiased selection:bg-blue-600 selection:text-white">
                {/* Fixed Sidebar */}
                <Sidebar
                    isOpenMobile={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />

                {/* Main Content Area (offset by 280px on desktop) */}
                <div className="flex-1 flex flex-col lg:pl-[280px] min-h-screen transition-all duration-300">
                    <Topbar
                        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                    />

                    <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default AppLayout
