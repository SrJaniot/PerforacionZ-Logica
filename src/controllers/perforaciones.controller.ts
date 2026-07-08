// Uncomment these imports to begin using these cool features!

import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {GenericModel, IdEntero, InsertMovimientoBroca, ModelInsertPerforacion, ModelUpdatePerforacion} from '../models';
import {inject, service} from '@loopback/core';
import {MailService} from '../services';
import {authenticate} from '@loopback/authentication';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
import {get, getModelSchemaRef, param, post, requestBody, response} from '@loopback/rest';
import {SQLConfig} from '../config/sql.config';

// import {inject} from '@loopback/core';


export class PerforacionesController {
   //Generacion de un repositorio generico para conectarme a la base de datos postgresql
  private genericRepository: DefaultCrudRepository <GenericModel, typeof GenericModel.prototype.id>;


  constructor(
    // inyectar el datasource de postgresql
    @inject('datasources.postgres') dataSource:  juggler.DataSource,
    // inyectar servicio de mail para enviar correos
    @service(MailService)
    public mailService: MailService,
  ) {
    //configuracion del genericRepository para que se conecte a la base de datos postgresql
    this.genericRepository = new DefaultCrudRepository<any,any>(
      GenericModel,
      dataSource
    );
  }


  // funcion para creacion de una perforacion, esta funcion recibe un json con los datos de la perforacion y llama a la funcion de postgres para insertar los datos en la base de datos, esta funcion retorna un json con el codigo, mensaje y datos que retorna la funcion de postgres
   @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.listarAccion]
  })
  //METODO POST PARA CREAR UNA perforacion
  @post('/CrearPerforacion')
  @response(200, {
    description: 'creacion de un Perforacion ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ModelInsertPerforacion),
      },
    },
  })
  async crearPerforacion(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ModelInsertPerforacion),
        },
      },
    })
    data: ModelInsertPerforacion,
  ): Promise<object> {
    try {



      const sql = SQLConfig.CrearPerforacion;
      const params = [
        data.id_proyecto,
        data.Profundidad_actual,
        data.fecha_inicio_perforacion,
        data.usuario,
        data.nombre_perforacion,
        data.profundidad_objetivo


      ];
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //console.log(result[0]);
      //console.log(result[0].fun_insertar_contexto_json);
      //console.log(result[0].fun_insert_torneo.id_torneo);
      //FUN_INSERTAR_PRUEBA_GENERICA_JSON  fun_insertar_prueba_generica_json
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS
      if (result[0].resultado.CODIGO != 200) {
        return {
          "CODIGO": result[0].resultado.CODIGO,
          "MENSAJE": result[0].resultado.MENSAJE,
          "DATOS": null
        };
      }
      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": result[0].resultado.ID_BROCA
      };
    } catch (error) {
      return {
        "CODIGO": 500,
        "MENSAJE": "Error al insertar datos  de la perforacion en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }








  // funcion para creacion de una perforacion, esta funcion recibe un json con los datos de la perforacion y llama a la funcion de postgres para insertar los datos en la base de datos, esta funcion retorna un json con el codigo, mensaje y datos que retorna la funcion de postgres
   @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.listarAccion]
  })
  //METODO POST PARA CREAR UNA perforacion
  @post('/ActualizarPerforacion')
  @response(200, {
    description: 'creacion de un Perforacion ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ModelUpdatePerforacion),
      },
    },
  })
  async actualizarPerforacion(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ModelUpdatePerforacion),
        },
      },
    })
    data: ModelUpdatePerforacion,
  ): Promise<object> {
    try {



      const sql = SQLConfig.ActualizarPerforacion;
      const params = [
        data.id_perforacion,
        data.id_proyecto,
        data.Profundidad_actual,
        data.fecha_inicio_perforacion,
        data.fecha_fin_perforacion,
        data.usuario,
        data.nombre_perforacion,
        data.profundidad_objetivo,
        data.estado_perforacion



      ];
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //console.log(result[0]);
      //console.log(result[0].fun_insertar_contexto_json);
      //console.log(result[0].fun_insert_torneo.id_torneo);
      //FUN_INSERTAR_PRUEBA_GENERICA_JSON  fun_insertar_prueba_generica_json
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS
      if (result[0].resultado.CODIGO != 200) {
        return {
          "CODIGO": result[0].resultado.CODIGO,
          "MENSAJE": result[0].resultado.MENSAJE,
          "DATOS": null
        };
      }
      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": result[0].resultado.ID_BROCA
      };
    } catch (error) {
      return {
        "CODIGO": 500,
        "MENSAJE": "Error al insertar datos  de la perforacion en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }





  //FUNCION PARA ELIMINAR UNA PERFORACION POR ID CON LA FUNCION DE POSTGRES FUN_ELIMINAR_PERFORACION_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.listarAccion]
  })
  @post('/EliminarPerforacion')
  @response(200, {
    description: 'eliminar una perforacion por id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(IdEntero),
      },
    },
  })
  async EliminarPerforacion(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IdEntero),
        },
      },
    })
    id: IdEntero,
  ): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.EliminarPerforacion;
      const params = [
        id.id
      ];
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //console.log(result[0]);
      //console.log(result[0].fun_insertar_contexto_json);
      //console.log(result[0].fun_insert_torneo.id_torneo);
      //FUN_ELIMINAR_PREGUNTA() fun_eliminar_pregunta()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS


      if (result[0].resultado.CODIGO != 200) {
        return {
          "CODIGO": result[0].resultado.CODIGO,
          "MENSAJE": result[0].resultado.MENSAJE,
          "DATOS": null
        };
      }
      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": null
      };
    } catch (error) {
      return {
        "CODIGO": 500,
        "MENSAJE": "ERROR POSTGRES",
        "DATOS": error
      };
    }
  }


  //FUNCION PARA OBTENER UNA PERFORACION POR ID CON LA FUNCION DE POSTGRES FUN_OBTENER_PERFORACION_POR_ID_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerPerforacionID/{id_perforacion}')
  @response(200, {
    description: 'Obtener Perforacion por id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerPerforacionID(
    @param.path.number('id_perforacion') id_perforacion: number,
  ): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.obtenerPerforacionID;
      const params = [
        id_perforacion
      ];
      //console.log(sql);
      //console.log(params);
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //FUN_CONSULTAR_CONTEXTO_ID() fun_consultar_contexto_id()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS


      if (result[0].resultado.CODIGO != 200) {
        return {
          "CODIGO": result[0].resultado.CODIGO,
          "MENSAJE": result[0].resultado.MENSAJE,
          "DATOS": null
        };
      }
      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": result[0].resultado.DATOS
      };
    } catch (error) {
      return {
        "CODIGO": 500,
        "MENSAJE": "Error POSTGRES",
        "DATOS": error
      };
    }
  }



  //FUNCION PARA OBTENER UNA PERFORACION POR PROYECTO ID CON LA FUNCION DE POSTGRES FUN_OBTENER_PERFORACION_POR_ID_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerPerforacionesPorProyectoID/{id_proyecto}')
  @response(200, {
    description: 'Obtener Perforaciones por proyecto',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerPerforacionesPorProyectoID(
    @param.path.number('id_proyecto') id_proyecto: number,
  ): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.obtenerPerforacionesPorProyectoID;
      const params = [
        id_proyecto
      ];
      //console.log(sql);
      //console.log(params);
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //FUN_CONSULTAR_CONTEXTO_ID() fun_consultar_contexto_id()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS


      if (result[0].resultado.CODIGO != 200) {
        return {
          "CODIGO": result[0].resultado.CODIGO,
          "MENSAJE": result[0].resultado.MENSAJE,
          "DATOS": null
        };
      }
      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": result[0].resultado.DATOS
      };
    } catch (error) {
      return {
        "CODIGO": 500,
        "MENSAJE": "Error POSTGRES",
        "DATOS": error
      };
    }
  }



  // funcion para registrar el reporte de movimiento de broca a una perforacion, esta funcion recibe un json con los datos del reporte de movimiento de broca y llama a la funcion de postgres para insertar los datos en la base de datos, esta funcion retorna un json con el codigo, mensaje y datos que retorna la funcion de postgres



  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.listarAccion]
  })
  //METODO POST PARA CREAR UN movimiento de broca a una perforacion
  @post('/RegistrarReporteMovimientoBroca')
  @response(200, {
    description: 'creacion de un movimiento de broca a una perforacion ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(InsertMovimientoBroca),
      },
    },
  })
  async crearMovimientoBroca(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InsertMovimientoBroca),
        },
      },
    })
    data: InsertMovimientoBroca,
  ): Promise<object> {
    try {




      const sql = SQLConfig.RegistrarReporteMovimientoBroca;
      const params = [
        data.id_broca_instanciada,
        data.id_perforacion,
        data.Fecha_movimiento,
        data.tipo_movimiento.toUpperCase(),
        data.profundidad_movimiento,
        data.usuario,
        data.observaciones
      ];
      const result = await this.genericRepository.dataSource.execute(sql, params);
      console.log(result[0]);
      //console.log(result[0]);
      //console.log(result[0].fun_insertar_contexto_json);
      //console.log(result[0].fun_insert_torneo.id_torneo);
      //FUN_INSERTAR_PRUEBA_GENERICA_JSON  fun_insertar_prueba_generica_json
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS
      if (result[0].resultado.CODIGO != 200) {
        return {
          "CODIGO": result[0].resultado.CODIGO,
          "MENSAJE": result[0].resultado.MENSAJE,
          "DATOS": null
        };
      }

      // preparar variables para enviar correo de notificacion de movimiento de broca al admin
      //capturaremos el nombre del proyecto
      const SqlObtenerPerforacion = SQLConfig.obtenerPerforacionID;
      const paramsObtenerPerforacion = [
        data.id_perforacion
      ];
      const resultObtenerPerforacion: any = await this.genericRepository.dataSource.execute(SqlObtenerPerforacion, paramsObtenerPerforacion);
      //validar que el resultado de la consulta sea correcto
      if (resultObtenerPerforacion[0].resultado.CODIGO != 200) {
        console.log("Error al obtener datos de la perforacion para enviar correo de notificacion de movimiento de broca al admin");
      } else {
        const id_proyecto = resultObtenerPerforacion[0].resultado.DATOS.ID_PROYECTO;
        //obtener el nombre del proyecto usando el id del proyecto
        const SqlObtenerProyecto = SQLConfig.ObtenerProyectoID;
        const paramsObtenerProyecto = [
          id_proyecto
        ];
        const resultObtenerProyecto: any = await this.genericRepository.dataSource.execute(SqlObtenerProyecto, paramsObtenerProyecto);
        if (resultObtenerProyecto[0].resultado.CODIGO != 200) {
          console.log("Error al obtener datos del proyecto para enviar correo de notificacion de movimiento de broca al admin");
        } else {
          const nombreProyecto = resultObtenerProyecto[0].resultado.DATOS.NOM_PROYECTO;
          const correoAdmin = ConfiguracionSeguridad.correoAdmin;

          //enviar correo de notificacion de movimiento de broca al admin
          await this.mailService.sendMovimientoBrocaPerforacionEmail(
            correoAdmin!,
            "Administrador",
            nombreProyecto,
            data.id_perforacion,
            data.id_broca_instanciada,
            data.Fecha_movimiento,
            data.tipo_movimiento,
            data.profundidad_movimiento,
            data.usuario,
          );
          console.log("Correo de notificacion de movimiento de broca enviado al admin");

        }

      }









      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": result[0].resultado.ID_BROCA
      };
    } catch (error) {
      return {
        "CODIGO": 500,
        "MENSAJE": "Error al insertar datos  de la perforacion en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }





  //FUNCION PARA OBTENER EL MOVIMIENTO DE BROCAS POR PERFORACION    ----------------------------------------------------------------------------------------------------------
    @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerMovimientoBrocasPorPerforacion/{id_perforacion}')
  @response(200, {
    description: 'Obtener Movimiento de Brocas por Perforacion',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerMovimientoBrocasPorPerforacion(
    @param.path.number('id_perforacion') id_perforacion: number,
  ): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerMovimientoBrocasPorPerforacion;
      const params = [
        id_perforacion
      ];
      //console.log(sql);
      //console.log(params);
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //FUN_CONSULTAR_CONTEXTO_ID() fun_consultar_contexto_id()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS


      if (result[0].resultado.CODIGO != 200) {
        return {
          "CODIGO": result[0].resultado.CODIGO,
          "MENSAJE": result[0].resultado.MENSAJE,
          "DATOS": null
        };
      }
      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": result[0].resultado.DATOS
      };
    } catch (error) {
      return {
        "CODIGO": 500,
        "MENSAJE": "Error POSTGRES",
        "DATOS": error
      };
    }
  }
































}
