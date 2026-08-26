# RPD - Requisitos Del Producto

## 1. Resumen

La Racha es una aplicación para fomentar que la gente quede más en persona mediante grupos de amigos, rachas, recuerdos, logros y una capa social competitiva.

El MVP será privado y centrado en grupos cerrados. La visión futura es convertirlo en una red social donde usuarios y grupos puedan compartir logros o momentos concretos, siempre desde una lógica de privacidad por defecto.

El objetivo del MVP no es construir la versión perfecta, sino validar que la mecánica principal funciona: registrar quedadas, calcular una racha y hacer que el grupo quiera volver a usar la app.

## 2. Problema

Muchos grupos de amigos quieren verse más, pero la organización acaba dispersa entre chats, notas, calendarios o recuerdos sueltos en galerías. Las redes sociales públicas no encajan bien porque priorizan exposición, likes y contenido para fuera del grupo.

La Racha intenta resolver esto creando un espacio íntimo, compartido y centrado en el vínculo del grupo, con una capa social futura que motive planes reales en vez de consumo pasivo.

## 3. Público Objetivo

Jóvenes de entre 16 y 30 años con grupos cerrados de 3 a 10 amigos.

Perfil principal:

- Valoran los recuerdos compartidos.
- Usan chats grupales para organizarse.
- Les motiva la nostalgia, la gamificación y los retos suaves.
- Quieren compartir algunas cosas, pero no convertir toda su vida privada en contenido público.

## 4. Propuesta De Valor

La Racha ayuda a los grupos de amigos a verse más, recordar mejor lo vivido juntos y competir sanamente por mantener sus rachas.

La app combina cuatro ideas:

- Organización ligera de planes.
- Álbum privado de recuerdos.
- Juego social basado en rachas, insignias y estadísticas.
- Capa social opcional para compartir logros o momentos elegidos.

## 5. Visión Social Futura

La Racha podrá evolucionar hacia una red social de planes y rachas, pero con privacidad por defecto.

Reglas de la visión social:

- Un usuario puede pertenecer a varios grupos.
- Un usuario puede seguir a otros usuarios.
- Un usuario puede seguir a varios grupos.
- Un grupo no puede seguir a usuarios ni a otros grupos.
- Un grupo es privado por defecto.
- Un grupo puede decidir compartir contenido concreto: fotos, logros, highlights, estadísticas o hitos.
- Un usuario que sigue a otro usuario podrá ver a qué grupos pertenece ese usuario y el contenido público que esos grupos compartan.
- Un usuario que sigue a un grupo podrá ver el contenido público compartido por ese grupo.

Esta parte no entra en el MVP inicial porque añade complejidad de privacidad, permisos, feeds, moderación y relaciones sociales.

## 6. Alcance Del MVP

El MVP debe permitir que un grupo pueda registrar su actividad básica sin depender de funciones avanzadas.

Incluye:

- Crear un grupo.
- Asignar como administrador al usuario o miembro que crea el grupo.
- Crear miembros dentro del grupo.
- Registrar una quedada.
- Marcar asistentes.
- Guardar detalles importantes de la quedada.
- Configurar una frecuencia básica de racha para el grupo.
- Calcular si la quedada cuenta para la racha elegida.
- Mostrar la racha actual.
- Mostrar un historial de quedadas.
- Subir o asociar una foto a una quedada, si técnicamente no bloquea demasiado.
- Mostrar insignias iniciales.

No incluye todavía:

- Feed social público.
- Seguidores.
- Compartir contenido fuera del grupo.
- Chat interno.
- IA generativa.
- Recomendaciones automáticas.
- Sistema avanzado de privacidad.
- App móvil nativa.
- Notificaciones push.
- Pagos.

## 7. Datos De Una Quedada

Una quedada podrá registrar:

- Título.
- Fecha.
- Squad: miembros que asistieron.
- Conductor.
- Tipo de plan.
- Momento del día.
- Lugar.
- Comida.
- Duración.
- Objetos perdidos: cosas que alguien se dejó en casa, en el coche o en otro sitio.
- Foto relacionada.

Para el MVP, algunos campos pueden ser opcionales o simplificados.

## 8. Highlights

Después de una quedada, los miembros pueden proponer cuál fue la mejor parte del plan.

Funcionamiento deseado:

- Cada miembro puede sugerir uno o varios highlights.
- Un highlight puede tener texto y foto.
- Los miembros pueden votar.
- El highlight con más votos queda marcado como highlight principal de la quedada.

Esta funcionalidad es importante para la identidad del producto, pero puede entrar después de la primera demo si retrasa demasiado el MVP.

## 9. Reglas Iniciales De La Racha

La racha no debe ser una regla única para todos los grupos. La idea inicial de "una quedada por semana" funciona para grupos jóvenes con mucha disponibilidad, pero puede ser demasiado rígida para personas con trabajos, hijos, vacaciones o agendas complicadas.

Cada grupo podrá tener una configuración de racha elegida por el administrador.

Opciones posibles:

