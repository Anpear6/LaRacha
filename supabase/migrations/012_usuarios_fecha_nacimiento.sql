-- Añade fecha de nacimiento para preparar futuras restricciones de edad
-- y recomendaciones por rango de edad sin guardar una edad que se queda obsoleta.

alter table usuarios
add column if not exists fecha_nacimiento date;

alter table usuarios
drop constraint if exists usuarios_fecha_nacimiento_valida;

alter table usuarios
add constraint usuarios_fecha_nacimiento_valida
check (
  fecha_nacimiento is null
  or (
    fecha_nacimiento >= date '1900-01-01'
    and fecha_nacimiento <= current_date
  )
);
