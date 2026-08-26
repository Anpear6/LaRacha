# Roadmap De Trabajo

Este roadmap está pensado para avanzar sin quedarse atrapada en documentación eterna. Cada fase debe terminar con algo visible o usable.

## Fase 0 - Base Del Proyecto

Objetivo: dejar el repositorio preparado para empezar a construir.

- [x] Tener README inicial.
- [x] Crear RPD breve.
- [x] Crear roadmap.
- [x] Añadir `.gitignore`.
- [x] Registrar visión social futura.
- [x] Registrar modelo ampliado de quedada.
- [x] Registrar administrador de grupo y permisos iniciales.
- [x] Registrar reglas flexibles de racha.
- [x] Crear registro de problemas y decisiones.
- [ ] Decidir stack inicial.
- [ ] Crear estructura técnica de la app.

## Fase 1 - MVP Privado Sin Login

Objetivo: construir una primera demo local que funcione aunque los datos sean temporales.

- [ ] Crear pantalla principal del grupo.
- [ ] Crear formulario de nueva quedada.
- [ ] Crear lista de miembros.
- [ ] Marcar un miembro como administrador del grupo.
- [ ] Permitir marcar asistentes.
- [ ] Registrar detalles básicos de la quedada: título, fecha, squad, conductor, tipo, momento del día, lugar, comida, duración y objetos perdidos.
- [ ] Permitir asociar una foto mock o URL de imagen a una quedada.
- [ ] Permitir elegir una frecuencia básica de racha.
- [ ] Calcular racha actual.
- [ ] Mostrar historial de quedadas.
- [ ] Mostrar primeras insignias.

## Fase 2 - Recuerdos E Highlights

Objetivo: hacer que cada quedada se sienta como un recuerdo, no solo como un registro.

- [ ] Crear propuestas de highlight por quedada.
- [ ] Permitir votar highlights.
- [ ] Marcar highlight ganador.
- [ ] Permitir foto en highlights.
- [ ] Mostrar highlight principal en el detalle de quedada.

## Fase 3 - Persistencia

Objetivo: guardar datos reales.

- [ ] Elegir base de datos.
- [ ] Crear esquema inicial.
- [ ] Guardar grupos.
- [ ] Guardar miembros.
- [ ] Guardar quedadas.
- [ ] Guardar asistencias.
- [ ] Guardar highlights.
- [ ] Leer datos persistidos en la interfaz.

## Fase 4 - Usuarios Y Privacidad

Objetivo: convertir la demo en una app privada de verdad.

- [ ] Añadir autenticación.
- [ ] Asociar usuarios a grupos.
- [ ] Permitir que un usuario pertenezca a varios grupos.
- [ ] Controlar acceso por grupo.
- [ ] Aplicar permisos de administrador.
- [ ] Crear invitaciones.
- [ ] Revisar reglas de privacidad.

## Fase 5 - Gamificación Y Estadísticas

Objetivo: hacer que La Racha empiece a sentirse única.

- [ ] Crear sistema de insignias real.
- [ ] Crear vista de estadísticas.
- [ ] Crear rankings internos del grupo.
- [ ] Crear tregua de verano configurable.
- [ ] Crear mecánica de recuperación de racha.
- [ ] Crear primera versión de "La Racha Wrapped".

## Fase 6 - Capa Social

Objetivo: añadir funciones sociales sin romper la privacidad del producto.

- [ ] Crear perfil de usuario.
- [ ] Crear perfil público opcional de grupo.
- [ ] Permitir seguir usuarios.
- [ ] Permitir seguir grupos.
- [ ] Crear contenido compartible por grupo.
- [ ] Crear feed con contenido compartido.
- [ ] Definir permisos de visibilidad.

## Siguiente Paso Recomendado

Elegir stack y crear el esqueleto técnico de la aplicación.

Propuesta inicial:

- React + Vite para frontend.
- TypeScript para aprender buenas prácticas desde el principio.
- CSS o Tailwind para estilos.
- Datos mock al inicio.
- Supabase más adelante para base de datos, autenticación y almacenamiento de fotos.