- Dos veces por semana.
- Una vez por semana.
- Dos veces al mes.
- Una vez al mes.
- Seis veces al año.
- Configuración personalizada futura.

Una quedada cuenta para la racha si:

- tiene al menos 3 asistentes;
- pertenece al grupo activo;
- cumple la frecuencia configurada por el grupo.

La racha actual aumenta cuando el grupo cumple el periodo configurado de forma consecutiva.

Si el periodo configurado no tiene ninguna quedada válida, la racha se rompe.

### Tregua De Verano

Para que la app no castigue dinámicas normales de vacaciones, puede existir una tregua de verano.

Idea inicial:

- Durante un rango de tres meses de verano, el grupo no pierde la racha si consigue verse al menos dos veces.
- La tregua mantiene viva la racha, pero no necesariamente la aumenta al mismo ritmo.
- El administrador puede activar o desactivar esta regla para su grupo.

### Recuperación De Racha

Si un grupo pierde la racha, puede existir una mecánica de recuperación.

Idea inicial:

- Si se pierde una racha, el grupo puede recuperarla completando un reto de compensación.
- Ejemplo: si se pierde una racha de 3 semanas, el grupo debe quedar 3 semanas seguidas para recuperarla.
- Las semanas usadas para recuperar la racha no suman como nueva racha.
- En el ejemplo anterior, después de 3 semanas de recuperación, el grupo recuperaría su racha de 3 semanas, no pasaría a tener 6.

Estas reglas son provisionales y se podrán ajustar cuando se pruebe con usuarios reales.

## 10. Modelo De Datos Inicial

Entidades mínimas para el MVP:

- **Usuario:** persona que accede a la app.
- **Grupo:** espacio privado de amigos con una configuración de racha.
- **Miembro:** perfil de una persona dentro de un grupo, con rol normal o administrador.
- **Quedada:** plan realizado por el grupo.
- **Asistencia:** relación entre miembro y quedada.
- **Insignia:** logro desbloqueable.

Entidades futuras:

- **Seguidor de usuario:** relación entre dos usuarios.
- **Seguidor de grupo:** relación entre usuario y grupo.
- **Publicación compartida:** contenido que un grupo decide hacer visible fuera del grupo.
- **Highlight:** propuesta votable asociada a una quedada.
- **Voto de highlight:** voto de un miembro sobre un highlight.

Campos orientativos:

- Grupo: nombre, descripción, foto de perfil, privacidad, frecuencia de racha, tregua de verano, fecha de creación.
- Miembro: nombre, avatar, grupo, usuario asociado opcional, rol.
- Quedada: título, fecha, grupo, conductor, tipo de plan, momento del día, lugar, comida, duración, objetos perdidos, foto.
- Asistencia: quedada, miembro, estado.
- Insignia: nombre, descripción, criterio, fecha de desbloqueo.
- Highlight: quedada, autor, texto, foto, votos.

## 11. Roles Y Permisos

Cada grupo tendrá al menos un administrador. Inicialmente, el administrador será el usuario o miembro que crea el grupo.

Permisos del administrador:

- Modificar el nombre del grupo.
- Modificar la foto de perfil del grupo.
- Cambiar la configuración de racha.
- Activar o desactivar reglas especiales, como la tregua de verano.
- Eliminar el grupo.

Permisos de miembros normales:

- Ver el contenido privado del grupo.
- Registrar o participar en quedadas, según las reglas que se definan.
- Proponer highlights.
- Votar highlights.

Para el MVP, los permisos pueden implementarse de forma simple, pero deben quedar representados en el modelo para no rediseñar todo después.

## 12. Pantallas Del MVP

- Inicio del grupo: racha actual, próxima acción y resumen rápido.
- Historial: lista de quedadas realizadas.
- Detalle de quedada: información, asistentes, foto y detalles del plan.
- Nueva quedada: formulario para registrar un plan.
- Miembros: lista de personas del grupo.
- Insignias: logros desbloqueados y pendientes.
- Ajustes del grupo: nombre, foto, configuración de racha y acciones de administrador.

Pantallas futuras:

- Feed de contenido compartido.
- Perfil de usuario.
- Perfil público de grupo.
- Seguidores de usuario.
- Seguidores de grupo.
- Votación de highlights.

## 13. Criterios De Éxito

El MVP será válido si:

- permite registrar una quedada en menos de 1 minuto;
- calcula la racha de forma entendible;
- muestra de forma clara quién asistió a cada plan;
- recoge detalles suficientes para que la quedada se sienta como un recuerdo real;
- transmite una sensación cálida, privada y divertida;
- permite enseñar el proyecto a otra persona sin tener que explicarlo todo verbalmente.

## 14. Principios Del Producto

- Primero recuerdos reales, luego funcionalidades bonitas.
- Privado por defecto.
- Lo social debe fomentar planes, no likes vacíos.
- Pocas acciones, muy claras.
- La gamificación debe motivar, no presionar.
- La racha debe adaptarse a la vida real del grupo.
- La documentación debe ayudar a construir, no sustituir la construcción.
