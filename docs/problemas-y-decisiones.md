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

**Detalle actualizado:** al romperse una racha, la recuperación queda en estado `pendiente` y la racha se congela. El administrador debe reactivarla desde un mensaje de la app. Mientras la recuperación esté pendiente, en progreso o pausada, no se desbloquean insignias nuevas. Si el grupo falla una recuperación, el intento queda como `fallida` y el siguiente intento empieza desde cero. La tregua de verano puede pausar una recuperación en progreso sin borrar el avance acumulado.

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

## 28. Recuperación Pendiente Hasta Acción Del Administrador

**Problema:** si la recuperación empieza automáticamente al romperse una racha, el grupo podría entrar en un reto de recuperación sin haberlo decidido conscientemente.

**Impacto:** eso puede ser confuso en la interfaz y menos motivador, porque la app tomaría una decisión importante sin preguntar al administrador.

**Decisión actual:** cuando una racha se rompe, se crea una recuperación en estado `pendiente`. La racha queda congelada y las insignias aparecen en gris hasta que el administrador decide reactivar la racha desde un mensaje de la app. Solo entonces la recuperación pasa a `en_progreso`.

**Estado:** decidido e implementado en lógica de dominio.

## 29. Recuperación Fallida Reinicia El Progreso

**Problema:** si un grupo necesitaba 3 periodos para recuperar una racha y cumple 2, aparece la duda de si al fallar conserva parte del avance o debe empezar de cero.

**Impacto:** conservar progreso parcial haría la recuperación más suave, pero también quitaría fuerza a la idea de compensar una racha perdida de forma consecutiva.

**Decisión actual:** si una recuperación falla, el intento queda como `fallida`. El progreso histórico se conserva en ese intento para estadísticas, pero el siguiente intento vuelve a empezar desde 0 y exige completar todos los periodos necesarios.

**Estado:** decidido e implementado en lógica de dominio.

## 30. Tregua De Verano Y Recuperación

**Problema:** una recuperación en progreso puede coincidir con verano, justo cuando muchos grupos se ven menos.

**Impacto:** si la tregua no afecta a recuperaciones, podría castigar la misma situación vital que la tregua intenta suavizar.

**Decisión actual:** la tregua de verano puede pausar una recuperación en progreso. La recuperación pasa a `pausada` y conserva sus periodos completados. Cuando termina la tregua, puede volver a `en_progreso`.

**Estado:** decidido e implementado en lógica de dominio.

## 31. Propiedades Opcionales En TypeScript

**Problema:** con `exactOptionalPropertyTypes`, TypeScript distingue entre una propiedad ausente y una propiedad con valor `undefined`.

**Impacto:** al modelar miembros sin cuenta o recuperaciones sin `fechaFin`, escribir `usuarioId: undefined` o `fechaFin: undefined` provoca errores de tipos aunque los tests de ejecución pasen.

**Decisión actual:** representar los campos opcionales como propiedades ausentes cuando no existen. En tests, se usan helpers específicos para crear membresías sin cuenta. En lógica, no se asigna `fechaFin` hasta que la recuperación termina o falla.

**Estado:** resuelto.

## 32. Desbloqueo De Insignias Por Tiempo Real

**Problema:** las insignias de racha podían interpretarse como número de quedadas, número de periodos o tiempo real. Eso se volvía raro con frecuencias distintas a semanal.

**Impacto:** un grupo mensual no debería desbloquear insignias semanales solo porque su primer periodo cubre más de 7 días. A la vez, la recuperación de racha no debe permitir conseguir insignias nuevas, porque ese tiempo sirve para recuperar lo perdido, no para avanzar.

**Decisión actual:** las insignias se desbloquean por tiempo real de racha, respetando la frecuencia del grupo. Las frecuencias semanales pueden desbloquear hitos semanales, mensuales y anuales. Las frecuencias mensuales empiezan en hitos de 1 mes. La frecuencia anual empieza en 1 año.

