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
- En la versión futura, seguir a un grupo podrá ser `abierto` o `por_solicitud`.
- Aunque un grupo pueda recibir seguidores, su información interna seguirá siendo privada.
- Un grupo puede decidir compartir contenido concreto: fotos, logros, highlights, estadísticas o hitos.
- Un usuario que sigue a otro usuario podrá ver a qué grupos pertenece ese usuario y el contenido público que esos grupos compartan.
- Un usuario que sigue a un grupo podrá ver el contenido público compartido por ese grupo.

Esta parte no entra en el MVP inicial porque añade complejidad de privacidad, permisos, feeds, moderación y relaciones sociales.

## 6. Alcance Del MVP

El MVP debe permitir que un grupo pueda registrar su actividad básica sin depender de funciones avanzadas.

Incluye:

- Crear usuarios reales.
- Permitir que un usuario borre su propia cuenta.
- Traspasar automáticamente el rol admin al miembro activo más antiguo si el admin borra su cuenta.
- Conservar el histórico de membresías, quedadas y asistencias cuando un usuario borra su cuenta.
- Crear un grupo.
- Asignar como administrador a la membresía del usuario que crea el grupo.
- Crear membresías dentro del grupo, incluyendo miembros internos sin cuenta si hace falta.
- Eliminar membresías de un grupo sin borrar su histórico.
- Registrar una quedada.
- Marcar asistentes.
- Guardar detalles importantes de la quedada.
- Configurar una frecuencia básica de racha al crear el grupo.
- Calcular si la quedada cuenta para la racha elegida.
- Mostrar la racha actual.
- Mostrar un historial de quedadas.
- Subir o asociar varias fotos a una quedada.
- Registrar notas libres de una quedada.
- Mostrar el salón de la fama inicial con insignias de racha bloqueadas y desbloqueadas.

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
- Squad: membresías que asistieron.
- Conductor.
- Tipo de plan.
- Momento del día.
- Lugar.
- Comida.
- Duración.
- Objetos perdidos: personas del grupo que se dejaron algo en casa, en el coche o en otro sitio.
- Fotos relacionadas.
- Notas.

Para el MVP, algunos campos pueden ser opcionales o simplificados.

## 8. Highlights

Después de una quedada, las membresías pueden proponer cuál fue la mejor parte del plan.

Funcionamiento deseado:

- Cada membresía puede sugerir uno o varios highlights.
- Un highlight puede tener texto y foto.
- Las membresías pueden votar.
- El highlight con más votos queda marcado como highlight principal de la quedada.

Esta funcionalidad es importante para la identidad del producto, pero puede entrar después de la primera demo si retrasa demasiado el MVP.

## 8.1 Salón De La Fama

La app tendrá dos formas de entender el salón de la fama:

- **Salón de la fama del grupo:** muestra los logros y recuerdos de un grupo concreto.
- **Salón de la fama personal:** resume los logros que un usuario ha conseguido a través de los grupos a los que pertenece.

En el MVP, el salón de la fama estará centrado en insignias de racha.

Funcionamiento del salón de la fama del grupo:

- Muestra el catálogo de insignias de racha.
- Las insignias no desbloqueadas aparecen apagadas, sombreadas o en blanco y negro.
- Las insignias desbloqueadas por ese grupo aparecen en color.
- En el futuro, este espacio también podrá incluir highlights y álbum de fotos del grupo.
- No incluirá trofeos personales, porque los trofeos se adjudican a membresías/personas.

Funcionamiento del salón de la fama personal:

- Un usuario puede pertenecer a varios grupos.
- Por eso puede haber conseguido la misma insignia en varios grupos distintos.
- En el salón personal, cada insignia se mostrará asociada al primer grupo con el que ese usuario la consiguió.
- En el futuro, este salón personal también podrá incluir trofeos personales y cartas coleccionables relacionadas con sus grupos.

Puntos de expansión:

- Aunque álbum, calendario, highlights, trofeos y cartas no estén implementados al principio, la interfaz podrá mostrar accesos visibles a esas secciones.
- Si una sección todavía no existe, se mostrará un estado de "Próximamente", por ejemplo: "Próximamente: Calendario".
- Estos accesos sirven para que el producto ya tenga forma de app completa, aunque algunas funcionalidades lleguen después.

## 9. Reglas Iniciales De La Racha

La racha no debe ser una regla única para todos los grupos. La idea inicial de "una quedada por semana" funciona para grupos jóvenes con mucha disponibilidad, pero puede ser demasiado rígida para personas con trabajos, hijos, vacaciones o agendas complicadas.

Cada grupo tendrá una configuración de racha elegida por el administrador al crear el grupo. En el MVP no se podrá modificar después para que las reglas del juego no cambien a conveniencia.

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

- La tregua se podrá activar entre el 1 de junio y el 31 de agosto.
- Solo el administrador podrá activarla.
- Si una persona administra varios grupos, podrá elegir en cuáles activa la tregua.
- Durante ese rango fijo de verano, el grupo no pierde la racha si consigue verse al menos dos veces.
- La tregua mantiene viva la racha, pero no necesariamente la aumenta al mismo ritmo.
- La tregua se desactiva automáticamente el 31 de agosto.
- Durante la última semana de agosto, la app avisará de que la tregua está a punto de terminar.

