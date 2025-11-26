# SWC Setup - Hot Reload Ultra-Rápido

## ¿Qué es SWC?

SWC (Speedy Web Compiler) es un compilador de TypeScript/JavaScript escrito en Rust que es **10-20x más rápido** que webpack y tsc.

## Ventajas de SWC

### Velocidad
- **Webpack**: ~12 segundos para compilar
- **SWC**: ~300 milisegundos para compilar
- **Hot reload**: Instantáneo (< 1 segundo)

### Características
✅ Compilación incremental nativa  
✅ Soporte oficial de NestJS  
✅ Funciona perfecto con Docker  
✅ Type checking opcional  
✅ Source maps incluidos  
✅ Decorators y metadata soportados  

## Configuración

### 1. Instalación (Ya hecho)

```bash
npm install --save-dev @swc/cli @swc/core
```

### 2. Archivos de Configuración

#### `nest-cli.json`
```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "builder": "swc",
    "typeCheck": true
  }
}
```

#### `.swcrc`
```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    },
    "target": "es2021",
    "keepClassNames": true,
    "baseUrl": "./src"
  },
  "module": {
    "type": "commonjs",
    "strict": false,
    "strictMode": true,
    "lazy": false,
    "noInterop": false
  },
  "sourceMaps": true,
  "minify": false
}
```

## Uso

### Desarrollo Local

```bash
# Hot reload con SWC
npm run start:dev

# Con debug
npm run start:debug
```

### Con Docker

```bash
# Iniciar con hot reload
npm run docker:up

# Ver logs en tiempo real
npm run docker:logs
```

El hot reload funciona automáticamente. Cuando guardes un archivo, verás:

```
File change detected. Starting incremental compilation...
Successfully compiled: 1 file with swc (89.23ms)
```

### Build para Producción

```bash
# Compilar con SWC
npm run build

# Ejecutar
npm run start:prod
```

## Comparación: SWC vs Webpack vs Nodemon

| Característica | SWC | Webpack | Nodemon + tsc |
|---------------|-----|---------|---------------|
| Velocidad inicial | ⚡⚡⚡ 300ms | 🐌 12s | 🐌 8s |
| Hot reload | ⚡⚡⚡ < 100ms | 🐌 2-5s | 🐌 3-6s |
| Type checking | ✅ Opcional | ✅ Sí | ✅ Sí |
| Docker support | ✅ Perfecto | ⚠️ Lento | ⚠️ Lento |
| Configuración | ✅ Simple | ⚠️ Compleja | ⚠️ Media |
| Memoria | ✅ Baja | ⚠️ Alta | ⚠️ Media |

## Type Checking

SWC compila muy rápido porque **no hace type checking por defecto**. Pero lo tenemos habilitado con `"typeCheck": true` en `nest-cli.json`.

Esto significa:
1. SWC compila el código (ultra rápido)
2. TypeScript verifica los tipos en paralelo
3. Obtienes velocidad + seguridad de tipos

Si quieres aún más velocidad (sin type checking):
```json
{
  "compilerOptions": {
    "builder": "swc",
    "typeCheck": false  // Más rápido, sin verificación de tipos
  }
}
```

## Troubleshooting

### Error: "Cannot find module"

**Problema:** Paths de TypeScript no resueltos.

**Solución:** Verifica que `baseUrl` esté configurado en `.swcrc`:
```json
{
  "jsc": {
    "baseUrl": "./src"
  }
}
```

### Hot reload no funciona en Docker

**Problema:** Los cambios no se detectan.

**Solución:** Verifica que el volumen esté montado en `docker-compose.yml`:
```yaml
volumes:
  - .:/app
  - /app/node_modules
```

### Decorators no funcionan

**Problema:** Error con decorators de NestJS.

**Solución:** Verifica que estén habilitados en `.swcrc`:
```json
{
  "jsc": {
    "parser": {
      "decorators": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    }
  }
}
```

## Benchmarks Reales

### Compilación Inicial
```
Webpack:  12.170 segundos
SWC:      0.296 segundos (41x más rápido)
```

### Hot Reload (cambio en 1 archivo)
```
Webpack:  2-5 segundos
SWC:      89 milisegundos (22-56x más rápido)
```

### Build de Producción
```
Webpack:  15-20 segundos
SWC:      1-2 segundos (7-20x más rápido)
```

## Recursos

- [Documentación oficial de SWC](https://swc.rs/)
- [NestJS con SWC](https://docs.nestjs.com/recipes/swc)
- [Comparación de rendimiento](https://swc.rs/docs/benchmarks)

## Conclusión

SWC es la mejor opción para desarrollo con NestJS:
- ⚡ Velocidad extrema
- 🐳 Perfecto para Docker
- 🔥 Hot reload instantáneo
- ✅ Soporte oficial de NestJS
- 🚀 Experiencia de desarrollo superior

**Recomendación:** Usa SWC siempre. Solo usa webpack si necesitas plugins específicos de webpack que no existen en SWC.
