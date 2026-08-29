# Requisitos Funcionales

Los requisitos funcionales describen qué debe poder hacer el sistema.

## MVP

### Gestión De Grupos

- RF-001: El sistema debe permitir crear un grupo de amigos.
- RF-002: El sistema debe asignar como administrador inicial al creador del grupo.
- RF-003: El sistema debe permitir editar el nombre del grupo.
- RF-004: El sistema debe permitir editar la foto de perfil del grupo.
- RF-005: El sistema debe permitir configurar la frecuencia de racha al crear el grupo.
- RF-006: El sistema debe permitir eliminar un grupo solo al administrador.
- RF-006A: El sistema debe impedir cambiar la frecuencia de racha después de crear el grupo en el MVP.

### Gestión De Usuarios

- RF-006B: El sistema debe permitir que un usuario borre su propia cuenta.
- RF-006C: El sistema debe conservar el histórico de grupos, quedadas y asistencias aunque un usuario borre su cuenta.
- RF-006D: El sistema debe traspasar el rol admin al miembro activo más antiguo si el admin borra su cuenta.
- RF-006E: El sistema debe impedir el borrado de cuenta de un admin si no existe otro miembro activo y el grupo no se borra antes.

### Gestión De Membresías

- RF-007: El sistema debe permitir añadir membresías a un grupo.
- RF-008: El sistema debe permitir listar las membresías de un grupo como miembros visibles del grupo.
- RF-009: El sistema debe distinguir entre rol administrador y rol miembro.
- RF-009A: El sistema debe permitir crear membresías sin cuenta de usuario asociada.
- RF-009B: El sistema debe permitir eliminar visualmente una membresía sin borrar su histórico.
- RF-009C: El sistema debe mantener un único administrador por grupo en el MVP.
- RF-009D: El sistema debe permitir eliminar membresías de un grupo solo al administrador.

### Gestión De Quedadas

- RF-010: El sistema debe permitir registrar una quedada.
- RF-011: El sistema debe permitir indicar título y fecha de una quedada.
- RF-012: El sistema debe permitir seleccionar el squad asistente.
- RF-013: El sistema debe permitir indicar conductor.
- RF-014: El sistema debe permitir indicar tipo de plan.
- RF-015: El sistema debe permitir indicar momento del día.
- RF-016: El sistema debe permitir indicar lugar.
- RF-017: El sistema debe permitir indicar comida.
- RF-018: El sistema debe permitir indicar duración.
- RF-019: El sistema debe permitir registrar objetos perdidos.
- RF-020: El sistema debe permitir asociar varias fotos a una quedada.
- RF-021: El sistema debe permitir consultar el historial de quedadas de un grupo.
- RF-022: El sistema debe permitir ver el detalle de una quedada.
- RF-022A: El sistema debe permitir guardar opciones reutilizables por grupo para comida, lugar y tipo de plan.
- RF-022B: El sistema debe permitir seleccionar opciones reutilizadas al registrar una quedada.
- RF-022C: El sistema debe permitir crear una opción nueva desde el formulario de quedada.
- RF-022D: El sistema debe permitir añadir notas libres a una quedada.
- RF-022E: El sistema debe permitir editar una quedada existente.
- RF-022F: El sistema debe impedir borrar quedadas en el MVP.
- RF-022G: El sistema debe registrar qué membresía creó una quedada.

### Rachas

- RF-023: El sistema debe calcular si una quedada cuenta para la racha.
- RF-024: El sistema debe calcular la racha actual de un grupo.
- RF-025: El sistema debe mostrar la racha actual del grupo.
- RF-026: El sistema debe permitir varias frecuencias de racha.
- RF-026A: El sistema debe crear una recuperación de racha cuando un grupo pierda una racha.
- RF-026B: El sistema debe mostrar el progreso de una recuperación de racha.
- RF-026C: El sistema debe marcar una recuperación como completada cuando el grupo cumpla los periodos necesarios.
- RF-026D: El sistema debe conservar las recuperaciones de racha para estadísticas históricas.

### Insignias

- RF-027: El sistema debe mostrar insignias iniciales.
- RF-028: El sistema debe desbloquear insignias según hitos de racha del grupo.

## Futuro

### Highlights

- RF-029: El sistema debe permitir proponer highlights de una quedada.
- RF-030: El sistema debe permitir votar highlights.
- RF-031: El sistema debe elegir como highlight principal el más votado.
- RF-032: El sistema debe permitir asociar una foto a un highlight.

### Álbum De Fotos

- RF-041: El sistema debe permitir crear un álbum privado por grupo.
- RF-042: El sistema debe permitir subir fotos al álbum de un grupo.
- RF-043: El sistema debe permitir asociar fotos a quedadas.
- RF-044: El sistema debe permitir marcar fotos destacadas.
- RF-045: El sistema debe permitir consultar fotos por grupo, quedada o fecha.

### Trofeos

- RF-046: El sistema debe permitir definir trofeos personales.
- RF-047: El sistema debe permitir calcular ganadores de trofeos según estadísticas del grupo.
- RF-048: El sistema debe permitir entregar trofeos a membresías concretas.
- RF-049: El sistema debe permitir consultar los trofeos de una membresía dentro de un grupo.
- RF-050: El sistema debe permitir incluir trofeos en el Wrapped del grupo.

### Cartas Coleccionables

- RF-051: El sistema debe permitir mantener un catálogo de cartas coleccionables diseñadas previamente.
- RF-052: El sistema debe asociar cartas coleccionables a tipos de plan.
- RF-053: El sistema debe desbloquear una carta para un grupo cuando registre por primera vez el tipo de plan correspondiente.
- RF-054: El sistema debe permitir consultar la colección de cartas desbloqueadas por un grupo.

### Calendario Compartido

- RF-055: El sistema debe permitir que las membresías indiquen disponibilidad general en un calendario compartido.
- RF-056: El sistema debe permitir marcar una fecha o franja como libre u ocupada.
- RF-057: El sistema debe permitir consultar la disponibilidad de las membresías del grupo.
- RF-058: El sistema debe detectar días o franjas donde varias membresías coinciden como libres.
- RF-059: El sistema debe permitir que el administrador cree una quedada en el calendario a partir de una coincidencia de disponibilidad.

### Museo Del Grupo

- RF-060: El sistema debe mostrar un espacio con trofeos, insignias, cartas, fotos destacadas y récords del grupo.

### Wrapped

- RF-061: El sistema debe generar un resumen visual de estadísticas y recuerdos del grupo por periodo.

### Usuarios Y Privacidad

- RF-062: El sistema debe permitir registrar usuarios.
- RF-063: El sistema debe permitir iniciar sesión.
- RF-064: El sistema debe permitir que un usuario pertenezca a varios grupos.
- RF-065: El sistema debe impedir que usuarios ajenos vean contenido privado de un grupo.

### Capa Social

- RF-066: El sistema debe permitir seguir usuarios.
- RF-067: El sistema debe permitir seguir grupos.
- RF-068: El sistema debe permitir que un grupo comparta contenido público.
- RF-069: El sistema debe mostrar un feed con contenido compartido.
