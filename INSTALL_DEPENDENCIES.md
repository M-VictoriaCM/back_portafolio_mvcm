# 📦 Instalación de Dependencias - Opciones B y D

## 🔧 Opción B: Validación con Zod

### Instalar Zod

```bash
npm install zod
```

### Verificar Instalación

```bash
npm list zod
```

Deberías ver algo como:
```
└── zod@3.22.4
```

---

## 🧪 Opción D: Testing Unitario con Jest

### Instalar Jest y Dependencias

```bash
npm install --save-dev jest @types/jest ts-jest @jest/globals
npm install --save-dev @types/node
```

### Crear Configuración de Jest

Crear archivo `jest.config.js` en la raíz del proyecto:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
```

### Actualizar package.json

Agregar scripts de testing:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

---

## ✅ Verificación

### Verificar Zod

Crear archivo `test-zod.ts`:

```typescript
import { z } from 'zod';

const schema = z.object({
  name: z.string()
});

const result = schema.parse({ name: 'Test' });
console.log('Zod funciona:', result);
```

Ejecutar:
```bash
npx ts-node test-zod.ts
```

### Verificar Jest

```bash
npm test
```

Deberías ver la ejecución de los tests creados.

---

## 📊 Estructura de Tests

```
src/
├── services/
│   └── base/
│       ├── BaseService.ts
│       └── __tests__/
│           └── BaseService.test.ts
├── controllers/
│   └── base/
│       └── __tests__/
│           └── BaseController.test.ts (pendiente)
└── schemas/
    ├── category.schema.ts
    ├── project.schema.ts
    └── __tests__/
        └── validation.test.ts (pendiente)
```

---

## 🐛 Resolución de Problemas

### Error: "Cannot find module 'zod'"

**Solución:**
```bash
npm install zod
```

### Error: "Jest encountered an unexpected token"

**Solución:** Asegurar que `ts-jest` esté configurado en `jest.config.js`

### Error: TypeScript no encuentra tipos de Jest

**Solución:**
```bash
npm install --save-dev @types/jest
```

Agregar a `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["jest", "node"]
  }
}
```

---

## 📝 Comandos Rápidos

```bash
# Instalación completa de una vez
npm install zod
npm install --save-dev jest @types/jest ts-jest @jest/globals @types/node

# Ejecutar tests
npm test

# Ver cobertura
npm run test:coverage
```

---

**Fecha:** Nov 8, 2025  
**Estado:** Listo para instalar
