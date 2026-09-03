# Roadmap De Trabajo

Este roadmap está pensado para avanzar sin quedarse atrapada en documentación eterna. Cada fase debe terminar con algo visible, revisable o usable.

## Fase 0 - Base Del Proyecto

Objetivo: dejar el repositorio preparado y la visión principal documentada.

- [x] Tener README inicial.
- [x] Crear RPD breve.
- [x] Crear roadmap.
- [x] Añadir `.gitignore`.
- [x] Registrar visión social futura.
- [x] Registrar administrador de grupo y permisos iniciales.
- [x] Registrar reglas flexibles de racha.
- [x] Crear registro de problemas y decisiones.
- [x] Decidir stack inicial.
- [x] Documentar stack inicial.
- [x] Crear documentación base de análisis.

## Fase 1 - Análisis Funcional Y Conceptual

Objetivo: dejar claros requisitos, reglas y modelo antes de programar.

- [x] Crear documento de requisitos funcionales.
- [x] Crear documento de requisitos no funcionales.
- [x] Crear documento de reglas de negocio.
- [x] Crear documento de modelo conceptual completo.
- [x] Crear documento de modelo conceptual detallado.
- [x] Crear documento de modelo conceptual del MVP.
- [x] Crear borrador de modelo lógico del MVP.
- [x] Separar asistencia de disponibilidad de calendario.
- [x] Unificar vocabulario técnico alrededor de membresía.
- [ ] Regenerar gráficos del modelo completo y del MVP cuando vuelva a estar disponible Eraser.
- [x] Revisar requisitos funcionales.
- [x] Revisar requisitos no funcionales.
- [x] Revisar reglas de negocio.
- [x] Revisar modelo conceptual.
- [x] Resolver dudas abiertas del análisis.
- [x] Marcar qué requisitos entran en MVP y cuáles quedan para futuro.

## Fase 2 - Modelo Lógico Final Y Base De Datos

Objetivo: convertir el análisis del MVP en una base de datos inicial.

- [x] Cerrar dudas del modelo lógico MVP.
- [x] Definir restricciones: `not null`, `unique`, valores permitidos y borrados.
- [x] Decidir estrategia inicial para URLs de avatar y foto de perfil.
- [x] Diseñar políticas básicas de privacidad por grupo.
- [x] Definir cómo se guardará el estado de recuperación de racha en la primera base de datos.
- [x] Convertir modelo lógico MVP a SQL.
- [x] Crear proyecto Supabase.
- [x] Crear tablas iniciales en PostgreSQL.
- [x] Crear datos semilla de prueba.
- [x] Verificar estructura y datos semilla en Supabase.
- [x] Diseñar políticas RLS del MVP.
- [x] Crear migración SQL con políticas RLS.
- [x] Alinear usuarios semilla con Supabase Auth.
- [x] Ejecutar políticas RLS en Supabase.
- [x] Ejecutar migración de estados pendientes y pausados de recuperación.
- [x] Verificar permisos básicos con usuarios reales desde script autenticado.
- [ ] Dejar preparado el flujo para automatizar migraciones y seed más adelante.

## Fase 3 - Dominio Y Lógica De Negocio

Objetivo: implementar reglas del producto en TypeScript sin depender todavía de la interfaz.

- [x] Crear configuración mínima de TypeScript.
- [x] Crear configuración mínima de Vitest.
- [x] Crear modelos TypeScript: usuario, grupo, membresía, opción de grupo, quedada, asistencia, racha e insignia.
- [x] Crear modelos TypeScript para fotos de quedada y objetos perdidos.
- [x] Definir roles de membresía: admin y miembro.
- [x] Definir estados de membresía: activa y eliminada.
- [x] Definir estados de asistencia: asistió y no asistió.
- [x] Definir frecuencias de racha permitidas.
- [x] Crear función para validar si una quedada cuenta para la racha.
- [x] Crear función para calcular la racha actual.
- [x] Crear función para detectar pérdida de racha.
- [x] Crear función para crear recuperación pendiente.
- [x] Crear función para activar, pausar, reanudar, completar y fallar recuperación de racha.
- [x] Crear función para comprobar permisos de administrador.
- [x] Crear función para generar asistencias al registrar una quedada.
- [x] Crear función para editar quedadas y recalcular datos derivados.
- [x] Crear función para desbloquear insignias de racha.
- [x] Crear función para resolver estado completo de racha, pérdida, recuperación e insignias.
- [x] Crear primeros tests de la lógica principal con Vitest.

## Fase 4 - Backend Y Acceso A Datos

Objetivo: conectar la lógica con Supabase y preparar operaciones reales.

