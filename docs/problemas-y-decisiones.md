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

**Decisión actual:** permitir que el administrador configure la frecuencia de racha al crear el grupo. Opciones iniciales: dos veces por semana, una vez por semana, dos veces al mes, una vez al mes o seis veces al año. En el MVP la frecuencia no se podrá cambiar después, para evitar cambiar las reglas del juego a conveniencia.

**Estado:** decidido.

## 4. Vacaciones De Verano

**Problema:** muchos grupos se ven menos en verano porque la gente viaja, vuelve a su pueblo, trabaja o cambia de rutina.

**Impacto:** una racha puede romperse por una dinámica normal de vida, no por falta de interés del grupo.

**Decisión actual:** documentar una tregua de verano fija entre el 1 de junio y el 31 de agosto. Solo el administrador puede activarla durante ese periodo. Si está activa, el grupo puede mantener la racha si se ve al menos dos veces durante el verano. Se desactiva automáticamente el 31 de agosto.

**Estado:** decidido para MVP simple.

## 5. Recuperación De Racha Perdida

**Problema:** perder una racha larga puede desmotivar mucho al grupo.

**Impacto:** si la pérdida se siente irreversible, algunos grupos podrían abandonar la app.

**Decisión actual:** la recuperación de racha entra en el MVP como entidad propia. Si se pierde una racha, el grupo puede hacer un reto de compensación equivalente al tiempo perdido. Ese periodo recupera la racha, pero no suma como progreso nuevo.

**Estado:** entra en el MVP como regla de negocio.

## 6. Administrador Del Grupo

**Problema:** alguien debe poder gestionar datos sensibles del grupo, como nombre, foto, configuración de racha o eliminación del grupo.

**Impacto:** sin roles, cualquier miembro podría modificar o borrar cosas importantes.

**Decisión actual:** el creador del grupo será administrador inicial. Solo el administrador podrá modificar nombre, foto, configuración de racha y eliminar el grupo.

**Estado:** documentado; debe estar representado en el modelo desde el principio.

## 7. Orden De Construcción

**Problema:** empezar por frontend puede dar avances visuales rápidos, pero puede resultar mentalmente confuso si todavía no están claras las entidades, reglas, permisos y relaciones del producto.

**Impacto:** diseñar pantallas antes de entender bien la lógica puede generar cambios constantes y sensación de desorden.

**Decisión actual:** construir en este orden: lógica de dominio, backend/modelo de datos y después frontend. El MVP sigue siendo importante, pero la prioridad inicial será tener una base conceptual y técnica clara.

**Estado:** decidido.

## 8. Elección De Stack

**Problema:** usar solo tecnologías conocidas puede ser cómodo, pero este proyecto también tiene un objetivo didáctico y debe servir para practicar tecnologías demandadas en el mercado laboral.

**Impacto:** una mala elección de stack puede ralentizar demasiado el proyecto o hacerlo menos útil como aprendizaje.

**Decisión actual:** usar TypeScript, React, Next.js, Tailwind CSS, Supabase, PostgreSQL, Vitest, Playwright y Vercel. La justificación completa está en `docs/stack.md`.

**Estado:** decidido.

## 9. Documentación De Análisis Antes De Programar

**Problema:** empezar directamente por código puede dejar poco claros los requisitos funcionales, requisitos no funcionales, reglas de negocio y modelo conceptual.

**Impacto:** si estas piezas no están separadas, la lógica y el backend pueden mezclarse con decisiones todavía inmaduras.

**Decisión actual:** crear una fase de análisis breve antes de programar. Debe incluir requisitos funcionales, requisitos no funcionales, reglas de negocio y modelo conceptual.

**Estado:** decidido.

## 10. Diferencia Entre Insignias, Trofeos Y Cartas

**Problema:** insignias, trofeos y cartas coleccionables pueden parecer el mismo tipo de logro, pero en La Racha tienen significados distintos.

**Impacto:** si se mezclan en el modelo, será más difícil calcularlos, mostrarlos y ampliarlos.

**Decisión actual:** las insignias serán hitos de racha del grupo. Los trofeos serán reconocimientos personales para membresías, normalmente calculados en el Wrapped del 31 de octubre. Las cartas coleccionables serán piezas diseñadas previamente que un grupo desbloquea según los tipos de planes que registra.

**Estado:** decidido.

## 11. Usuarios Reales Vs Miembros Sin Cuenta En El MVP

**Problema:** para registrar asistencia hace falta representar a las personas del grupo, pero al inicio la app solo la usarán dos personas reales: la creadora del proyecto y su hermano. Apareció la duda de si crear miembros sin cuenta para representar a los amigos, crear usuarios reales para todos desde el principio o empezar con una mezcla.

