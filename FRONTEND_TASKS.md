# Frontend Development Task List

Sistema de Gestión de Incapacidades (Disability Management System)

## 🎯 Reutilización del Proyecto Existente

El proyecto existente tiene infraestructura que se puede adaptar:

- **Stack:** Next.js, React, MUI, Redux Toolkit, Axios, Nivo Charts
- **Componentes:** Table (con server pagination), Filters, Charts, Dialogs
- **Auth:** Slice Redux completo (adaptar al formato JWT del AGENTS.md)
- **Hooks:** useDebounce, useLoading, useNotifier, useDownloadFile
- **Servicios API:** Estructura base con axios configurada

---

## 📋 Tareas por Prioridad

### 🔴 PRIORIDAD 1 - FUNDAMENTOS (Semana 1)

#### 1.1 Configuración del Proyecto
- [x] 1.1.1 Limpiar código innecesario del proyecto anterior (comentarios, componentes no usados)
- [x] 1.1.2 Actualizar variables de entorno (.env) con API_URL
- [x] 1.1.3 Configurar baseURL en axios instance para API v1
- [x] 1.1.4 Ajustar tsconfig paths si es necesario

#### 1.2 Autenticación (Adaptar existente)
- [x] 1.2.1 Crear tipos TypeScript para Auth (Token, User, Credentials) según AGENTS.md
- [x] 1.2.2 Adaptar servicio de authentication (login, register, refresh)
- [x] 1.2.3 Adaptar slice Redux de autenticación para JWT tokens
- [x] 1.2.4 Crear hook useAuth para manejo de sesión
- [x] 1.2.5 Crear interceptor de axios para token automático
- [x] 1.2.6 Manejo de 401 (refresh token o logout)

#### 1.3 Layout Principal
- [x] 1.3.1 Adaptar Sidebar/Navigation para nuevo menú según arquitectura de navegación
- [x] 1.3.2 Crear estructura de rutas (Next.js pages o App Router)
- [x] 1.3.3 Implementar ProtectedRoute (verificar auth antes de acceso)
- [x] 1.3.4 Crear menú lateral con módulos del sistema

---

### 🟠 PRIORIDAD 2 - CORE INCAPACIDADES (Semana 2)

#### 2.1 Listado de Incapacidades
- [x] 2.1.1 Crear página /incapacidades
- [x] 2.1.2 Reutilizar componente Table con server pagination
- [x] 2.1.3 Crear filtros (estado, tipo, entidad, fecha, origen, canal)
- [x] 2.1.4 Integrar GET /incapacidades con query params
- [ ] 2.1.5 Implementar búsqueda por colaborador/documento
- [ ] 2.1.6 Crear acciones rápidas (ver, editar, cambiar estado)

#### 2.2 Crear Incapacidad
- [x] 2.2.1 Crear página /incapacidades/crear
- [x] 2.2.2 Formulario con Formik + validación Yup
- [x] 2.2.3 Integrar POST /incapacidades
- [x] 2.2.4 Selects para tipo, entidad, origen, canal (cargar desde catálogos)
- [x] 2.2.5 Date pickers para fechas inicio/fin
- [x] 2.2.6 Validación de días y fechas

#### 2.3 Detalle de Incapacidad
- [x] 2.3.1 Crear página /incapacidades/[id]
- [x] 2.3.2 Tabs para información general, documentos, historial, seguimientos, pagos
- [x] 2.3.3 Header con semáforo de estado y días transcurridos
- [x] 2.3.4 Integrar GET /incapacidades/{id}
- [x] 2.3.5 Mostrar entidad, tipo, fechas, observaciones
- [ ] 2.3.6 Timeline stepper para estados (ver los estados en la docs)

#### 2.4 Cambiar Estado
- [x] 2.4.1 Integrar PATCH /incapacidades/{id}/estado
- [x] 2.4.2 Mostrar modal de confirmación
- [x] 2.4.3 Registrar observaciones del cambio
- [x] 2.4.4 Actualizar UI después del cambio

---

### 🟡 PRIORIDAD 3 - DOCUMENTOS (Semana 2-3)

