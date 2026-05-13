# Backend API Standards

## Base URL

```
Development: http://localhost:8080/api/v1
Production: Configured via environment variable
```

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require JWT authentication.

```typescript
// Include in Authorization header
Authorization: Bearer <access_token>
```

## Standard Response Format

```typescript
{
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details: Record<string, unknown>;
  };
}
```

## Pagination Response

```typescript
{
  success: true;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
```

## Error Handling

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## Date Formats

All dates in ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`

## File Upload Rules

- Max file size: 10MB
- Supported formats: PDF, JPG, PNG
- Use multipart/form-data for binary uploads