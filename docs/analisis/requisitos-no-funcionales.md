# Requisitos No Funcionales

Los requisitos no funcionales describen cómo debe comportarse el sistema.

## Privacidad

- RNF-001: Los grupos deben ser privados por defecto.
- RNF-002: El contenido de un grupo solo debe ser visible para sus miembros, salvo que el grupo decida compartirlo.
- RNF-003: Las acciones administrativas deben estar restringidas al administrador del grupo.

## Seguridad

- RNF-004: La aplicación debe proteger las rutas privadas cuando exista autenticación.
- RNF-005: La base de datos debe aplicar reglas de acceso por grupo.
- RNF-006: No deben exponerse claves privadas en el frontend ni en el repositorio.

## Usabilidad

- RNF-007: Registrar una quedada debe poder hacerse en menos de 1 minuto.
- RNF-008: La racha actual debe ser fácil de entender.
- RNF-009: La app debe transmitir una sensación cálida, privada y divertida.
- RNF-010: Las acciones principales deben ser claras para usuarios no técnicos.

## Mantenibilidad

- RNF-011: La lógica de negocio debe estar separada de la interfaz.
- RNF-012: Las reglas de racha deben poder cambiar sin reescribir toda la app.
- RNF-013: Los modelos principales deben estar tipados con TypeScript.
- RNF-014: Las decisiones importantes deben registrarse en `docs/problemas-y-decisiones.md`.

## Rendimiento

- RNF-015: El MVP debe cargar de forma fluida con grupos pequeños de 3 a 10 miembros.
- RNF-016: Las consultas principales deben estar pensadas para crecer hacia múltiples grupos por usuario.

## Escalabilidad

- RNF-017: El modelo debe permitir que un usuario pertenezca a varios grupos.
- RNF-018: El modelo debe permitir añadir seguidores y contenido compartido en el futuro.
- RNF-019: El modelo debe permitir añadir fotos sin rediseñar las entidades principales.

## Calidad

- RNF-020: Las reglas críticas de negocio deben tener tests.
- RNF-021: El proyecto debe poder ejecutarse localmente con instrucciones claras.
- RNF-022: La documentación debe ser suficiente para retomar el proyecto después de una pausa.