#### 3.1 Gestión Documental
- [x] 3.1.1 Crear componente FileUploader (drag & drop)
- [x] 3.1.2 Integrar POST /incapacidades/{id}/documentos/upload
- [x] 3.1.3 Validar tipo de archivo (PDF, JPG, PNG) y tamaño (10MB)
- [x] 3.1.4 Mostrar preview de documentos
- [x] 3.1.5 Integrar GET /incapacidades/{id}/documentos
- [x] 3.1.6 Componente checklist visual (✅ completo, ⚠️ faltante, ❌ inválido)

#### 3.2 Validación de Documentos
- [x] 3.2.1 Crear página validación documental
- [x] 3.2.2 Integrar GET /incapacidades/tipos/{id}/documentos-requeridos
- [x] 3.2.3 Integrar PATCH /documentos/{id}/validar
- [x] 3.2.4 Checklist visual por tipo de incapacidad
- [x] 3.2.5 Botones aprobar/rechazar/solicitar corrección

#### 3.3 Archivo Digital
- [ ] 3.3.1 Crear página archivo documental (vista tipo Google Drive)
- [ ] 3.3.2 Filtros por entidad, colaborador, fecha, tipo
- [ ] 3.3.3 Preview de PDF e imágenes
- [ ] 3.3.4 Acciones descargar, reemplazar, archivar

---

### 🟢 PRIORIDAD 4 - TRANSCRIPCIÓN EPS/ARL (Semana 3)

#### 4.1 Radicación y Transcripción
- [x] 4.1.1 Crear página transcripción
- [x] 4.1.2 Integrar GET /incapacidades/transcripciones/pendientes
- [x] 4.1.3 Tabla con semáforo por días restantes (verde/amarillo/rojo)
- [x] 4.1.4 Integrar POST /incapacidades/{id}/transcribir (registrar radicación)
- [x] 4.1.5 Integrar PATCH /incapacidades/{id}/transcripcion (marcar en proceso)
- [ ] 4.1.6 Upload de evidencia de radicación

#### 4.2 Plazos y Vencimientos
- [x] 4.2.1 Integrar GET /incapacidades/{id}/plazos
- [x] 4.2.2 Mostrar alertas de vencimiento próximo
- [ ] 4.2.3 Notificaciones de incapacidades por vencer

---

### 🔵 PRIORIDAD 5 - SEGUIMIENTO Y COBRO (Semana 3-4)

#### 5.1 Seguimiento de Cobro
- [x] 5.1.1 Crear página seguimiento cobro
- [x] 5.1.2 Integrar GET /cobros/seguimientos
- [x] 5.1.3 Integrar POST /cobros/seguimientos (registrar seguimiento)
- [ ] 5.1.4 Timeline de seguimientos (llamadas, correos, respuestas)
- [ ] 5.1.5 Tipos de seguimiento (ver en docs)

#### 5.2 Cobro Jurídico
- [x] 5.2.1 Crear página cobro jurídico
- [x] 5.2.2 Cards de casos críticos, EPS incumplidas, casos >180 días
- [x] 5.2.3 Tabla con estado jurídico, días mora, valor adeudado
- [ ] 5.2.4 Integrar escalation flow

#### 5.3 Pagos
- [x] 5.3.1 Crear página pagos
- [x] 5.3.2 Integrar GET /cobros/pagos
- [x] 5.3.3 Integrar POST /cobros/pagos (registrar pago)
- [x] 5.3.4 Formulario: entidad, fecha, valor, referencia, archivo soporte
- [ ] 5.3.5 Tabla con valor esperado vs recibido, diferencias

---

### 🟣 PRIORIDAD 6 - CONCILIACIÓN (Semana 4)

#### 6.1 Conciliación Contable
- [x] 6.1.1 Crear página conciliación (vista tipo Excel)
- [x] 6.1.2 Integrar GET /cobros/pagos?conciliado=false
- [x] 6.1.3 Integrar PATCH /cobros/pagos/{id}/conciliar
- [x] 6.1.4 Columnas: entidad, colaborador, esperado, pagado, diferencia, estado
- [ ] 6.1.5 Exportar a Excel
- [ ] 6.1.6 Marcar diferencias

---

### 🟡 PRIORIDAD 7 - DASHBOARD (Semana 4-5)

