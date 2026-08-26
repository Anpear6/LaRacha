# Registro De Problemas Y Decisiones

Este documento sirve para guardar problemas, dudas y decisiones importantes del proyecto. La idea es no perder razonamientos, pero sin convertir la documentación en un freno.

Formato recomendado:

- Problema.
- Impacto.
- Decisión actual.
- Estado.

## 1. Riesgo De Planificar Demasiado

**Problema:** el proyecto puede quedarse atrapado en documentación y planificación sin llegar a construir una primera versión.

**Impacto:** si no existe una demo usable pronto, será difícil validar la idea y mantener motivación.

**Decisión actual:** mantener la documentación justa: README, RPD, roadmap y este registro. Cada fase debe terminar con algo visible o usable.

**Estado:** decidido.

## 2. Red Social Vs MVP Privado

**Problema:** La Racha tiene potencial de red social, pero construir seguidores, feeds, permisos y contenido público desde el principio complica mucho el MVP.

**Impacto:** si se intenta construir la capa social demasiado pronto, el proyecto puede crecer demasiado antes de validar la mecánica principal.

**Decisión actual:** el MVP será privado y centrado en grupos cerrados. La capa social queda documentada como visión futura.

**Estado:** decidido por ahora.

## 3. Racha Semanal Demasiado Rígida

**Problema:** una regla única de quedar una vez por semana puede no encajar con grupos que tienen trabajos, hijos, vacaciones, estudios o vidas con menos disponibilidad.

**Impacto:** la app podría castigar a los mismos grupos que quiere ayudar, generando frustración en vez de motivación.

**Decisión actual:** permitir que el administrador configure la frecuencia de racha del grupo. Opciones iniciales: dos veces por semana, una vez por semana, dos veces al mes, una vez al mes o seis veces al año.

**Estado:** documentado; pendiente de decidir qué opciones entran en el MVP.

## 4. Vacaciones De Verano

**Problema:** muchos grupos se ven menos en verano porque la gente viaja, vuelve a su pueblo, trabaja o cambia de rutina.

**Impacto:** una racha puede romperse por una dinámica normal de vida, no por falta de interés del grupo.

**Decisión actual:** documentar una posible tregua de verano. Durante tres meses, el grupo podría mantener la racha si se ve al menos dos veces.

**Estado:** idea futura; no entra en el MVP inicial salvo que sea muy barato de implementar.

## 5. Recuperación De Racha Perdida

**Problema:** perder una racha larga puede desmotivar mucho al grupo.

**Impacto:** si la pérdida se siente irreversible, algunos grupos podrían abandonar la app.

**Decisión actual:** documentar una mecánica de recuperación. Si se pierde una racha, el grupo puede hacer un reto de compensación equivalente al tiempo perdido. Ese periodo recupera la racha, pero no suma como progreso nuevo.

**Estado:** idea futura.

## 6. Administrador Del Grupo

**Problema:** alguien debe poder gestionar datos sensibles del grupo, como nombre, foto, configuración de racha o eliminación del grupo.

**Impacto:** sin roles, cualquier miembro podría modificar o borrar cosas importantes.

**Decisión actual:** el creador del grupo será administrador inicial. Solo el administrador podrá modificar nombre, foto, configuración de racha y eliminar el grupo.

**Estado:** documentado; debe estar representado en el modelo desde el principio.