- [x] Instalar cliente oficial de Supabase para la app.
- [x] Configurar cliente base de Supabase.
- [x] Crear plantilla de variables de entorno.
- [x] Crear tipos TypeScript iniciales de la base de datos.
- [x] Crear mapeadores entre filas de Supabase y modelos de dominio.
- [x] Documentar setup local inicial.
- [x] Comprobar conexión anónima con Supabase.
- [x] Crear script de comprobación con login real.
- [x] Ejecutar comprobación con login real.
- [ ] Crear flujo básico de autenticación en la app.
- [x] Crear operaciones para leer grupos de un usuario.
- [x] Crear operaciones para crear y editar grupos.
- [x] Crear operación para eliminar grupos.
- [x] Crear operaciones para leer membresías de un grupo.
- [x] Crear operaciones para leer opciones reutilizables por grupo.
- [x] Crear operaciones para gestionar membresías.
- [x] Crear script de comprobación para gestión de grupos y membresías.
- [x] Ejecutar migración SQL para gestión de grupos y membresías.
- [x] Validar gestión de grupos y membresías contra Supabase real.
- [x] Crear operaciones para crear opciones reutilizables por grupo.
- [x] Validar creación de opciones reutilizables contra Supabase real.
- [x] Crear operación para registrar quedadas completas.
- [x] Ejecutar migración SQL para registrar quedadas completas.
- [x] Validar registro de quedada completa contra Supabase.
- [x] Crear operaciones transaccionales para editar quedadas.
- [x] Ejecutar migración SQL para editar quedadas completas.
- [x] Validar edición de quedadas completas contra Supabase real.
- [x] Crear operación transaccional para generar asistencias al registrar quedada.
- [x] Crear operaciones para añadir fotos de quedada y objetos perdidos.
- [x] Crear operaciones para consultar historial de quedadas.
- [x] Crear operaciones para consultar racha e insignias.
- [x] Validar consulta de racha e insignias contra Supabase real.
- [x] Crear operaciones para guardar y gestionar recuperación de racha.
- [x] Ejecutar migración SQL para operaciones de recuperación de racha.
- [x] Validar recuperación de racha contra Supabase real.
- [x] Crear operación para guardar insignias de racha desbloqueadas.
- [x] Ejecutar migración SQL para guardar insignias de racha desbloqueadas.
- [x] Validar guardado de insignias de racha contra Supabase real.
- [x] Crear script de comprobación para guardar insignias desbloqueadas con confirmación.
- [x] Validar operaciones de lectura desde script autenticado.

## Fase 5 - Frontend MVP

Objetivo: construir la primera interfaz usable sobre el backend y la lógica ya definidos.

- [x] Crear estructura Next.js.
- [x] Crear pantalla inicial de acceso con intro, login y registro por pasos.
- [ ] Crear selector o inicio de grupo.
- [ ] Crear pantalla principal del grupo.
- [ ] Crear lista de membresías del grupo.
- [ ] Crear formulario de nueva quedada.
- [ ] Permitir marcar asistentes de forma rápida.
- [ ] Permitir usar o crear opciones de comida, lugar y tipo de plan.
- [ ] Permitir añadir varias fotos a una quedada.
- [ ] Permitir registrar varias personas con objetos perdidos.
- [ ] Permitir añadir notas libres a una quedada.
- [ ] Mostrar historial de quedadas.
- [ ] Mostrar racha actual.
- [ ] Mostrar estado de recuperación de racha si el grupo ha perdido la racha.
- [ ] Mostrar salón de la fama inicial con insignias bloqueadas/desbloqueadas.
- [ ] Mostrar accesos "Próximamente" para calendario, álbum, highlights y futuras colecciones.
- [ ] Crear ajustes básicos del grupo para administrador.

## Fase 6 - Recuerdos E Highlights

Objetivo: hacer que cada quedada se sienta como un recuerdo, no solo como un registro.

- [ ] Crear propuestas de highlight por quedada.
- [ ] Permitir votar highlights.
- [ ] Marcar highlight ganador.
- [ ] Permitir foto en highlights.
- [ ] Mostrar highlight principal en el detalle de quedada.

## Fase 7 - Privacidad, Invitaciones Y Gestión Real

Objetivo: convertir el MVP en una app privada más completa.

- [ ] Asociar usuarios reales a membresías existentes.
- [ ] Crear invitaciones.
- [ ] Controlar acceso por grupo.
- [ ] Aplicar permisos de administrador.
- [ ] Revisar políticas de privacidad.
- [ ] Preparar almacenamiento real de fotos.

## Fase 8 - Gamificación Y Estadísticas

Objetivo: hacer que La Racha empiece a sentirse única.

- [ ] Completar sistema visual de insignias.
- [ ] Crear vista de estadísticas.
- [ ] Crear rankings internos del grupo.
- [ ] Crear trofeos personales por membresía.
- [ ] Calcular ganadores de trofeos del Wrapped.
- [ ] Crear tregua de verano configurable.
- [ ] Crear primera versión de "La Racha Wrapped".

## Fase 9 - Álbum, Cartas Y Museo

Objetivo: convertir los recuerdos del grupo en una experiencia coleccionable.

- [ ] Crear álbum de fotos del grupo.
- [ ] Asociar fotos a quedadas.
- [ ] Marcar fotos destacadas.
- [ ] Crear catálogo de cartas coleccionables por tipo de plan.
- [ ] Desbloquear cartas para un grupo al registrar planes.
- [ ] Ampliar salón de la fama del grupo con highlights y álbum de fotos.
- [ ] Crear salón de la fama personal del usuario.
- [ ] Asociar insignias repetidas al primer grupo con el que el usuario las consiguió.
- [ ] Añadir trofeos personales y cartas coleccionables al salón personal.

## Fase 10 - Calendario Compartido

Objetivo: facilitar que el grupo concrete próximas quedadas.

- [ ] Crear calendario de disponibilidad por grupo.
- [ ] Permitir que cada membresía marque fechas o franjas como libre u ocupada.
- [ ] Mostrar coincidencias de disponibilidad entre membresías.
- [ ] Permitir que el administrador cree una quedada acordada en el calendario.
- [ ] Mostrar próximas quedadas.

## Fase 11 - Capa Social

Objetivo: añadir funciones sociales sin romper la privacidad del producto.

- [ ] Crear perfil de usuario.
- [ ] Crear perfil público opcional de grupo.
- [ ] Permitir seguir usuarios.
- [ ] Permitir seguir grupos.
- [ ] Crear contenido compartible por grupo.
- [ ] Crear feed con contenido compartido.
- [ ] Definir permisos de visibilidad.

## Siguiente Paso Recomendado

Diseñar el flujo visual del selector/inicio de grupo para usuarios autenticados.