#### 7.1 Dashboard Principal
- [x] 7.1.1 Crear página /dashboard
- [x] 7.1.2 KPIs superiores (incapacidades activas, pendientes, pagadas, rechazadas)
- [x] 7.1.3 Gráfico pie chart: estados (recibida, transcrita, cobrada, rechazada, pagada)
- [x] 7.1.4 Gráfico barras por entidad (SURA, Nueva EPS, Sanitas, SOS)
- [ ] 7.1.5 Cards alertas: documentos faltantes, >90 días, pagos retrasados, casos jurídicos
- [x] 7.1.6 Tabla últimas incapacidades

#### 7.2 Estadísticas de Cartera
- [x] 7.2.1 Integrar GET /cartera/estadisticas
- [x] 7.2.2 Integrar GET /cartera/resumen-entidad
- [x] 7.2.3 Integrar GET /cartera/vencida
- [x] 7.2.4 Integrar GET /cartera/alertas-vencimiento

---

### 🟠 PRIORIDAD 8 - ALERTAS Y NOTIFICACIONES (Semana 5)

#### 8.1 Centro de Alertas
- [x] 8.1.1 Crear página /alertas
- [x] 8.1.2 Tipos: documentos faltantes, pago vencido, transcripción próxima, >90 días
- [x] 8.1.3 Cards tipo Trello con prioridades (🔴 alta, 🟡 media, 🟢 baja)
- [x] 8.1.4 Integrar GET /cartera/alertas-vencimiento

#### 8.2 Notificaciones
- [x] 8.2.1 Integrar GET /notificaciones
- [x] 8.2.2 Badge en header con count de no leídas
- [x] 8.2.3 PATCH /notificaciones/{id}/leida
- [x] 8.2.4 PATCH /notificaciones/marcar-todas-leidas

---

### 🔵 PRIORIDAD 9 - REPORTES (Semana 5-6)

#### 9.1 Reportes Administrativos
- [x] 9.1.1 Crear página /reportes
- [x] 9.1.2 Tipos: incapacidades, ausentismo, cartera, juridico, sg-sst
- [x] 9.1.3 Filtros: fecha, entidad, tipo, estado
- [x] 9.1.4 Integrar POST /reportes
- [ ] 9.1.5 Exportar PDF y Excel
- [x] 9.1.6 Integrar GET /reportes/resumen-ejecutivo

#### 9.2 Reporte SG-SST
- [x] 9.2.1 Indicadores de ausentismo mensual
- [x] 9.2.2 Días perdidos
- [x] 9.2.3 Incapacidades recurrentes
- [x] 9.2.4 Incapacidades >180 días

---

### 🟣 PRIORIDAD 10 - USUARIOS Y ROLES (Semana 6)

#### 10.1 Gestión de Usuarios
- [x] 10.1.1 Crear página /usuarios
- [x] 10.1.2 Tabla: nombre, rol, estado, último acceso
- [x] 10.1.3 Crear/editar usuario
- [x] 10.1.4 Bloquear/reset contraseña

#### 10.2 Roles y Permisos
- [ ] 10.2.1 Crear página /roles
- [ ] 10.2.2 Matriz de permisos por módulo (ver, crear, editar, eliminar, aprobar)
- [ ] 10.2.3 Integrar con el campo "rol.permisos" del login

---

### 🟡 PRIORIDAD 11 - CONFIGURACIÓN (Semana 6)