**Opciones consideradas:**

- Crear solo dos usuarios reales y representar a los amigos como membresías sin cuenta.
- Crear usuarios reales para todos los amigos desde el principio.
- Crear solo dos usuarios reales al principio y usar un grupo de prueba hasta que exista interfaz suficiente para crear usuarios y grupos reales.

**Impacto:** si se crean usuarios reales para todos demasiado pronto, se añade carga de gestión antes de tener la interfaz preparada. Si se usan miembros sin cuenta, puede ser más cómodo al principio, pero se aleja del flujo real que se quiere probar a largo plazo.

**Decisión actual:** el MVP permitirá usuarios reales y miembros sin cuenta. Inicialmente existirán dos usuarios reales: la creadora del proyecto y su hermano. También se podrán crear miembros internos de grupo sin usuario asociado para representar amigos que todavía no acceden a la app. Cuando la interfaz esté lista y esas personas quieran entrar, se podrá vincular su membresía a un usuario real.

**Consecuencia técnica:** en el MVP, `MEMBRESIA.usuario_id` será opcional. Una membresía sin usuario no puede iniciar sesión ni ejercer acciones autenticadas por sí misma. Solo podrá ser gestionada por un administrador del grupo.

**Estado:** decidido.

## 12. Campos Reutilizables Por Grupo

**Problema:** algunos campos de una quedada, como comida, lugar o tipo de plan, se repiten con frecuencia. Si se guardan solo como texto libre, se pierde la oportunidad de reutilizarlos y hacer estadísticas limpias.

**Impacto:** escribir siempre desde cero sería menos cómodo, pero estructurar todos los campos desde el principio puede complicar demasiado el MVP.

**Decisión actual:** crear un catálogo sencillo de opciones por grupo. Cuando el usuario escriba una opción nueva, como `McDonalds`, esa opción quedará guardada para ese grupo y podrá reutilizarse en futuras quedadas. En el MVP se aplicará a `comida`, `lugar` y `tipo_plan`. `objetos_perdidos` queda fuera del catálogo porque representa una persona.

**Consecuencia técnica:** se añadirá una entidad `OPCION_GRUPO` con `grupo_id`, `tipo` y `valor`. Las quedadas podrán referenciar opciones existentes o guardar el texto elegido de forma simple.

**Estado:** decidido.

## 13. Fotos Y Duración En El MVP

**Problema:** las fotos y la duración pueden modelarse de varias formas. Las fotos podrían subirse a almacenamiento real o guardarse como URL. La duración podría ser texto libre, horas o minutos.

**Impacto:** subir archivos desde el principio añade complejidad de storage. Guardar duración como texto dificulta estadísticas futuras.

**Decisión actual:** en el MVP las fotos de quedada se guardarán como URLs simples en `FOTO_QUEDADA`. La duración se guardará como número de minutos, aunque la interfaz podrá mostrarla en horas y minutos.

**Estado:** decidido.

## 14. Asistencia Vs Calendario Compartido

**Problema:** apareció la duda de si `ASISTENCIA.estado` debía incluir `pendiente` para futuros planes o calendario.

**Impacto:** mezclar asistencia a quedadas realizadas con disponibilidad para quedar puede ensuciar el modelo. Una cosa es lo que ocurrió en una quedada y otra cuándo puede quedar cada miembro.

**Decisión actual:** `ASISTENCIA` solo representa hechos de una quedada ya registrada. Sus estados en el MVP serán `asistio` y `no_asistio`. Al registrar una quedada, el formulario solo pedirá marcar quién asistió; el sistema guardará como `asistio` a los marcados y como `no_asistio` a los no marcados.

**Calendario:** el calendario compartido será una funcionalidad futura separada, basada en disponibilidad general. Cada miembro podrá marcar fechas o franjas como `libre` u `ocupado`. La app podrá detectar coincidencias de disponibilidad para facilitar que el grupo quede.

**Estado:** decidido.

## 15. Estado De Membresía

**Problema:** al principio parecía que una persona simplemente forma parte del grupo o no. Sin embargo, pueden existir situaciones temporales, como Erasmus, viajes largos o etapas donde alguien sigue siendo del grupo pero no tiene sentido exigirle presencia.

**Impacto:** si solo existe "dentro" o "fuera", se pierde contexto y se podría castigar injustamente a grupos o personas en el cálculo de asistencias y rachas.

**Decisión actual:** `MEMBRESIA.estado` tendrá valores `activa` y `eliminada`. Las membresías activas aparecen por defecto al registrar asistencias. Las eliminadas conservan histórico, pero ya no aparecen como miembros actuales del grupo.

**Estado:** decidido.

## 16. Objetos Perdidos

