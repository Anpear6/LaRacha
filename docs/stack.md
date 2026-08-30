# Stack Técnico

## Decisión Inicial

El stack elegido para La Racha será:

- **Lenguaje principal:** TypeScript.
- **Frontend:** React con Next.js.
- **Estilos:** Tailwind CSS.
- **Backend:** Supabase.
- **Base de datos:** PostgreSQL.
- **Autenticación:** Supabase Auth.
- **Almacenamiento de fotos:** Supabase Storage.
- **Testing:** Vitest para lógica y Playwright para flujos de interfaz.
- **Deploy:** Vercel.

## Por Qué Este Stack

El proyecto es didáctico, así que el stack debe servir para aprender tecnologías útiles en el mercado laboral actual, no solo para construir rápido.

### TypeScript

TypeScript ayuda a aprender a modelar datos y reducir errores. Para La Racha es especialmente útil porque habrá muchas entidades relacionadas: usuarios, grupos, membresías, quedadas, asistencias, rachas, insignias, highlights y permisos.

### React Y Next.js

React es una de las tecnologías frontend más demandadas y Next.js permite construir una aplicación web moderna con rutas, páginas, componentes y despliegue sencillo en Vercel.

Next.js también deja margen para crecer: al principio puede usarse para una app sencilla y más adelante permite añadir rutas protegidas, carga de datos, páginas públicas y vistas privadas.

### Supabase Y PostgreSQL

Supabase permite tener backend, base de datos, autenticación y almacenamiento sin construir toda la infraestructura desde cero.

PostgreSQL encaja muy bien con La Racha porque el dominio es relacional:

- un usuario puede estar en varios grupos;
- un grupo tiene muchas membresías;
- una quedada pertenece a un grupo;
- una quedada tiene asistentes;
- un highlight pertenece a una quedada;
- un grupo puede compartir contenido público en el futuro.

Aprender PostgreSQL también es útil porque SQL sigue siendo una habilidad muy transferible.

En el código, la conexión se hará con el cliente oficial `@supabase/supabase-js`. Las claves reales no se guardan en Git: el repositorio solo incluye `.env.example` como plantilla, y cada entorno tendrá su propio archivo privado de variables.

La capa de acceso a datos traducirá las filas de Supabase al modelo de dominio mediante mapeadores. Así la lógica de negocio trabaja con nombres TypeScript (`grupoId`) y no con nombres de tabla (`grupo_id`).

### Tailwind CSS

Tailwind permite crear una interfaz cuidada sin dedicar demasiado tiempo a organizar CSS desde cero. También se usa bastante en proyectos modernos con React y Next.js.

### Vitest Y Playwright

Vitest servirá para probar la lógica de negocio: cálculo de rachas, permisos, validaciones y reglas de highlights.

Playwright servirá más adelante para probar flujos completos: crear grupo, registrar quedada, marcar asistentes o votar highlights.

### Vercel

Vercel encaja bien con Next.js y permite desplegar la app de forma sencilla. Para un proyecto didáctico, tener una URL real ayuda mucho a enseñar avances.

## Alternativas Consideradas

### React + Vite

Es más simple para empezar y muy útil para aprender React. Se descarta como opción principal porque Next.js se parece más a lo que puede acabar necesitando La Racha: rutas, vistas públicas/privadas, despliegue integrado y crecimiento hacia aplicación completa.

### Node.js + NestJS

Es una opción potente para backend, pero añade más carga inicial. Para este proyecto, Supabase permite aprender backend, base de datos y autenticación sin tener que construir toda la API desde cero.

### Java + Spring Boot

Es muy demandado en empresa, especialmente en banca y sistemas grandes, pero puede ralentizar mucho este proyecto. La Racha necesita avanzar con rapidez suficiente como para no quedarse atascada antes del MVP.

### Python + FastAPI

Es una opción muy interesante para backend y APIs, pero mezclar Python para backend y TypeScript para frontend añade más contexto del necesario al principio.

## Orden De Construcción

Aunque muchas apps empiezan por una demo visual, en este proyecto se seguirá este orden:

1. **Lógica de dominio.**
2. **Backend y modelo de datos.**
3. **Frontend.**

Motivo: para la organización mental del proyecto, primero conviene entender las reglas, entidades y relaciones. Así el frontend se diseña sabiendo qué información existe, qué acciones son posibles y qué problemas ya están resueltos.

Este orden puede ser más lento al principio, pero debería dar una base más clara y estable.