#### 11.1 Parámetros del Sistema
- [ ] 11.1.1 Crear página /configuracion
- [ ] 11.1.2 Catálogos: estados, tipos incapacidad, entidades, tipos documento
- [ ] 11.1.3 Configuración de alertas (días, tiempos vencimiento)
- [ ] 11.1.4 Canales de recepción
- [ ] 11.1.5 Correos de notificación
- [ ] 11.1.6 Integrar GET /catalogos/* (tipos-documento, estados-documento, tipos-pago)

---

### 🔴 PRIORIDAD 12 - AUDITORÍA (Semana 6-7)

#### 12.1 Historial y Auditoría
- [ ] 12.1.1 Crear página /auditoria
- [ ] 12.1.2 Timeline global de acciones
- [ ] 12.1.3 Filtros: usuario, fecha, tipo acción, módulo
- [ ] 12.1.4 Integrar GET /incapacidades/{id}/historial
- [ ] 12.1.5 Mostrar cambio realizado, usuario, fecha

---

## 📦 Componentes Reutilizables a Crear

| Componente | Descripción |
|------------|-------------|
| `KpiCard` | Card para dashboard con valor, label, cambio % |
| `StatusBadge` | Badge con color según estado (ya existe, adaptar) |
| `StepperEstados` | Stepper visual de estados de incapacidad |
| `FileUploader` | Drag & drop con preview y validación |
| `DocumentChecklist` | Checklist visual de documentos requeridos |
| `AlertaCard` | Card tipo Trello para alertas |
| `SearchInput` | Input de búsqueda con debounce (ya existe) |
| `FilterPanel` | Panel de filtros avanzado (ya existe) |
| `DateRangePicker` | Selector de rango de fechas |
| `Timeline` | Timeline vertical para histórico |
| `EntitySelector` | Selector de EPS/ARL con búsqueda |
| `PaymentForm` | Formulario de registro de pagos |
| `ConciliationTable` | Tabla editable tipo Excel |

---

## 🎨 Estilo y UX

- **UI Framework:** Material UI (MUI) - ya configurado
- **Estilo visual:** ERP moderno corporativo (referencias: Monday, SAP Fiori, Notion)
- **Icons:** Material Icons
- **Colores:** Definir paleta según identidad de empresa

---

## 📝 Notas de Implementación

1. **Tipos TypeScript:** Crear interfaces para cada entidad según AGENTS.md response
2. **Servicios API:** Crear carpeta `/services/api/incapacidades`, `/cobros`, etc.
3. **Testing:** Mantener estructura cypress existente
4. **Responsive:** Asegurar funcionamiento en desktop (prioridad) y tablet
5. **Performance:** Implementar virtualización para tablas grandes

---

## 🚀 Orden de Implementación Recomendado

1. Configuración + Auth → 2. Layout + Rutas → 3. Login → 4. Dashboard → 5. Listado Incapacidades → 6. Crear Incapacidad → 7. Detalle → 8. Documentos → 9. Transcripción → 10. Seguimiento → 11. Pagos → 12. Conciliación → 13. Reportes → 14. Configuración → 15. Auditoría

---

## ✅ RESUMEN DE TAREAS COMPLETADAS

### Fundamentos y Auth
- ✅ Eliminado ~30 slices de Redux no usados
- ✅ Eliminado ~20 servicios API del sistema anterior
- ✅ Eliminado ~15 componentes no usados
- ✅ Eliminado ~10 páginas del sistema de chat
- ✅ Eliminado ~20 hooks no usados
- ✅ Eliminado ~30 tipos de archivos no usados
- ✅ Simplificado Table component
- ✅ Configurado SnackbarProvider
- ✅ Optimizado bundle (eliminadas dependencias no usadas)
- ✅ Tipos TypeScript para Auth (Token, User, Credentials)
- ✅ Servicio authentication adaptado
- ✅ Slice Redux de autenticación con permisos
- ✅ Hook useAuth para manejo de sesión
- ✅ Interceptor axios para token automático
- ✅ ProtectedRoute para verificar auth
- ✅ Navegación con permisos por rol

### Core Incapacidades
- ✅ Servicio API incapacidades
- ✅ Página /incapacidades con tabla y filtros
- ✅ Formulario crear incapacidad (Formik + Yup)
- ✅ Página detalle incapacidad con tabs
- ✅ Dashboard con KPIs y gráficos (pie/bar con Nivo)

### Cartera y Cobros
- ✅ Servicio API cartera
- ✅ Servicio API cobros/pagos y seguimientos
- ✅ Página /pagos con tabla y formulario registro
- ✅ Página /seguimiento con casos vencidos
- ✅ Página /juridico con cards por días de mora

### Documentos
- ✅ FileUploader con drag & drop
- ✅ DocumentChecklist con estados visuales
- ✅ Página /documentos con visor de archivos
- ✅ Página /validacion con aprobar/rechazar
- ✅ Componentes reutilizables para gestión documental

### Transcripción EPS/ARL
- ✅ Página /transcripcion con semáforo de días
- ✅ Cards: vencidas, en proceso, completadas
- ✅ Función transcribirIncapacidad API
- ✅ Dialog para registrar número radicado

### Usuarios y Roles
- ✅ Página /usuarios con gestión de roles
- ✅ Hook usePermission para verificación de permisos
- ✅ Filtro de menú lateral según permisos del usuario