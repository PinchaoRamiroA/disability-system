'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
    Activity,
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone,
    ShieldCheck,
    Sparkles,
    User as UserIcon,
    CreditCard,
    MapPin,
    Loader2,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LoginRequestSchema, RegisterRequestSchema } from '@/contracts/auth'

function AuthForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login'

    const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab)
    const [showPassword, setShowPassword] = useState(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const {
        login,
        register: registerUser,
        isLoading,
        error: authError,
        isAuthenticated,
        user,
        clearError,
    } = useAuth()

    // Form states
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    })

    const [registerForm, setRegisterForm] = useState({
        nombre: '',
        email: '',
        password: '',
        numero_documento: '',
        numero_celular: '',
        direccion: '',
    })

    const redirectParam = searchParams.get('redirect') || '/dashboard'

    // Pre-warm backend on mount to mitigate Render.com free tier cold starts
    useEffect(() => {
        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            'https://disability-system-backend.onrender.com/api/v1'
        fetch(apiUrl, { method: 'GET', mode: 'no-cors' }).catch(() => {})
    }, [])

    // If already authenticated, allow quick navigation to dashboard
    useEffect(() => {
        if (isAuthenticated && !successMessage) {
            // Optional auto-redirect after brief check
        }
    }, [isAuthenticated, successMessage])

    const handleTabSwitch = (tab: 'login' | 'register') => {
        setActiveTab(tab)
        setFormErrors({})
        setSuccessMessage(null)
        clearError()
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormErrors({})
        setSuccessMessage(null)

        const validation = LoginRequestSchema.safeParse(loginForm)
        if (!validation.success) {
            const errors: Record<string, string> = {}
            validation.error.issues.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0].toString()] = err.message
                }
            })
            setFormErrors(errors)
            return
        }

        try {
            await login(validation.data)
            setSuccessMessage('¡Bienvenido! Sesión iniciada correctamente.')
            setTimeout(() => {
                router.push(redirectParam)
            }, 1000)
        } catch {
            // Error is handled in Redux auth slice and exposed via useAuth
        }
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormErrors({})
        setSuccessMessage(null)

        const validation = RegisterRequestSchema.safeParse(registerForm)
        if (!validation.success) {
            const errors: Record<string, string> = {}
            validation.error.issues.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0].toString()] = err.message
                }
            })
            setFormErrors(errors)
            return
        }

        try {
            await registerUser(validation.data)
            setSuccessMessage('Usuario registrado con éxito. Ya puedes iniciar sesión.')
            setTimeout(() => {
                handleTabSwitch('login')
                setLoginForm({
                    email: registerForm.email,
                    password: '',
                })
            }, 1500)
        } catch {
            // Error is handled in Redux auth slice
        }
    }

    const handleDemoFill = () => {
        if (activeTab === 'login') {
            setLoginForm({
                email: 'admin@medflow.com',
                password: 'password123',
            })
        } else {
            setRegisterForm({
                nombre: 'Dr. Alejandro Morales',
                email: 'alejandro.morales@salud.gov.co',
                password: 'password123',
                numero_documento: '1094882110',
                numero_celular: '3104558990',
                direccion: 'Av. Circunvalar # 14-25',
            })
        }
        setFormErrors({})
        clearError()
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex selection:bg-blue-600 selection:text-white">
            {/* Left Brand Panel - Desktop */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e293b] border-r border-[#334155]/60 relative overflow-hidden">
                <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
                <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

                {/* Brand Header */}
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20 group-hover:scale-105 transition">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xl tracking-tight text-white">MedFlow</span>
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    Enterprise
                                </span>
                            </div>
                            <p className="text-xs text-[#94a3b8]">Sistema de Gestión de Incapacidades</p>
                        </div>
                    </Link>
                </div>

                {/* Value Propositions */}
                <div className="relative z-10 space-y-6 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Seguridad Clínica & Cumplimiento Normativo</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-white leading-snug">
                        Plataforma centralizada para el control total de prestaciones económicas y salud ocupacional.
                    </h2>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Trazabilidad Inmutable</h4>
                                <p className="text-xs text-[#cbd5e1] mt-0.5">
                                    Cada radicado, certificación médica y cambio de estado queda auditado conforme a la ley.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 mt-0.5">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Radicación Ágil ante EPS y ARL</h4>
                                <p className="text-xs text-[#cbd5e1] mt-0.5">
                                    Control automático de términos de vencimiento y checklists documentales requeridos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="relative z-10 flex items-center justify-between text-xs text-[#94a3b8] pt-6 border-t border-[#334155]/40">
                    <span>© 2026 MedFlow Inc.</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        API v1 en línea
                    </span>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-6">
                    {/* Mobile Brand Link */}
                    <div className="lg:hidden flex items-center justify-between pb-2 border-b border-[#334155]/60">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                <Activity className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-base text-white">MedFlow</span>
                        </Link>
                        <span className="text-xs text-emerald-400 font-medium">API v1 Online</span>
                    </div>

                    {/* Authenticated Banner if already logged in */}
                    {isAuthenticated && user && (
                        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-blue-400">Sesión Activa</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                                    {user.rol?.nombre || 'Usuario'}
                                </span>
                            </div>
                            <p className="text-sm text-white font-medium">{user.nombre}</p>
                            <p className="text-xs text-[#94a3b8]">{user.correo}</p>
                            <Link
                                href="/"
                                className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                            >
                                <span>Ir a la bandeja principal</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="rounded-2xl bg-[#111827] border border-[#334155] p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-6">
                        {/* Tab Switcher */}
                        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0f172a] border border-[#334155]">
                            <button
                                type="button"
                                onClick={() => handleTabSwitch('login')}
                                className={`py-2 text-xs font-semibold rounded-lg transition ${
                                    activeTab === 'login'
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'text-[#94a3b8] hover:text-white'
                                }`}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTabSwitch('register')}
                                className={`py-2 text-xs font-semibold rounded-lg transition ${
                                    activeTab === 'register'
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'text-[#94a3b8] hover:text-white'
                                }`}
                            >
                                Crear Cuenta
                            </button>
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                {activeTab === 'login' ? 'Acceso al Sistema' : 'Registro de Usuario'}
                            </h1>
                            <p className="text-xs text-[#94a3b8] mt-1">
                                {activeTab === 'login'
                                    ? 'Ingresa tus credenciales autorizadas para gestionar los expedientes médicos.'
                                    : 'Completa los datos para habilitar tu cuenta en la red operacional.'}
                            </p>
                        </div>

                        {/* Error Alert */}
                        {authError && (
                            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300">
                                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                                <span>{authError}</span>
                            </div>
                        )}

                        {/* Success Alert */}
                        {successMessage && (
                            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {/* Login Form */}
                        {activeTab === 'login' && (
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                        <input
                                            type="email"
                                            value={loginForm.email}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, email: e.target.value })
                                            }
                                            placeholder="ejemplo@medflow.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                            required
                                        />
                                    </div>
                                    {formErrors.email && (
                                        <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-medium text-[#cbd5e1]">
                                            Contraseña
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleDemoFill}
                                            className="text-[11px] text-blue-400 hover:text-blue-300 transition"
                                        >
                                            Rellenar Demo
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={loginForm.password}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, password: e.target.value })
                                            }
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white transition"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {formErrors.password && (
                                        <p className="text-[11px] text-red-400 mt-1">{formErrors.password}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-[0.99]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Autenticando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Ingresar al Portal</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Register Form */}
                        {activeTab === 'register' && (
                            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                                <div>
                                    <label className="block text-xs font-medium text-[#cbd5e1] mb-1">
                                        Nombre Completo
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                        <input
                                            type="text"
                                            value={registerForm.nombre}
                                            onChange={(e) =>
                                                setRegisterForm({ ...registerForm, nombre: e.target.value })
                                            }
                                            placeholder="Dr. Carlos Pérez"
                                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                            required
                                        />
                                    </div>
                                    {formErrors.nombre && (
                                        <p className="text-[11px] text-red-400 mt-1">{formErrors.nombre}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-[#cbd5e1] mb-1">
                                            Correo
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                            <input
                                                type="email"
                                                value={registerForm.email}
                                                onChange={(e) =>
                                                    setRegisterForm({ ...registerForm, email: e.target.value })
                                                }
                                                placeholder="correo@eps.com"
                                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                                required
                                            />
                                        </div>
                                        {formErrors.email && (
                                            <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-[#cbd5e1] mb-1">
                                            Número Documento
                                        </label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                            <input
                                                type="text"
                                                value={registerForm.numero_documento}
                                                onChange={(e) =>
                                                    setRegisterForm({
                                                        ...registerForm,
                                                        numero_documento: e.target.value,
                                                    })
                                                }
                                                placeholder="1094882110"
                                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                                required
                                            />
                                        </div>
                                        {formErrors.numero_documento && (
                                            <p className="text-[11px] text-red-400 mt-1">
                                                {formErrors.numero_documento}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#cbd5e1] mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={registerForm.password}
                                            onChange={(e) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    password: e.target.value,
                                                })
                                            }
                                            placeholder="Mínimo 6 caracteres"
                                            className="w-full pl-10 pr-10 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white transition"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {formErrors.password && (
                                        <p className="text-[11px] text-red-400 mt-1">{formErrors.password}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-[#cbd5e1] mb-1">
                                            Celular
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                            <input
                                                type="tel"
                                                value={registerForm.numero_celular}
                                                onChange={(e) =>
                                                    setRegisterForm({
                                                        ...registerForm,
                                                        numero_celular: e.target.value,
                                                    })
                                                }
                                                placeholder="3104558990"
                                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-[#cbd5e1] mb-1">
                                            Dirección
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                            <input
                                                type="text"
                                                value={registerForm.direccion}
                                                onChange={(e) =>
                                                    setRegisterForm({
                                                        ...registerForm,
                                                        direccion: e.target.value,
                                                    })
                                                }
                                                placeholder="Calle 45 # 12-30"
                                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <button
                                        type="button"
                                        onClick={handleDemoFill}
                                        className="text-xs text-blue-400 hover:text-blue-300 transition"
                                    >
                                        Rellenar Datos de Prueba
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-[0.99]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Registrando cuenta...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Crear Usuario</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            }
        >
            <AuthForm />
        </Suspense>
    )
}
