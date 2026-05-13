# Medical Leaves (Incapacidades) Flow

## Domain Entities

### Incapacidad (Disability/Medical Leave)

Core entity representing a medical leave request.

**States (Estados):**
- `Aprovada`- Aproved for EPS
- `Archivada`- Archived
- `Cobrada` - Charged
- `Cerrada` - Cloced
- `Cobro jurídico` - In legal collection stage
- `Cobro persuasivo` - In the persuasive collection stage
- `Conciliada` - Reconciliation completed
- `Documentación incompleta` - Required documents are missing
- `En conciliación` - Reconciliation in process
- `En validación documental` - Documents being validated
- `En verificación EPS` - Documents being validated
- `Transcrita` - Transcribed to EPS
- `Recibida` - Disability received in the system
- `Rechazada` - Disability denied
- `Pendiente transcripción` - Pending Transcribed to EPS
- `Pendiente pago` - Pending payment
- `Pagada` - Payment made

**Origins (Origen):**
- `enfermedad_general` - General illness
- `accidente_trabajo` - Work accident
- `accidente_transito` - Traffic accident
- `maternidad` - Maternity
- `paternidad` - Paternity

**Reception Channels (Canal Recepcion):**
- `email` - Email
- `presencial` - In person
- `virtual` - Online
- `fax` - Fax

### Entidad (EPS/ARL)

Healthcare provider entity.

**Types:**
- `EPS` - Health Insurance
- `ARL` - Work Risk Administrator

### Tipo (Disability Type)

Classification of medical leave types with required documents.

### Documento (Document)

Supporting documents for medical leaves.

**Types:**
- `certificado_incapacidad` - Certificado de incapacidad
- `certificado_nacido_vivo` - Certificado de nacido vivo
- `concepto_rehabilitacion` - Concepto de rehabilitación
- `documento_identidad` - Documento de identidad
- `epicrisis` - Epicrisis
- `evidencia_radicacion` - Evidencia de radicación
- `formato_seguimiento` - Formato de seguimiento
- `furips` - FURIPS
- `historia_clinica` - Historia clínica
- `registro_civil` - Registro civil
- `soporte_atencion_medica` - Soporte de atención médica
- `soporte_pago` - Soporte de pago

**States:**
- `pendiente` - Pending
- `validado` - Validated
- `rechazado` - Rejected

### Pago (Payment)

Payment from EPS/ARL for medical leave.

**Types:**
- `consignacion` - Consignación bancaria
- `pago_parcial` - Pago parcial
- `pago_total` - Pago total
- `reintegro` - Reintegro de pago
- `transferencia_bancaria` - Pago por transferencia bancaria

**States:**
- `archivado` - Documento archivado
- `incompleto` - Documento incompleto
- `pendiente` - Documento pendiente de validación
- `rechazado` - Documento rechazado
- `validado` - Documento validado correctamente
- `vencido` - Documento vencido

## Flow Overview

1. **Reception**: Employee submits incapacity documents through authorized channels
2. **Document Verification**: HR validates required documents according to incapacity type
3. **Registration**: Case is registered and digitized in the tracking system
4. **Transcription / Filing**: Incapacity is transcribed and filed before the EPS/ARL within entity deadlines
5. **Validation & Acceptance**: EPS/ARL reviews and validates the submitted documentation
6. **Payment Request**: Economic benefit claim is submitted to EPS/ARL
7. **Payment Tracking**: Weekly follow-up on payment status, rejections, and pending balances
8. **Reconciliation**: Accounting reconciles received payments with employee records
9. **Archiving**: Paid cases are archived and sensitive medical documents are disposed according to policy

## Key Business Rules

- All incapacity documents must be physically or digitally delivered to Human Resources
- Required documents depend on the incapacity type (general illness, work accident, traffic accident, maternity, paternity)
- Epicrisis is mandatory for incapacities longer than 2 days, work accidents, traffic accidents, and maternity/paternity cases
- FURIPS is mandatory for traffic accidents
- Missing documentation must be provided within 3 business days after notification
- Incapacity transcription deadlines depend on the EPS/ARL entity configuration
- Paternity leave claims must be submitted within 30 calendar days after birth
- Every transcription, payment request, and follow-up action must keep documentary evidence
- Payment tracking must be performed weekly until reconciliation
- EPS/ARL entities may take up to 3 years to complete payments
- Rejected claims must be corrected and resubmitted according to the entity procedure
- Payments must be reconciled with Accounting and Treasury records
- Medical history and epicrisis documents must not remain in the final archive
- Incapacity cases over 120 days require rehabilitation monitoring and EPS follow-up