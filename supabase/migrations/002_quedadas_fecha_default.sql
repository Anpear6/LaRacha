-- La Racha - ajuste de comodidad para el MVP
-- Las quedadas nuevas toman la fecha actual por defecto, aunque la app podra cambiarla.

alter table quedadas
alter column fecha set default now();
