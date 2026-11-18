# Disability System Enterprise (Frontend)

Plataforma SaaS B2B empresarial orientada a la gestión integral, auditoría médica, radicación ante EPS/ARL, conciliación de prestaciones económicas y recobro de incapacidades médicas en Colombia.

---

## 🚀 Stack Tecnológico

- **Framework:** Next.js 16 (App Router) & React 19
- **Lenguaje:** TypeScript (Strict Mode)
- **Estilos & Diseño:** Tailwind CSS 4 • Sistema de Diseño *Disability System Dark* (`DESING.md`)
- **Estado Global:** Redux Toolkit (RTK) & React-Redux
- **Validación & Contratos:** Zod (Esquemas y DTOs en `contracts/`)
- **Iconografía:** Lucide React
- **Backend:** Go Hexagonal REST API (`https://disability-system-backend.onrender.com/api/v1`)

---

## 👥 Usuarios de Prueba para Desarrollo

Credenciales preconfiguradas en el entorno de desarrollo y pruebas:

| Rol | ID Rol | Correo / Email | Contraseña | Nombre | Funciones / Permisos Principales |
|---|---|---|---|---|---|
| **Administrador** | `1` | `admin@empresa.com` | `password123` | Admin Principal | Control total: usuarios, roles, reportes, incapacidades, cobros y auditoría. |
| **Gestión Humana** | `2` | `gh@empresa.com` | `password123` | Gestor Humano | Crear y editar incapacidades, validar y rechazar documentos, generar alertas. |
| **Gerencia** | `3` | `gerencia@empresa.com` | `password123` | Gerente General | Consultar incapacidades, historial y reportes ejecutivos. |
| **Empleado** | `4` | `empleado@empresa.com` <br> `juan.perez@empleado.com` | `password123` | Empleado Demo <br> Juan Perez | Consulta de sus propias incapacidades y envío de documentación de soporte. |
| **Contabilidad** | `5` | `contabilidad@empresa.com` | `password123` | Contador | Registro de pagos de EPS/ARL, conciliación bancaria y reportes contables. |
| **Jurídica** | `6` | `juridica@empresa.com` | `password123` | Asesor Jurídico | Gestión de cobros jurídicos, consulta de incapacidades e historial. |
| **Recepcionista** | `7` | `recepcion@empresa.com` | `password123` | Recepcionista | Radicación y creación inicial de incapacidades. |
| **Cartera** | `8` | `cartera@empresa.com` | `password123` | Analista de Cartera | Gestión de cobro persuasivo, alertas de vencimiento y registro de pagos. |
| **SG-SST** | `9` | `sgsst@empresa.com` | `password123` | Coordinador SG-SST | Validación de seguridad y salud, edición y alertas de incapacidades laborales. |

---

## ⚙️ Configuración y Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto basándose en `.env.development`:

```env
NEXT_PUBLIC_API_URL=https://disability-system-backend.onrender.com/api/v1
```

> **Nota:** Para desarrollo local con backend en red local, puedes configurar `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`.

---

## 🛠️ Comandos de Desarrollo

| Comando | Descripción |
|---|---|
| `pnpm install` | Instalar dependencias del proyecto |
| `pnpm dev` | Iniciar servidor de desarrollo en `http://localhost:3000` |
| `pnpm build` | Compilar aplicación para producción |
| `pnpm start` | Iniciar servidor en modo producción |
| `pnpm lint` | Ejecutar análisis estático con ESLint |
| `pnpm test` | Ejecutar pruebas unitarias |
| `pnpm cy` | Abrir interfaz interactiva de Cypress |
| `pnpm e2e` | Ejecutar pruebas End-to-End |

---

## 📁 Estructura del Proyecto

```text
disability-system/
├── contracts/                  # Contratos TypeScript & esquemas Zod (fuente de verdad)
│   ├── auth/                   # Esquemas de autenticación y tokens
│   ├── incapacidades/          # DTOs y validaciones de incapacidades
│   ├── documentos/             # Tipos y estados documentales
│   ├── cobros/                 # Tipos de pagos y cartera
│   ├── cartera/                # Cobro persuasivo y jurídico
│   ├── notificaciones/         # Esquemas de alertas del sistema
│   └── catalogos/              # Maestros (EPS, ARL, AFP, CIE-10)
├── docs/                       # Documentación técnica y de negocio
│   ├── business/               # Reglas de negocio y flujos legales (medical-leaves-flow.md)
│   ├── architecture/           # Arquitectura Frontend y Backend
│   ├── frontend/               # Sistema de UI y componentes
│   ├── backend/                # Endpoints y consumo de API
│   └── database/               # Esquema relacional de la base de datos
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Layout protegido con sidebar y topbar
│   │   │   ├── dashboard/      # Métricas ejecutivas y KPIs
│   │   │   ├── incapacidades/  # Bandeja, creación y detalle de casos
│   │   │   ├── documentos/     # Expediente digital y validación documental
│   │   │   ├── transcripciones/# Radicación EPS/ARL y términos
│   │   │   ├── cobros/         # Cartera, cobro jurídico y pagos
│   │   │   ├── conciliacion/   # Conciliación bancaria y contable
│   │   │   ├── auditoria/      # Pistas inmutables y logs
│   │   │   ├── reportes/       # Informes de ausentismo y costos
│   │   │   └── usuarios/       # Administración de usuarios y roles
│   │   ├── login/              # Inicio de sesión corporativo
│   │   ├── register/           # Solicitud de acceso empresarial
│   │   └── page.tsx            # Landing page SaaS B2B
│   ├── components/             # Componentes modulares y reutilizables
│   ├── hooks/                  # Custom hooks (useAuth, useIncapacidades, etc.)
│   ├── store/                  # Configuración de Redux Toolkit y Slices
│   ├── services/               # Clientes Axios e integración HTTP
│   └── types/                  # Tipados auxiliares
└── DESING.md                   # Tokens, directrices visuales y colores del sistema
```

---

## 📋 Reglas y Estándares de Código

1. **Prioridad Documental:** Los desarrolladores deben consultar la documentación en este orden:
   1. `docs/business/` — Reglas de negocio y términos normativos.
   2. `docs/architecture/` — Arquitectura técnica.
   3. `docs/frontend/` — Componentes y sistema de UI.
   4. `docs/backend/` — Endpoints y contratos.
   5. `docs/database/` — Esquema de base de datos.
2. **Contratos Zod:** No crear DTOs duplicados; usar siempre los esquemas definidos en `contracts/`.
3. **Nomenclatura Estandarizada:**
   - `incapacidad` (no *leave*, no *medical*)
   - `documento` (no *file*, no *attachment*)
   - `pago` (no *payment*, no *collection*)
4. **Estilo de Código:**
   - TypeScript en modo estricto.
   - Comillas simples (`'`), sin puntos y coma (`;`), indentación de 4 espacios.
   - Alias de rutas: `@/components/*`, `@/hooks/*`, `@/store/*`, `@/contracts/*`.
5. **Componentes:**
   - Evitar componentes pesados de librerías externas para layouts básicos; reservar librerías de UI complejas para datepickers o visualizadores avanzados.
   - No realizar peticiones `fetch` directas dentro de componentes de UI; delegar en hooks o servicios.