### Recuperación De Racha

Si un grupo pierde la racha, existirá una mecánica de recuperación desde el MVP.

Idea inicial:

- Si se pierde una racha, el grupo puede recuperarla completando un reto de compensación.
- Al romperse, la racha queda congelada y la recuperación queda pendiente.
- La recuperación no empieza hasta que el administrador decide reactivar la racha desde un mensaje de la aplicación.
- Ejemplo: si se pierde una racha de 3 semanas, el grupo debe quedar 3 semanas seguidas para recuperarla.
- Las semanas usadas para recuperar la racha no suman como nueva racha.
- En el ejemplo anterior, después de 3 semanas de recuperación, el grupo recuperaría su racha de 3 semanas, no pasaría a tener 6.
- La recuperación se guardará como entidad propia para poder mostrar progreso y calcular estadísticas históricas.
- Esta información permitirá saber cuántas veces se perdió la racha, cuántas recuperaciones se completaron y cuánto tiempo se invirtió recuperando.
- Si fallan durante la recuperación, el intento queda como fallido y el grupo tendrá que volver a completar todos los periodos necesarios desde cero.
- Mientras una recuperación no esté completada, no se desbloquean insignias nuevas.
- La tregua de verano podrá pausar una recuperación en progreso sin borrar el avance acumulado.

Estas reglas son provisionales y se podrán ajustar cuando se pruebe con usuarios reales.

## 10. Modelo De Datos Inicial

Entidades mínimas para el MVP:

- **Usuario:** persona que accede a la app.
- **Grupo:** espacio privado de amigos con una configuración de racha.
- **Membresía:** relación entre un usuario/persona y un grupo, con rol normal o administrador.
- **Quedada:** plan realizado por el grupo.
- **Asistencia:** relación entre membresía y quedada.
- **Foto de quedada:** foto asociada a una quedada.
- **Objeto perdido:** registro de una membresía que se dejó algo en una quedada.
- **Insignia:** logro desbloqueable.
- **Recuperación de racha:** intento de recuperar una racha perdida por un grupo.

Entidades futuras:

- **Seguidor de usuario:** relación entre dos usuarios.
- **Seguidor de grupo:** relación entre usuario y grupo.
- **Publicación compartida:** contenido que un grupo decide hacer visible fuera del grupo.
- **Highlight:** propuesta votable asociada a una quedada.
- **Voto de highlight:** voto de una membresía sobre un highlight.

Campos orientativos:

- Grupo: nombre, descripción, foto de perfil, privacidad, frecuencia de racha, tregua de verano, fecha de creación.
- Membresía: apodo, avatar de grupo, grupo, usuario asociado opcional, rol, estado.
- Quedada: título, fecha, grupo, creador, conductor, tipo de plan, momento del día, lugar, comida, duración y notas.
- Asistencia: quedada, membresía, estado.
- Foto de quedada: quedada, URL, descripción.
- Objeto perdido: quedada, membresía, descripción opcional.
- Insignia: nombre, descripción, criterio, tipo, imagen.
- Recuperación de racha: grupo, racha perdida, periodos necesarios, periodos completados, estado, fecha de inicio y fecha de fin.
- Highlight: quedada, autor, texto, foto, votos.

## 11. Roles Y Permisos

Cada grupo tendrá al menos un administrador. Inicialmente, el administrador será la membresía asociada al usuario que crea el grupo.

En el MVP habrá un único administrador por grupo. Será el creador, y el rol no se podrá transferir ni retirar manualmente. La única excepción será el borrado de cuenta del admin: en ese caso, el rol admin pasará al miembro activo más antiguo del grupo.

Si no existe otro miembro activo, el admin deberá borrar el grupo antes de borrar su cuenta o cancelar el borrado de cuenta.

Permisos del administrador:

- Modificar el nombre del grupo.
- Modificar la foto de perfil del grupo.
- Elegir la configuración de racha al crear el grupo.
- Activar o desactivar reglas especiales, como la tregua de verano.
- Eliminar membresías del grupo sin borrar su histórico.
- Eliminar el grupo.

Permisos de membresías con rol miembro:

- Ver el contenido privado del grupo.
- Registrar y editar quedadas.

Permisos futuros de membresías con rol miembro:

- Proponer highlights.
- Votar highlights.

Para el MVP, los permisos pueden implementarse de forma simple, pero deben quedar representados en el modelo para no rediseñar todo después.

## 12. Pantallas Del MVP

- Inicio del grupo: racha actual, próxima acción y resumen rápido.
- Historial: lista de quedadas realizadas.
- Detalle de quedada: información, asistentes, fotos, notas, objetos perdidos y detalles del plan.
- Nueva quedada: formulario para registrar un plan.
- Membresías: lista de personas visibles del grupo.
- Salón de la fama: insignias de racha desbloqueadas y pendientes.
- Accesos a secciones futuras con estado "Próximamente": calendario, álbum, highlights, trofeos y cartas cuando corresponda.
- Ajustes del grupo: nombre, foto, configuración de racha y acciones de administrador.

Pantallas futuras:

- Feed de contenido compartido.
- Perfil de usuario.
- Perfil público de grupo.
- Seguidores de usuario.
- Seguidores de grupo.
- Votación de highlights.
- Salón de la fama personal completo con trofeos y cartas coleccionables.

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