**Problema:** el campo "objetos perdidos" podía interpretarse como texto libre para describir el objeto olvidado, pero la intención real del producto es registrar quién se ha dejado algo.

**Impacto:** si se guarda como texto, será más difícil sacar estadísticas futuras tipo "quién se deja más cosas" en el Wrapped.

**Decisión actual:** en el MVP, `objetos_perdidos` se modela como una tabla propia porque varias personas pueden dejarse algo en la misma quedada. Cada registro apunta a una `MEMBRESIA` y puede tener una descripción opcional.

**Estado:** decidido.

## 17. Privacidad Y Contenido Compartible

**Problema:** decir que un grupo es privado puede quedarse corto si en el futuro existe una capa social donde se comparten algunas piezas.

**Impacto:** si la privacidad no se define bien, podría parecer que un grupo entero se vuelve público al compartir contenido, que no es la intención.

**Decisión actual:** la información interna del grupo será privada por defecto. En la versión completa solo se podrán compartir piezas concretas de forma explícita, como insignias, highlights, fotos seleccionadas o Wrapped. Nada se comparte automáticamente.

**Estado:** decidido para la visión completa; el MVP seguirá siendo privado.

## 18. Recuperación De Racha Como Entidad

**Problema:** la recuperación de racha podía calcularse mirando solo el historial de quedadas, pero eso no guardaría de forma clara cuándo se perdió una racha, cuánto había que recuperar, cuánto se recuperó y cuántas veces ocurrió.

**Impacto:** si no se guarda como entidad, sería más difícil mostrar progreso dentro de la app y calcular estadísticas futuras como cuántas veces se ha perdido la racha, cuántas recuperaciones se completaron o cuántos periodos se invirtieron recuperando.

**Decisión actual:** crear una entidad `RECUPERACION_RACHA` dentro del MVP. Guardará el grupo, la racha perdida, los periodos necesarios, los periodos completados, el estado y las fechas principales.

**Estado:** decidido.

## 19. Fotos Múltiples Por Quedada

**Problema:** una única foto por quedada puede quedarse corta para documentar recuerdos reales del grupo.

**Impacto:** si se guarda `foto_url` directamente en `QUEDADA`, ampliar a varias fotos después obliga a rediseñar esa parte del modelo.

**Decisión actual:** crear `FOTO_QUEDADA` en el MVP. Una quedada puede tener varias fotos, cada una con URL y descripción opcional. En el MVP serán URLs simples; más adelante se podrán conectar con Supabase Storage.

**Estado:** decidido.

## 20. Quedadas No Borrables

**Problema:** borrar una quedada rompe histórico y puede afectar a rachas, insignias, recuperaciones y estadísticas.

**Impacto:** si se permite borrar quedadas, se complica mucho mantener coherencia en datos derivados.

**Decisión actual:** en el MVP las quedadas no se borran. Se podrán editar, y esas ediciones deberán recalcular la información derivada que dependa de la quedada. Las operaciones complejas de edición se harán mediante transacciones.

**Estado:** decidido.

## 21. Insignias, Trofeos Y Cartas Como Datos Semilla

**Problema:** insignias, trofeos y cartas son logros diseñados por la creadora del proyecto, no contenido creado libremente por los usuarios.

**Impacto:** si los usuarios pudieran crearlos, se mezclaría catálogo oficial con contenido de grupo y se complicaría mucho la lógica de desbloqueo.

**Decisión actual:** insignias, trofeos y cartas coleccionables serán datos semilla del sistema. Los usuarios no podrán crearlos, editarlos ni borrarlos desde la app; solo se desbloquean o asignan según reglas.

**Detalle MVP:** las insignias semilla podrán usar una imagen por defecto mientras no exista su diseño final. La imagen por defecto está en `docs/recursos/Insignias/Por Defecto.png`.

**Uso en interfaz:** en el MVP, las insignias se mostrarán dentro del salón de la fama de un grupo. El catálogo base indica qué insignias existen; `insignias_desbloqueadas` indica cuáles ha conseguido ese grupo. Las no desbloqueadas podrán aparecer apagadas, sombreadas o en blanco y negro, y las desbloqueadas aparecerán en color.

**Estado:** decidido.

## 22. Borrado De Usuario

**Problema:** un usuario real debe poder borrar su propia cuenta si lo desea, pero sus datos están relacionados con grupos, quedadas, asistencias y estadísticas.

**Impacto:** si borrar un usuario elimina todo su histórico, se romperían recuerdos y estadísticas de grupos compartidos. Además, si ese usuario era el admin único de un grupo, el grupo podría quedarse sin administrador.