**Detalle importante:** mientras exista una recuperación `pendiente`, `en_progreso` o `pausada`, no se desbloquean insignias nuevas. Si una racha de 2 semanas se rompe y se recupera tras otras 2 semanas, el grupo vuelve a tener 2 semanas de racha, pero no consigue la insignia de 1 mes.

**Estado:** decidido e implementado en lógica de dominio.

## 33. Cuándo Se Considera Perdida Una Racha

**Problema:** si la app revisa la racha en mitad de una semana, mes o año, podría pensar que se ha roto aunque el grupo todavía tenga tiempo para quedar.

**Impacto:** romper la racha antes de que termine el periodo sería injusto y confuso. También podría crear recuperaciones innecesarias.

**Decisión actual:** la pérdida de racha solo se detecta cuando termina el periodo que tocaba cumplir. Si el último periodo cerrado no se cumplió y antes había una racha, se crea una pérdida. Si ya existe una recuperación activa, no se crea otra encima.

**Estado:** decidido e implementado en lógica de dominio.

## 34. Función Orquestadora De Estado De Racha

**Problema:** calcular racha, detectar pérdida, crear recuperación pendiente y desbloquear insignias son reglas separadas, pero en la app ocurren juntas después de registrar o editar una quedada.

**Impacto:** si cada pantalla o endpoint intenta unir esas reglas por su cuenta, aumentan los errores y las incoherencias. Por ejemplo, se podría desbloquear una insignia justo cuando la racha está rota o en recuperación.

**Decisión actual:** crear una función de dominio que resuelve el estado completo de la racha de un grupo. La función no escribe en base de datos; solo devuelve qué se debe mostrar y qué acciones derivadas tocaría guardar después: recuperación pendiente o insignias desbloqueables.

**Estado:** implementado en lógica de dominio.

## 35. Ejecución Manual Ahora, Automatización Después

**Problema:** ejecutar SQL a mano desde Supabase es útil para aprender, pero a largo plazo puede ser incómodo y propenso a errores si hay que reconstruir la base de datos o trabajar desde otro ordenador.

**Impacto:** sin automatización, migraciones y datos semilla dependen de recordar qué archivo copiar y en qué orden. Eso complica el flujo profesional del proyecto.

**Decisión actual:** durante el MVP inicial se acepta ejecutar migraciones manualmente desde el SQL Editor para entender cada cambio. A la vez, se deja documentado como punto de expansión preparar Supabase CLI o scripts de npm para aplicar migraciones y seed automáticamente.

**Estado:** documentado como mejora futura.

## 36. Instalación De Dependencias Con Permisos Del Entorno

**Problema:** al instalar paquetes con `npm install`, el entorno local bloqueó la descarga desde el registro de npm con un error `EACCES`.

**Impacto:** no era un error del código del proyecto, sino de permisos/red del entorno donde se ejecuta Codex. Podía parecer que npm o Supabase estaban mal configurados aunque el problema era externo.

**Solución aplicada:** se reintentó la instalación con permiso explícito. Así se instalaron `@supabase/supabase-js` y `@types/node` correctamente.

**Estado:** resuelto.

## 37. Variables De Entorno Para Supabase

**Problema:** la app necesita URL y clave pública de Supabase, pero no conviene guardar claves reales en el repositorio.

**Impacto:** si se sube un archivo `.env` real a GitHub, se podrían exponer credenciales. Aunque la clave anon de Supabase es pública en el frontend, sigue siendo mejor tratar la configuración real como dato de entorno y no mezclarla con documentación o código.

