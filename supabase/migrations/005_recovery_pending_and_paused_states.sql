-- La Racha - estados de recuperacion pendientes y pausados
-- La recuperacion no empieza automaticamente: queda pendiente hasta que el admin la active.
-- La tregua de verano puede pausar una recuperacion sin perder su progreso.

drop index if exists recuperaciones_racha_en_progreso_unique_idx;

alter table recuperaciones_racha
drop constraint if exists recuperaciones_racha_estado_check;

alter table recuperaciones_racha
alter column estado set default 'pendiente';

alter table recuperaciones_racha
add constraint recuperaciones_racha_estado_check check (
  estado in ('pendiente', 'en_progreso', 'pausada', 'completada', 'fallida')
);

create unique index recuperaciones_racha_activa_unique_idx
on recuperaciones_racha (grupo_id)
where estado in ('pendiente', 'en_progreso', 'pausada');
