# Reglas De Negocio

Las reglas de negocio describen condiciones y decisiones propias de La Racha.

## Usuarios

- RN-000A: Un usuario puede borrar su propia cuenta si lo desea.
- RN-000B: Borrar una cuenta de usuario no debe borrar automáticamente el histórico de los grupos donde haya participado.
- RN-000C: Si un usuario borra su cuenta, sus membresías históricas deben conservarse para no romper quedadas, asistencias, insignias, recuperaciones o estadísticas.
- RN-000D: Si el usuario que borra su cuenta es admin de un grupo, antes de borrar la cuenta el rol admin pasa al miembro activo más antiguo de ese grupo.
- RN-000E: Al borrar una cuenta, las membresías asociadas se desvinculan del usuario y pasan a estado `eliminada`.
- RN-000F: Si el admin borra su cuenta y no existe otro miembro activo al que traspasar el rol, deberá borrar el grupo antes o cancelar el borrado de cuenta.

## Grupos

- RN-001: Todo grupo debe tener al menos un administrador.
- RN-002: El creador del grupo se convierte en administrador inicial.
- RN-002A: En el MVP solo puede existir un administrador por grupo.
- RN-002B: El rol de administrador es inamovible e intransferible en el MVP, salvo por borrado de cuenta del admin.
- RN-002C: Si el admin borra su cuenta, el miembro activo más antiguo del grupo pasa a ser admin.
- RN-003: Solo el administrador puede modificar el nombre del grupo.
- RN-004: Solo el administrador puede modificar la foto de perfil del grupo.
- RN-005: El administrador elige la frecuencia de racha al crear el grupo.
- RN-005A: La frecuencia de racha no se podrá modificar después de crear el grupo en el MVP.
- RN-006: Solo el administrador puede eliminar el grupo.
- RN-007: Un grupo es privado por defecto.
- RN-007A: La información interna del grupo no se comparte por defecto.
- RN-007B: En versiones futuras, el grupo podrá compartir solo contenido concreto de forma explícita, como insignias, highlights, fotos seleccionadas o Wrapped.
- RN-007C: La eliminación de un grupo debe pedir confirmaciones fuertes porque borra también sus datos asociados.

## Membresías

- RN-008: Una membresía pertenece a un único grupo.
- RN-009: Un usuario puede estar asociado a varias membresías si pertenece a varios grupos.
- RN-010: Una membresía puede tener rol de administrador o miembro normal.
- RN-010A: Una membresía puede existir sin cuenta de usuario asociada.
- RN-010B: Una membresía sin cuenta no puede iniciar sesión ni ejecutar acciones autenticadas por sí misma.
- RN-010C: Solo un administrador puede crear o gestionar membresías sin cuenta.
- RN-010D: Una membresía puede tener estado `activa` o `eliminada`.
- RN-010E: Solo las membresías activas aparecen por defecto al registrar asistencias.
- RN-010F: Una membresía eliminada conserva su histórico, pero deja de aparecer como miembro actual del grupo.
- RN-010G: Un usuario real no puede tener dos membresías activas en el mismo grupo.
- RN-010H: No puede repetirse el apodo dentro del mismo grupo entre membresías activas.
- RN-010I: Solo el administrador puede eliminar membresías de un grupo.

## Quedadas

- RN-011: Una quedada pertenece a un único grupo.
- RN-012: Una quedada debe tener título y fecha.
- RN-013: Una quedada puede tener conductor, tipo de plan, momento del día, lugar, comida, duración, objetos perdidos, fotos y notas.
- RN-014: Una quedada cuenta para la racha solo si tiene al menos 3 asistentes.
- RN-015: Solo pueden asistir membresías del grupo al que pertenece la quedada.
- RN-015H: Al registrar una quedada, el sistema crea una asistencia para cada membresía activa del grupo.
- RN-015I: Las membresías marcadas como asistentes se guardan con estado `asistio`.
- RN-015J: Las membresías no marcadas se guardan automáticamente con estado `no_asistio`.
- RN-015K: La asistencia no usa estado `pendiente`; ese concepto no pertenece a quedadas realizadas.
- RN-015A: La duración de una quedada se guarda en minutos.
- RN-015B: Las fotos de una quedada se guardan como URLs simples en una tabla propia en el MVP.
- RN-015C: `tipo_plan`, `lugar` y `comida` pueden seleccionarse desde opciones reutilizables del grupo o crearse como opción nueva.
- RN-015D: Los objetos perdidos representan membresías que se han dejado algo.
- RN-015Q: El conductor, si existe, debe ser una membresía del mismo grupo que la quedada.
- RN-015R: Cada persona registrada en objetos perdidos debe ser una membresía del mismo grupo que la quedada.
- RN-015S: `momento_dia` podrá tener valores `manana`, `tarde`, `tarde_noche`, `noche` y `dia_completo`.
- RN-015V: Una quedada puede tener varias fotos.
- RN-015W: Una quedada puede tener varias personas registradas en objetos perdidos.
- RN-015X: Las quedadas no se borran en el MVP.
- RN-015Y: Todos los miembros reales del grupo pueden registrar y editar quedadas.
- RN-015Z: Editar una quedada debe recalcular los datos derivados que dependan de ella, como racha, insignias y recuperación.
- RN-015AA: Las ediciones de quedadas que afecten a varias tablas deben hacerse mediante una transacción.
- RN-015AB: Las notas de una quedada sirven como texto libre simple hasta que exista el sistema de highlights.

## Opciones Reutilizables

