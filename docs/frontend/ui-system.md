# UI System

## Design Philosophy

The application should feel:
- Modern, fast, professional
- Clinical but friendly
- Minimal, enterprise-grade
- Reliable, organized

## UX Principles

1. Clarity
2. Simplicity
3. Accessibility
4. Speed
5. Consistency
6. Scalability
7. Readability

## Visual Principles

### Use
- Soft spacing
- Clear typography hierarchy
- Clean layouts
- Subtle shadows
- Neutral palettes
- Card-based dashboards
- Structured tables
- Quiet interfaces

### Avoid
- Overdesigned interfaces
- Excessive animations
- Visual noise
- Too many colors
- Heavy gradients
- Cluttered dashboards

## Color Palette

**Preferred:**
- White
- Slate
- Zinc
- Neutral gray
- Medical blue
- Soft green
- Light cyan

**Avoid:**
- Neon colors
- Oversaturated palettes
- Aggressive contrast

## Typography

**Preferred fonts:**
- Inter
- Geist
- IBM Plex Sans

**Principles:**
- Clean sans-serif
- Strong hierarchy
- Comfortable spacing

## Component Standards

### Components Must
- Be reusable
- Be composable
- Have single responsibility
- Remain small and readable
- Separate UI from business logic

### Avoid
- Massive components
- Deep prop drilling
- Repeated logic
- Large monolithic pages

## Accessibility

All screens must:
- Support keyboard navigation
- Have proper labels
- Use semantic HTML
- Support screen readers
- Maintain contrast compliance

## MUI Usage

**Use MUI ONLY when:**
- Accessibility complexity is high
- Component is highly technical
- Development time significantly reduced
- Enterprise-grade interaction patterns needed

**Allowed MUI Components:**
- DataGrid
- DatePicker
- Advanced Autocomplete
- Complex Selects

**Avoid for:**
- Layouts
- Basic cards
- Simple buttons
- Typography
- Basic forms
- Simple modals
- Navigation

## Design Inspirations

- Linear
- Stripe Dashboard
- Vercel
- Notion
- Ramp
- Modern Healthcare SaaS
- Atlassian admin systems