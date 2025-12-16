# Pruebas de Validación de Fechas - Study Schema

## Validaciones Implementadas

### 1. Validación de `startYear`
- ✅ No puede ser mayor al año actual
- ✅ Debe ser mayor a 1900
- ✅ Debe ser un número entero
- ✅ Es opcional y puede ser null

### 2. Validación de `endYear`
- ✅ No puede ser menor a `startYear`
- ✅ Debe ser mayor a 1900
- ✅ Debe ser un número entero
- ✅ Es opcional y puede ser null

---

## Casos de Prueba

### ✅ Casos Válidos

#### 1. Ambos años válidos
```json
{
  "title": "Ingeniería en Sistemas",
  "institution": "Universidad Nacional",
  "startYear": 2020,
  "endYear": 2024,
  "type": "universitario",
  "status": "finalizado"
}
```
**Esperado:** ✅ APROBADO

#### 2. Solo startYear
```json
{
  "title": "Curso de React",
  "institution": "Platzi",
  "startYear": 2023,
  "type": "curso",
  "status": "en_curso"
}
```
**Esperado:** ✅ APROBADO

#### 3. Sin años (ambos null/undefined)
```json
{
  "title": "Bootcamp Full Stack",
  "institution": "Coding Dojo",
  "type": "bootcamp",
  "status": "finalizado"
}
```
**Esperado:** ✅ APROBADO

#### 4. startYear igual a año actual
```json
{
  "title": "Certificación AWS",
  "institution": "Amazon",
  "startYear": 2025,
  "endYear": 2025,
  "type": "certificación",
  "status": "en_curso"
}
```
**Esperado:** ✅ APROBADO (2025 es el año actual en el contexto de prueba)

#### 5. endYear igual a startYear
```json
{
  "title": "Curso corto",
  "institution": "Udemy",
  "startYear": 2023,
  "endYear": 2023,
  "type": "curso",
  "status": "finalizado"
}
```
**Esperado:** ✅ APROBADO

---

### ❌ Casos Inválidos

#### 1. startYear mayor al año actual
```json
{
  "title": "Estudio futuro",
  "institution": "Universidad",
  "startYear": 2026,
  "endYear": 2027,
  "type": "universitario",
  "status": "en_curso"
}
```
**Esperado:** ❌ ERROR
**Mensaje:** "El año de inicio no puede ser mayor a 2025 (año actual)"

#### 2. endYear menor a startYear
```json
{
  "title": "Ingeniería",
  "institution": "Universidad",
  "startYear": 2023,
  "endYear": 2022,
  "type": "universitario",
  "status": "finalizado"
}
```
**Esperado:** ❌ ERROR
**Mensaje:** "El año de finalización no puede ser menor al año de inicio"

#### 3. startYear menor a 1900
```json
{
  "title": "Historia",
  "institution": "Museo",
  "startYear": 1850,
  "endYear": 1900,
  "type": "curso",
  "status": "finalizado"
}
```
**Esperado:** ❌ ERROR
**Mensaje:** "El año de inicio debe ser mayor a 1900"

#### 4. endYear menor a 1900
```json
{
  "title": "Historia",
  "institution": "Museo",
  "startYear": 1950,
  "endYear": 1850,
  "type": "curso",
  "status": "finalizado"
}
```
**Esperado:** ❌ ERROR
**Mensaje:** "El año de finalización debe ser mayor a 1900"

#### 5. startYear no es entero
```json
{
  "title": "Curso",
  "institution": "Plataforma",
  "startYear": 2023.5,
  "endYear": 2024,
  "type": "curso",
  "status": "finalizado"
}
```
**Esperado:** ❌ ERROR
**Mensaje:** "El año de inicio debe ser un número entero"

#### 6. endYear no es entero
```json
{
  "title": "Curso",
  "institution": "Plataforma",
  "startYear": 2023,
  "endYear": 2024.5,
  "type": "curso",
  "status": "finalizado"
}
```
**Esperado:** ❌ ERROR
**Mensaje:** "El año de finalización debe ser un número entero"

---

## Comandos para Probar

### Crear estudio válido
```bash
curl -X POST http://localhost:3000/api/studies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ingeniería en Sistemas",
    "institution": "Universidad Nacional",
    "startYear": 2020,
    "endYear": 2024,
    "type": "universitario",
    "status": "finalizado"
  }'
```

### Crear estudio con endYear menor a startYear (debe fallar)
```bash
curl -X POST http://localhost:3000/api/studies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ingeniería",
    "institution": "Universidad",
    "startYear": 2023,
    "endYear": 2022,
    "type": "universitario",
    "status": "finalizado"
  }'
```

### Crear estudio con startYear futuro (debe fallar)
```bash
curl -X POST http://localhost:3000/api/studies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudio futuro",
    "institution": "Universidad",
    "startYear": 2026,
    "endYear": 2027,
    "type": "universitario",
    "status": "en_curso"
  }'
```

### Actualizar estudio con validaciones
```bash
curl -X PUT http://localhost:3000/api/studies/{id} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startYear": 2020,
    "endYear": 2024
  }'
```

---

## Respuestas Esperadas

### ✅ Éxito (201 Created)
```json
{
  "message": "Estudio creado correctamente",
  "study": {
    "id": "uuid-aqui",
    "title": "Ingeniería en Sistemas",
    "institution": "Universidad Nacional",
    "startYear": 2020,
    "endYear": 2024,
    "type": "universitario",
    "status": "finalizado",
    "userId": "user-uuid",
    "createdAt": "2025-11-15T15:30:00Z",
    "updatedAt": "2025-11-15T15:30:00Z"
  }
}
```

### ❌ Error de Validación (400 Bad Request)
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["body", "endYear"],
      "message": "El año de finalización no puede ser menor al año de inicio"
    }
  ]
}
```

---

## Notas Importantes

1. **Año Actual:** Las validaciones usan `new Date().getFullYear()` que se evalúa en tiempo de ejecución.

2. **Campos Opcionales:** Tanto `startYear` como `endYear` son opcionales, por lo que:
   - Puedes crear un estudio sin ninguno de los dos
   - Puedes crear un estudio solo con `startYear`
   - No puedes crear un estudio solo con `endYear` sin `startYear` (fallará la validación)

3. **Validación en Ambos Schemas:** Las validaciones se aplican tanto en:
   - `createStudySchema` (crear nuevo estudio)
   - `updateStudySchema` (actualizar estudio existente)

4. **Mensajes de Error Claros:** Cada validación proporciona un mensaje específico indicando cuál es el problema.

---

## Implementación en el Código

Las validaciones se encuentran en:
📄 `src/schemas/study.schema.ts`

**Método de validación:** `superRefine()` de Zod
- Permite validaciones complejas que dependen de múltiples campos
- Proporciona mensajes de error personalizados
- Especifica el campo que causó el error con `path`

---

## Próximas Mejoras (Opcionales)

1. Agregar validación de fechas exactas (día/mes/año) en lugar de solo años
2. Permitir rangos de años más flexibles (ej: estudios en progreso sin fecha de fin)
3. Agregar validación de duración máxima de estudio
4. Implementar validaciones en el frontend para feedback inmediato