- RN-015E: Una opción reutilizable pertenece a un único grupo.
- RN-015F: Una opción reutilizable tiene un tipo, como `tipo_plan`, `lugar` o `comida`.
- RN-015G: Cuando se escribe una opción nueva en una quedada, el sistema puede guardarla para reutilizarla en futuras quedadas del mismo grupo.
- RN-015T: No puede repetirse el mismo valor de opción dentro del mismo grupo y tipo.
- RN-015U: Una opción reutilizable puede aparecer en muchas quedadas distintas.

## Calendario Compartido

- RN-015L: El calendario compartido sirve para indicar disponibilidad general, no para confirmar asistencia a un plan concreto.
- RN-015M: Una disponibilidad de calendario pertenece a una membresía y a un grupo.
- RN-015N: Una disponibilidad de calendario indica si una membresía está libre u ocupada en una fecha o franja.
- RN-015O: La app podrá detectar días o franjas donde varias membresías coinciden como libres.
- RN-015P: El administrador podrá crear una quedada en el calendario a partir de una coincidencia de disponibilidad.

## Rachas

- RN-016: Cada grupo tiene una frecuencia de racha configurada.
- RN-017: Una quedada cuenta para la racha si cumple la frecuencia configurada por el grupo.
- RN-018: Si un periodo configurado no tiene quedadas válidas, la racha se rompe.
- RN-019: La racha debe adaptarse a la vida real del grupo.
- RN-020: Las frecuencias iniciales posibles son: dos veces por semana, una vez por semana, dos veces al mes, una vez al mes y seis veces al año.
- RN-020A: La racha no se considera perdida hasta que termina el periodo que tocaba cumplir.
- RN-020B: Si la semana, mes o año actual todavía está en curso, el sistema no debe romper la racha por adelantado.
- RN-020C: Si el último periodo cerrado no se cumplió y antes existía una racha, el sistema detecta una pérdida de racha.
- RN-020D: Si ya existe una recuperación activa, no se detecta una nueva pérdida de racha encima de la anterior.

## Tregua De Verano

- RN-021: La tregua de verano es opcional.
- RN-021A: La tregua de verano solo puede activarse entre el 1 de junio y el 31 de agosto.
- RN-021B: La activación solo se ofrece al administrador del grupo.
- RN-021C: Si un usuario administra varios grupos, podrá seleccionar en qué grupos activa la tregua.
- RN-022: Si está activa, entre el 1 de junio y el 31 de agosto el grupo puede mantener la racha si se ve al menos dos veces.
- RN-023: La tregua mantiene la racha, pero no necesariamente la incrementa al ritmo normal.
- RN-023A: La tregua se desactiva automáticamente el 31 de agosto.
- RN-023B: La app avisará durante la última semana de agosto de que la tregua está a punto de terminar.

## Recuperación De Racha

- RN-024: Si se pierde una racha, puede existir un reto de recuperación.
- RN-025: El reto de recuperación exige compensar el tiempo de racha perdido.
- RN-026: El periodo usado para recuperar una racha no suma como nueva racha.
- RN-026A: En el MVP, si se pierde una racha, el grupo podrá recuperarla quedando de forma consecutiva durante el tiempo equivalente a la racha perdida.
- RN-026B: Ejemplo: si se pierde una racha de 3 semanas, el grupo deberá quedar durante las 3 semanas siguientes según su frecuencia para recuperarla.
- RN-026C: Cuando se pierde una racha, el sistema crea una recuperación de racha en estado `pendiente`.
- RN-026D: Una recuperación de racha tiene estado `pendiente`, `en_progreso`, `pausada`, `completada` o `fallida`.
- RN-026E: Un grupo no debería tener más de una recuperación de racha activa a la vez. Estados activos: `pendiente`, `en_progreso` y `pausada`.
- RN-026F: Cada periodo válido durante la recuperación incrementa el progreso de la recuperación.
- RN-026G: Las recuperaciones de racha se guardan para poder calcular estadísticas históricas.
- RN-026H: La recuperación no empieza hasta que el administrador decide reactivar la racha.
- RN-026I: Mientras la recuperación está pendiente, en progreso o pausada, la racha queda congelada y no se desbloquean insignias nuevas.
- RN-026J: Si el grupo falla una recuperación, la recuperación pasa a `fallida` y el siguiente intento empieza desde cero.
- RN-026K: La tregua de verano puede pausar una recuperación en progreso sin borrar su avance.

## Insignias De Racha

- RN-026L: Las insignias de racha se desbloquean según tiempo real de racha conseguido por el grupo.
- RN-026M: La recuperación de una racha rota no cuenta como tiempo nuevo de racha.
- RN-026N: Si un grupo tenía 2 semanas de racha, la pierde y tarda 2 semanas en recuperarla, al completarla vuelve a tener 2 semanas de racha; no desbloquea la insignia de 1 mes por el tiempo usado en recuperación.
- RN-026O: Las frecuencias no semanales también desbloquean insignias según tiempo real. Un grupo mensual podrá conseguir hitos de 1 mes en adelante, pero no insignias semanales.
- RN-026P: Una misma insignia de racha no se desbloquea dos veces para el mismo grupo.

## Highlights

- RN-027: Un highlight pertenece a una quedada.
- RN-028: Una membresía puede proponer highlights.
- RN-029: Un highlight puede tener texto y foto.
- RN-030: Las membresías pueden votar highlights.
- RN-031: El highlight con más votos queda marcado como highlight principal.

## Capa Social Futura

- RN-032: Un usuario puede seguir a otros usuarios.
- RN-033: Un usuario puede seguir grupos.
- RN-034: Un grupo no puede seguir usuarios ni grupos.
- RN-035: Un grupo decide qué contenido comparte públicamente.
- RN-036: Seguir a un usuario permite ver sus grupos y el contenido público compartido por esos grupos.
- RN-037: Seguir a un grupo permite ver el contenido público compartido por ese grupo.
