export namespace SQLConfig {
  //funciones para el controlador brocas.controller.ts
  export const CrearBroca = 'SELECT FUN_INSERTAR_BROCAS_JSON($1,$2,$3,$4,$5,$6,$7) as resultado';
  export const ActualizarBroca = 'SELECT FUN_ACTUALIZAR_BROCAS_JSON($1,$2,$3,$4,$5,$6,$7,$8) as resultado';
  export const ObtenerBrocaID = 'SELECT FUN_OBTENER_BROCA_POR_ID_JSON($1) as resultado';
  export const ObtenerBrocas = 'SELECT FUN_OBTENER_TODAS_BROCAS_JSON() as resultado';
  export const EliminarBroca = 'SELECT FUN_ELIMINAR_BROCA_POR_ID_JSON($1) as resultado';

  export const CrearBrocaInstanciada = 'SELECT FUN_INSERTAR_BROCAINSTANCIADAS_JSON($1,$2,$3,$4) as resultado';
  export const ActualizarBrocaInstanciada = 'SELECT FUN_ACTUALIZAR_BROCAINSTANCIADAS_JSON($1,$2,$3,$4,$5,$6) as resultado';
  export const ObtenerBrocaInstanciadaID = 'SELECT FUN_OBTENER_BROCAINSTANCIADA_POR_ID_JSON($1) as resultado';
  export const ObtenerBrocasInstanciadas = 'SELECT FUN_OBTENER_TODAS_BROCASINSTANCIADAS_JSON() as resultado';
  export const EliminarBrocaInstanciada = 'SELECT FUN_ELIMINAR_BROCAINSTANCIADA_POR_ID_JSON($1) as resultado';
  export const MarcarBrocaDaniada = 'SELECT FUN_MARCAR_BROCA_DANADA_JSON($1,$2) as resultado';

  export const RegistrarPrestamoBroca = 'SELECT REGISTRAR_PRESTAMO_BROCA($1,$2,$3,$4) as resultado';
  export const DevolverPrestamoBroca = 'SELECT DEVOLVER_PRESTAMO_BROCA($1,$2,$3,$4) as resultado';
  export const ObtenerPrestamosBrocaPorProyecto = 'SELECT OBTENER_PRESTAMOS_BROCA_POR_PROYECTO($1) as resultado';

  export const ObtenerBrocasPrestadasActivos = 'SELECT OBTENER_PRESTAMOS_BROCA_ACTIVOS() as resultado';
  export const ObtenerHistorialPrestamosBrocaPorBrocaInstanciada = 'SELECT OBTENER_HISTORIAL_PRESTAMOS_BROCA_POR_BROCA_INSTANCIADA($1) as resultado';


  //funciones para el controlador supervisores.controller.ts
  export const CrearSupervisor = 'SELECT FUN_INSERTAR_SUPERVISORES_JSON($1,$2,$3,$4,$5) as resultado';
  export const EliminarSupervisor = 'SELECT FUN_ELIMINAR_SUPERVISOR_POR_ID_JSON($1) as resultado';
  export const ActualizarSupervisor = 'SELECT FUN_ACTUALIZAR_SUPERVISORES_JSON($1,$2,$3,$4,$5) as resultado';
  export const ObtenerSupervisorID = 'SELECT FUN_OBTENER_SUPERVISOR_POR_ID_JSON($1) as resultado';
  export const ObtenerSupervisores = 'SELECT FUN_OBTENER_TODOS_SUPERVISORES_JSON() as resultado';



  //funciones para el controlador proyecto.controller.ts
  export const CrearProyecto = 'SELECT FUN_INSERTAR_PROYECTOS_JSON($1,$2,$3,$4,$5) as resultado';
  export const ActualizarProyecto = 'SELECT FUN_ACTUALIZAR_PROYECTOS_JSON($1,$2,$3,$4,$5,$6,$7,$8) as resultado';
  export const ObtenerProyectoID = 'SELECT FUN_OBTENER_PROYECTO_POR_ID_JSON($1) as resultado';
  export const ObtenerProyectos = 'SELECT FUN_OBTENER_TODOS_PROYECTOS_JSON() as resultado';
  export const ObtenerProyectosSupervisorID = 'SELECT FUN_OBTENER_PROYECTOS_POR_SUPERVISOR_JSON($1) as resultado';
  export const EliminarProyecto = 'SELECT FUN_ELIMINAR_PROYECTO_POR_ID_JSON($1) as resultado';
  export const FinalizarProyecto = 'SELECT FUN_FINALIZAR_PROYECTO_POR_ID_JSON($1,$2) as resultado';

  export const ObtenerDepartamentos = 'SELECT FUN_OBTENER_TODOS_DEPARTAMENTOS_JSON() as resultado';
  export const ObtenerMunicipiosIDDepartamento = 'SELECT FUN_OBTENER_MUNICIPIOS_POR_DEPARTAMENTO_JSON($1) as resultado';


  //funciones para el controlador perforaciones.controller.ts
  export const CrearPerforacion = 'SELECT FUN_INSERTAR_PERFORACIONES_JSON($1,$2,$3,$4,$5,$6) as resultado';
  export const EliminarPerforacion = 'SELECT FUN_ELIMINAR_PERFORACION_JSON($1) as resultado';
  export const obtenerPerforacionID = 'SELECT FUN_OBTENER_PERFORACION_POR_ID_JSON($1) as resultado';
  export const obtenerPerforacionesPorProyectoID = 'SELECT FUN_OBTENER_PERFORACIONES_POR_PROYECTO_JSON($1) as resultado';
  export const ActualizarPerforacion = 'SELECT FUN_ACTUALIZAR_PERFORACIONES_JSON($1,$2,$3,$4,$5,$6,$7,$8,$9) as resultado';

  export const RegistrarReporteMovimientoBroca = 'SELECT FUN_INSERTAR_MOVIMIENTO_DE_BROCA_JSON($1,$2,$3,$4,$5,$6,$7) as resultado';
  export const ObtenerMovimientoBrocasPorPerforacion = 'SELECT FUN_OBTENER_MOVIMIENTOS_DE_BROCA_POR_ID_PERFORACION_JSON($1) as resultado';
}
