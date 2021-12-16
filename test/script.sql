ALTER TABLE actasdigitales.PROCESOS_ACT MODIFY ente_pro VARCHAR2(50);
ALTER TABLE actasdigitales.tareas_act MODIFY ente_pro VARCHAR2(50);
ALTER TABLE actasdigitales.tareas_act_error MODIFY ente_pro VARCHAR2(50);
ALTER TABLE actasdigitales.tareas_act_hist MODIFY ente_pro VARCHAR2(50);
ALTER TABLE actasdigitales.PROCESOS_ACT_HIST MODIFY ente_pro VARCHAR2(50);

COMMIT;