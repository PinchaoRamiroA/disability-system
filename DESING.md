---
name: Disability System Dark
description: Modern enterprise healthcare SaaS design system focused on medical leave and disability management.
version: 1.0.0

colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"

  secondary: "#64748b"
  secondary-hover: "#475569"

  success: "#10b981"
  warning: "#f59e0b"
  danger: "#ef4444"

  background: "#0f172a"
  surface: "#111827"
  surface-elevated: "#1e293b"

  border: "#334155"
  border-soft: "#1e293b"

  text-primary: "#f8fafc"
  text-secondary: "#cbd5e1"
  text-muted: "#94a3b8"

  sidebar: "#020617"
  sidebar-active: "#1e40af"

  error: "#fca5a5"

typography:
  fontFamily: "Inter"

  display-lg:
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48px

  heading-lg:
    fontSize: 30px
    fontWeight: 600
    lineHeight: 38px

  heading-md:
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px

  heading-sm:
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px

  body-lg:
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px

  body-md:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px

  body-sm:
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px

  label:
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.08em

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px

rounded:
  sm: 6px
  md: 10px
  lg: 14px
  xl: 18px

shadows:
  sm: "0 1px 2px rgba(0,0,0,0.2)"
  md: "0 4px 12px rgba(0,0,0,0.25)"
  lg: "0 8px 24px rgba(0,0,0,0.35)"

layout:
  sidebar-width: 280px
  topbar-height: 72px
  content-max-width: 1600px

---

# Design System

## Overview

Disability System Dark is a modern enterprise healthcare SaaS design system focused on:

- medical leave management
- disability tracking
- healthcare administrative workflows
- financial reconciliation
- enterprise dashboards

The interface should feel:

- professional
- reliable
- calm
- modern
- structured
- information-dense without feeling crowded

This is NOT a consumer healthcare app.

It is an enterprise operational platform.

---

# Design Philosophy

## Core Principles

1. Clarity over decoration
2. Fast workflows over visual complexity
3. Consistency over experimentation
4. Accessibility over trendiness
5. Quiet interfaces over noisy dashboards

---

# Visual Direction

The product should resemble:

- Linear
- Vercel Dashboard
- Stripe Dashboard
- Notion
- Ramp
- Modern Healthcare SaaS products

---

# Color Usage

## Primary

### Blue
`#2563eb`

Used for:
- primary actions
- active navigation
- focused states
- selected rows
- important KPIs

Use sparingly.

---

## Success

### Green
`#10b981`

Used for:
- paid statuses
- completed workflows
- approved documents
- successful validations

---

## Warning

### Amber
`#f59e0b`

Used for:
- pending validations
- approaching deadlines
- medium-priority alerts

---

## Danger

### Red
`#ef4444`

Used for:
- rejected cases
- overdue payments
- destructive actions
- legal escalation

---

# Background System

## Background
`#0f172a`

Main application background.

---

## Surface
`#111827`

Cards, tables, panels, dialogs.

---

## Elevated Surface
`#1e293b`

Dropdowns, modals, floating content.

---

# Typography

## Font Family

Use:
- Inter

Fallbacks:
- system-ui
- sans-serif

---

# Typography Rules

## Headlines
- Semi-bold
- Tight spacing
- High contrast

---

## Body Text
- 14px–16px
- Comfortable line height
- Neutral contrast

---

## Labels
- Medium weight
- Uppercase only when necessary
- Never excessive tracking

---

# Layout Principles

## Structure

The application layout should use:

```txt
Sidebar
Topbar
Content Area
```

---

# Sidebar

The sidebar should:
- remain fixed
- use dark surfaces
- prioritize navigation clarity
- support nested sections

---

# Topbar

The topbar should contain:
- breadcrumbs
- quick search
- notifications
- user profile
- contextual actions

---

# Dashboard Philosophy

Dashboards should prioritize:

- operational visibility
- quick scanning
- actionable data
- low cognitive load

Avoid:
- decorative charts
- oversized widgets
- unnecessary animations

---

# Cards

## Style

Cards should:
- use subtle borders
- avoid excessive elevation
- maintain soft contrast
- prioritize spacing

---

## Avoid

- glassmorphism
- strong gradients
- glowing effects
- overly rounded corners

---

# Buttons

## Primary Buttons

Use:
- blue fill
- white text
- medium contrast
- subtle hover transitions

---

## Secondary Buttons

Use:
- dark surface
- soft borders
- muted text

---

## Danger Buttons

Use:
- red accents only
- never oversaturate destructive actions

---

# Inputs

Inputs should:
- have clear borders
- use dark surfaces
- provide visible focus states
- support validation feedback

---

# Tables

Tables are critical in this product.

## Tables Must

- support dense information
- maintain readability
- use zebra-hover patterns carefully
- support sticky headers
- support filtering/searching

---

# Table Row States

## Selected
Use:
- subtle blue surface

## Hover
Use:
- elevated surface

## Error
Use:
- soft red tint

---

# Status System

## Success
Paid / Approved / Completed

## Warning
Pending / Awaiting / Review

## Danger
Rejected / Overdue / Escalated

## Neutral
Draft / Archived / Informational

---

# Icons

Use:
- Lucide React

Icons should:
- remain minimal
- use consistent stroke widths
- avoid filled icon systems

---

# Modals

Modals should:
- remain narrow
- focus on task completion
- avoid nested modals
- support keyboard interactions

---

# Notifications

Notifications should:
- be subtle
- avoid interrupting workflows
- use toast positioning carefully

---

# Animations

## Allowed

- subtle hover transitions
- opacity fades
- soft dropdown animations

---

## Avoid

- bounce animations
- excessive motion
- distracting transitions

---

# Accessibility

Accessibility is mandatory.

The system must:
- maintain 4.5:1 contrast ratio
- support keyboard navigation
- support screen readers
- provide visible focus states
- use semantic HTML

---

# Responsive Behavior

## Desktop First

The primary experience is desktop enterprise usage.

---

## Tablet

Must remain fully usable.

---

## Mobile

Only critical workflows are required:
- notifications
- quick status checks
- document uploads

---

# Healthcare UX Rules

This is a healthcare operations platform.

Therefore:
- errors must be explicit
- workflows must feel safe
- interfaces must reduce mistakes
- destructive actions require confirmation
- status visibility is critical

---

# Do's and Don'ts

## Do

- Maintain consistency
- Use spacing generously
- Keep interfaces calm
- Prioritize readability
- Design for operators working long hours

---

## Don't

- Overdesign dashboards
- Use flashy animations
- Add unnecessary colors
- Create visually noisy screens
- Hide critical information

---

# Final Experience Goal

The application should feel like:

- a trusted enterprise healthcare platform
- a production-ready SaaS product
- a clean operational system
- a modern administrative dashboard

Users should feel:
- confident
- fast
- organized
- informed
- in control