**Decisión actual:** un usuario puede borrar su cuenta, pero el histórico de sus grupos no debe desaparecer automáticamente. Las membresías y registros pasados deben conservarse de forma que las quedadas, rachas y estadísticas sigan teniendo sentido. Si el usuario que borra su cuenta es admin de un grupo, antes se traspasa el rol admin al miembro activo más antiguo de ese grupo.

**Detalle técnico:** al borrar una cuenta, sus membresías se conservan, se desvinculan de `usuario_id` y pasan a `estado = eliminada`. Si no existe otro miembro activo al que traspasar el rol admin, el usuario debe borrar el grupo antes o cancelar el borrado de cuenta.

**Estado:** decidido.

## 23. Momento Del Día Como Campo Cerrado

**Problema:** `momento_dia` podía parecer una opción reutilizable por grupo, pero realmente es una categoría común de la app.

**Impacto:** si cada grupo crea sus propios momentos del día, las estadísticas futuras serían más difíciles de comparar.

**Decisión actual:** `momento_dia` será un campo cerrado de la quedada con valores `manana`, `tarde`, `tarde_noche`, `noche` y `dia_completo`. No pertenece a `OPCION_GRUPO`.

**Estado:** decidido.

## 24. Primer Seed Del MVP

**Problema:** antes de construir la app hace falta tener datos reales mínimos para comprobar que la base de datos tiene sentido y que las futuras pantallas no se diseñan sobre tablas vacías.

**Impacto:** si no hay datos de prueba, será más difícil validar listados, permisos, rachas, asistencias, opciones reutilizables e insignias.

**Decisión actual:** crear un primer `seed.sql` con dos usuarios reales, un grupo de prueba llamado `Hermanitos`, tres membresías iniciales, una quedada de prueba, sus asistencias y las insignias base del MVP.

**Detalle:** las membresías iniciales son `Ángela` como admin, `Fran` como miembro real y `Beita` como miembro sin cuenta. Las opciones de grupo no se crean de forma global; solo se insertan las usadas por la primera quedada para respetar la idea de opciones que nacen cuando el grupo las usa.

**Estado:** ejecutado y comprobado en Supabase.

## 25. Seguridad Por Filas Con RLS

**Problema:** la base de datos ya tiene estructura y datos, pero una app privada necesita reglas explícitas para que una persona no pueda leer o modificar datos de grupos ajenos.

**Impacto:** sin políticas RLS, la privacidad dependería demasiado del frontend o del backend. Eso sería peligroso para una app basada en grupos privados.

**Decisión actual:** diseñar una migración específica para políticas RLS. La regla general será privacidad por defecto: un usuario solo podrá ver datos de grupos donde tenga una membresía real activa, y los permisos de escritura serán más restrictivos según la tabla.

**Detalle técnico:** las políticas RLS asumirán que `usuarios.id` coincide con el UUID de Supabase Auth (`auth.uid()`). Los usuarios semilla se alinearán con los usuarios reales creados en Supabase Auth mediante `supabase/migrations/003_align_seed_users_with_auth.sql`.

**Estado:** migración creada, pendiente de ejecutar y validar.

## 26. Salón De La Fama De Grupo Vs Salón Personal

**Problema:** el salón de la fama puede significar dos cosas distintas: una vista de logros y recuerdos de un grupo, o una vista personal de lo conseguido por un usuario en todos sus grupos.

**Impacto:** si no se separan estos conceptos, podrían mezclarse insignias grupales, trofeos personales, cartas coleccionables, highlights y álbumes en una misma pantalla sin criterio claro.

**Decisión actual:** habrá un salón de la fama del grupo y, más adelante, un salón de la fama personal del usuario. En el MVP, el salón de grupo mostrará insignias de racha bloqueadas y desbloqueadas. En el futuro podrá incluir highlights y álbum de fotos del grupo. Los trofeos no aparecerán como logros del grupo porque se adjudican a una membresía/persona.

**Detalle futuro:** el salón personal del usuario podrá reunir insignias, trofeos y cartas relacionadas con sus grupos. Si un usuario consigue la misma insignia en varios grupos, esa insignia se mostrará asociada al primer grupo con el que la consiguió.

**Estado:** decidido como punto de expansión.

## 27. Secciones Futuras Como Próximamente

**Problema:** algunas funcionalidades forman parte de la identidad de La Racha, como calendario, álbum, highlights, trofeos o cartas, pero no conviene implementarlas completas antes del MVP.

**Impacto:** si desaparecen del producto inicial, la app puede sentirse demasiado pequeña o perder dirección. Si se implementan completas demasiado pronto, retrasan el MVP.

**Decisión actual:** dejar accesos visibles a algunas secciones futuras con un estado de "Próximamente". Por ejemplo, si el usuario entra en calendario antes de que exista, verá un mensaje tipo "Próximamente: Calendario".

**Estado:** decidido como estrategia de expansión.