**Decisión actual:** crear `.env.example` como plantilla y mantener `.env`, `.env.local` y variantes fuera de Git mediante `.gitignore`. El cliente base lee `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**Estado:** implementado.

## 38. Traducción Entre Base De Datos Y Dominio

**Problema:** PostgreSQL usa nombres como `grupo_id` y `fecha_creacion`, mientras que el código TypeScript del dominio usa `grupoId` y `fechaCreacion`.

**Impacto:** si cada operación traduce esos nombres a mano, aparecerán errores repetidos y será más difícil mantener el código. Además, la base de datos devuelve `null`, pero en el dominio preferimos omitir propiedades opcionales cuando no existen.

**Decisión actual:** crear mapeadores específicos para convertir filas de Supabase a modelos del dominio. Así la lógica de negocio no necesita conocer detalles de SQL ni nombres `snake_case`.

**Estado:** implementado y cubierto con tests.

## 39. Variables De Entorno Con Valores De Ejemplo

**Problema:** al probar la conexión con Supabase, el script falló con `fetch failed`.

**Causa:** `.env.local` existía y tenía las variables correctas, pero al menos la URL seguía usando el valor de ejemplo `tu-proyecto.supabase.co` en vez de la URL real del proyecto.

**Solución aplicada:** mejorar el script de comprobación para detectar valores de plantilla y mostrar un error más claro antes de intentar conectarse.

**Estado:** resuelto. Tras guardar los valores reales, el script conectó correctamente con Supabase.

## 40. RLS Devuelve Cero Datos Sin Usuario Logueado

**Problema:** la primera comprobación real con Supabase conectó bien, pero devolvió 0 usuarios y 0 grupos visibles.

**Causa:** el script usa la clave `anon` sin sesión de usuario. Como RLS está activo, la base de datos oculta los datos privados cuando no hay usuario autenticado.

**Impacto:** esto confirma que la conexión funciona y que la privacidad por defecto está actuando. Para comprobar que Ángela o Fran ven sus datos, hace falta iniciar sesión con un usuario real.

**Decisión actual:** mantener esta comprobación como prueba básica de conexión anónima y preparar una comprobación autenticada como siguiente paso.

**Estado:** resuelto como comportamiento esperado.

## 41. Comprobación Autenticada Sin Guardar Contraseñas

**Problema:** para validar RLS de verdad hace falta iniciar sesión con un usuario real, pero no se deben guardar contraseñas en archivos del proyecto.

**Impacto:** si una contraseña se escribe en `.env.local`, scripts o documentación, podría acabar expuesta por accidente.

**Decisión actual:** crear un script de comprobación autenticada que pide email y contraseña por terminal en tiempo de ejecución. El script usa Supabase Auth, lee los datos visibles para ese usuario y no guarda la contraseña.

**Estado:** implementado y ejecutado correctamente con usuario real.

## 42. Tipos Manuales De Supabase E Inferencia `never`

**Problema:** al crear la primera operación para leer grupos del usuario actual, TypeScript infirió una consulta de Supabase como `never` en una zona concreta.

**Causa:** los tipos de base de datos actuales están escritos manualmente. Sirven para avanzar, pero no tienen toda la información que generan automáticamente las herramientas oficiales de Supabase.

**Impacto:** la lógica era correcta, pero el compilador no podía inferir bien el tipo de una respuesta. Esto puede repetirse mientras usemos tipos manuales.

**Solución aplicada:** tipar explícitamente las filas de `grupos` en esa operación concreta. Como punto de mejora futuro, conviene generar los tipos oficiales con Supabase CLI cuando automaticemos migraciones.

**Estado:** resuelto.

## 43. Validación Interactiva De Operaciones Autenticadas

**Problema:** para validar las nuevas operaciones de lectura con RLS hay que iniciar sesión desde terminal, y eso requiere que la usuaria escriba email y contraseña.

**Impacto:** Codex no debe conocer ni guardar contraseñas. La comprobación no puede completarse sin intervención humana.

**Decisión actual:** dejar las operaciones implementadas y los tests pasando. La validación interactiva se ejecutará cuando la usuaria esté delante de la terminal y pueda introducir credenciales.

**Estado:** resuelto. La comprobación autenticada se ejecutó correctamente con el usuario de Fran, que pudo ver su membresía en el grupo `Hermanitos`.

## 44. Primeras Operaciones De Lectura Del Backend

**Problema:** la app necesita dejar de hacer consultas sueltas desde scripts y empezar a tener operaciones reutilizables para el backend y el futuro frontend.

**Impacto:** si cada pantalla consulta Supabase a su manera, será más difícil mantener permisos, mapeos y errores consistentes.

**Decisión actual:** crear operaciones de lectura para usuario actual, membresías del usuario, grupos del usuario, miembros activos de un grupo, opciones reutilizables e historial de quedadas con asistencias, fotos y objetos perdidos.

**Estado:** implementado y validado con login real.

## 45. Registrar Quedada Completa Como Transacción

**Problema:** registrar una quedada no es una sola inserción. Puede crear opciones reutilizables, la quedada, asistencias automáticas, fotos y objetos perdidos.

**Impacto:** si una parte se guarda y otra falla, la base de datos puede quedar incoherente. Por ejemplo, podría existir una quedada sin asistencias, o una opción creada sin que se cree la quedada.

**Decisión actual:** crear una función SQL `registrar_quedada_completa_mvp` para que PostgreSQL ejecute todo dentro de una misma transacción. La app llamará esa función mediante RPC desde Supabase.

**Detalle:** la función usa la sesión autenticada y las políticas RLS existentes. Las opciones de `tipo_plan`, `lugar` y `comida` se crean automáticamente si no existían para ese grupo.

**Estado:** migración ejecutada y escritura real validada desde script.

## 46. Tipos Manuales De Supabase Y RPC

**Problema:** al añadir la primera función RPC, el cliente de Supabase no reconocía los argumentos porque nuestros tipos manuales no tenían la misma forma que los tipos generados oficialmente.

**Causa:** faltaban `Relationships` en las tablas y algunas tablas usaban `Update: never`, lo que impedía que el esquema manual encajara completamente con lo que espera `@supabase/supabase-js`.

**Solución aplicada:** completar los tipos manuales con `Relationships: []` y representar tablas no editables con `Update: Record<string, never>`.

**Estado:** resuelto.

## 47. Consulta De Estado De Racha Desde Supabase

**Problema:** la lógica de racha ya existía en TypeScript, pero necesitábamos conectarla con las quedadas reales guardadas en Supabase.

**Impacto:** sin esta operación, el futuro frontend podría mostrar historial de quedadas, pero no tendría una forma clara de calcular racha visible, recuperación activa e insignias desbloqueables usando datos reales.

**Decisión actual:** crear una operación de lectura que cargue grupo, historial de quedadas, catálogo de insignias, insignias ya desbloqueadas y recuperación activa. Con esos datos, la infraestructura llama a la función de dominio `resolverEstadoRachaGrupo`.

**Estado:** implementado. Queda pendiente validarlo con Supabase real mediante el script autenticado.

## 48. Importar Tipos Y Valores En TypeScript

**Problema:** al añadir la operación anterior, `resolverEstadoRachaGrupo` se importó junto con tipos usando `import type`.

**Causa:** `import type` solo sirve para entidades que desaparecen al compilar. `resolverEstadoRachaGrupo` es una función real que se ejecuta en tiempo de ejecución, así que no puede importarse como si fuera solo un tipo.

**Solución aplicada:** separar los imports: los modelos se importan con `import type` y la función `resolverEstadoRachaGrupo` se importa como valor normal.

**Estado:** resuelto.

## 49. Guardar Insignias Desbloqueadas Sin Duplicarlas

**Problema:** la lógica puede detectar que un grupo ha conseguido una o varias insignias, pero guardar ese resultado directamente desde distintas pantallas podría crear duplicados o datos inconsistentes.

**Impacto:** el salón de la fama depende de que una insignia de racha se desbloquee una sola vez por grupo. Si se insertan duplicados, las estadísticas y la vista de logros se vuelven confusas.

**Decisión actual:** crear la función SQL `desbloquear_insignias_racha_mvp`, que recibe los desbloqueos calculados, valida grupo, insignias y membresías, y usa el índice único `grupo_id + insignia_id` para evitar duplicados.

**Detalle:** la operación TypeScript `desbloquearInsigniasRacha` llama a esa RPC. La lógica que decide qué insignias se pueden desbloquear sigue viviendo en el dominio; la base de datos solo valida y guarda.

**Estado:** implementado en código y migración `007` ejecutada en Supabase real.

## 50. Validar Guardado De Insignias Con Confirmación Manual

**Problema:** guardar insignias desbloqueadas cambia datos reales de Supabase, así que no conviene hacerlo automáticamente desde una comprobación genérica.

**Impacto:** un script demasiado automático podría insertar logros mientras solo se estaba intentando leer o depurar el estado de la racha.

**Decisión actual:** crear `npm run check:desbloquear-insignias`, un script separado que inicia sesión, calcula las insignias desbloqueables, muestra lo que va a guardar y exige escribir `SI` antes de llamar a la RPC.

**Estado:** implementado y validado contra Supabase real.

## 51. Scripts Fuera De La Comprobación De Tipos

**Problema:** el script de comprobación de desbloqueo de insignias intentaba mostrar las insignias ya guardadas desde el resultado de racha, pero ese dato no vive ahí.

**Causa:** `tsconfig.json` solo incluía `src/**/*.ts` y `tests/**/*.ts`, así que los scripts de `scripts/**/*.ts` no se revisaban con `npm run typecheck`.

**Impacto:** un error de tipos podía colarse en scripts manuales aunque la comprobación general del proyecto saliera en verde.

**Solución aplicada:** leer las insignias guardadas con `listarInsigniasDesbloqueadasGrupo` y ampliar `tsconfig.json` para incluir también `scripts/**/*.ts`.

**Estado:** resuelto.

## 52. Gestión De Grupos Y Membresías Como Operaciones Cerradas

**Problema:** crear o modificar grupos y membresías toca permisos delicados: quién es admin, quién puede editar miembros sin cuenta, cómo se conserva el histórico y cómo se evita cambiar la frecuencia de racha después de crear el grupo.

**Impacto:** si el frontend hiciera inserciones y updates sueltos, sería fácil saltarse una regla por accidente. Por ejemplo, editar el rol admin, borrar una membresía con histórico o cambiar la frecuencia de racha cuando ya hay partida empezada.

**Decisión actual:** crear funciones RPC específicas para cada operación del MVP: crear grupo, actualizar grupo, eliminar grupo, crear miembro sin cuenta, actualizar membresía propia, actualizar miembro sin cuenta y eliminar membresía.

**Detalle:** eliminar una membresía no borra sus datos históricos; solo cambia `estado` a `eliminada`. La operación de eliminar membresía rechaza borrar la membresía admin.

**Estado:** implementado y validado contra Supabase real.

## 53. Crear Grupo Con RLS Y `RETURNING`

**Problema:** al validar `crear_grupo_mvp` contra Supabase real, la inserción del grupo falló con una violación de RLS en la tabla `grupos`.

**Causa:** la función creaba el grupo con `insert ... returning id`. Para devolver la fila recién creada, PostgreSQL necesitaba aplicar también la política de lectura. Pero en ese momento aún no existía la membresía admin, así que la política `grupos_select_miembro` no dejaba ver el grupo recién insertado.

**Impacto:** el usuario autenticado sí tenía permiso para crear el grupo, pero no podía leerlo durante esa misma operación antes de crear su membresía.

**Solución aplicada:** generar los UUIDs del grupo y de la membresía antes de insertar. Así la función no necesita `returning` en esas inserciones: inserta el grupo, inserta la membresía admin con IDs ya conocidos y devuelve esos IDs al final.

**Estado:** resuelto y validado contra Supabase real tras volver a ejecutar la migración `008`.

## 54. Editar Quedadas Sin Romper Histórico

**Problema:** editar una quedada completa toca varias tablas a la vez: `quedadas`, `opciones_grupo`, `asistencias`, `objetos_perdidos` y `fotos_quedada`.

**Impacto:** si la edición se hiciera con llamadas sueltas desde el frontend, una parte podría guardarse y otra fallar. Eso dejaría una quedada con datos mezclados, por ejemplo fotos nuevas pero asistencias antiguas.

**Decisión actual:** crear la función SQL `editar_quedada_completa_mvp` para ejecutar toda la edición dentro de una sola transacción.

**Detalle:** la función recalcula asistencias y objetos perdidos para membresías activas. Los datos asociados a membresías eliminadas no se borran, porque forman parte del histórico del grupo. Las fotos sí se reemplazan completas, porque en el MVP no tienen histórico propio ni autor.

**Estado:** implementado y validado contra Supabase real.

## 55. Variables SQL Con El Mismo Nombre Que Columnas

**Problema:** al validar la edición de quedadas contra Supabase real, la función falló con `column reference "tipo_plan_opcion_id" is ambiguous`.

**Causa:** dentro de `editar_quedada_completa_mvp` había variables PL/pgSQL llamadas igual que columnas de la tabla `quedadas`. En el `update`, PostgreSQL no podía saber si `tipo_plan_opcion_id` se refería a la columna o a la variable.

**Impacto:** la lógica era correcta, pero la función SQL no podía ejecutarse al editar una quedada.

**Solución aplicada:** renombrar las variables internas con prefijo `v_`: `v_tipo_plan_opcion_id`, `v_lugar_opcion_id` y `v_comida_opcion_id`.

**Estado:** resuelto y validado contra Supabase real tras volver a ejecutar la migración `009`.

## 56. Ciclo De Recuperación De Racha En Base De Datos

**Problema:** la lógica de dominio ya sabía crear, activar, pausar, completar y fallar recuperaciones, pero faltaba una forma segura de guardar esos estados en Supabase.

**Impacto:** sin operaciones cerradas, el frontend tendría que actualizar directamente `recuperaciones_racha`, con riesgo de dejar varios intentos activos, saltarse la activación del admin o no reiniciar correctamente una recuperación fallida.

**Decisión actual:** crear funciones RPC específicas para el ciclo de recuperación del MVP.

**Detalle:** al detectar pérdida se puede guardar una recuperación `pendiente`. Solo el admin puede activarla, pausarla o reanudarla. Si una recuperación falla, se marca como `fallida` y se crea automáticamente un nuevo intento `pendiente` con los mismos periodos necesarios, para respetar la regla de empezar otra vez desde cero.

**Estado:** implementado y validado contra Supabase real.

## 57. Operación Explícita Para Opciones Reutilizables

**Problema:** las opciones reutilizables de comida, lugar y tipo de plan ya se creaban automáticamente al registrar o editar una quedada, pero el frontend también puede necesitar crear una opción desde un control concreto.

**Impacto:** sin una operación propia, la interfaz tendría que depender de registrar una quedada para crear opciones, o duplicar lógica de normalización y reutilización.

**Decisión actual:** exponer la función SQL `obtener_o_crear_opcion_grupo` mediante la operación TypeScript `crearOpcionGrupo`.

**Detalle:** no hace falta una migración nueva porque la función SQL ya existe desde `006_registrar_quedada_completa.sql`. La operación devuelve el ID existente si la opción ya estaba creada, evitando duplicados por diferencias de mayúsculas/minúsculas.

**Estado:** implementado y validado contra Supabase real con `npm run check:opciones-grupo`.
