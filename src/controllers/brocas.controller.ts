// Uncomment these imports to begin using these cool features!

import {authenticate} from "@loopback/authentication";
import {inject, service} from "@loopback/core";
import {DefaultCrudRepository, juggler} from "@loopback/repository";
import {get, getModelSchemaRef, param, post, requestBody, response} from "@loopback/rest";
import {ConfiguracionSeguridad} from "../config/configuracion.seguridad";
import {SQLConfig} from "../config/sql.config";
import {GenericModel, IdEntero, IdString, InsertPrestamoBroca, ModelDevolverBroca, ModelInsertBroca, ModelInsertBrocaInstanciada, ModelMarcarBrocaDaniada, ModelUpdateBroca, ModelUpdateBrocaInstanciada} from "../models";

// libreria para manejar fechas en zonas horarias especificas npm install date-fns-tz date-fns
import {formatInTimeZone} from 'date-fns-tz';
import {MailService} from '../services';


// import {inject} from '@loopback/core';


export class BrocasController {
  //Generacion de un repositorio generico para conectarme a la base de datos postgresql
  private genericRepository: DefaultCrudRepository<GenericModel, typeof GenericModel.prototype.id>;


  constructor(
    // inyectar el datasource de postgresql
    @inject('datasources.postgres') dataSource: juggler.DataSource,
    // inyectar servicio de mail para enviar correos
    @service(MailService)
    public mailService: MailService,
  ) {
    //configuracion del genericRepository para que se conecte a la base de datos postgresql
    this.genericRepository = new DefaultCrudRepository<any, any>(
      GenericModel,
      dataSource
    );
  }


  //FUNCION PARA CREAR UNA BROCA CON LA FUNCION DE POSTGRES FUN_INSERTAR_BROCAS_JSON----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.guardarAccion]
  })
  //METODO POST PARA CREAR UNA broca
  @post('/CrearBroca')
  @response(200, {
    description: 'creacion de un Broca ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ModelInsertBroca),
      },
    },
  })
  async crearBoca(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ModelInsertBroca),
        },
      },
    })
    data: ModelInsertBroca,
  ): Promise<object> {
    try {
      const sql = SQLConfig.CrearBroca;
      const params = [
        data.nom_broca,
        data.tipo_broca,
        data.descripcion_broca,
        data.tamanop_broca,
        data.matrix_broca,
        data.marca_broca,
        data.usuario_creacion
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
        "MENSAJE": "Error al insertar datos  del TORNEO en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }

  //FUNCION PARA ACTUALIZAR UNA BROCA CON LA FUNCION DE POSTGRES FUN_ACTUALIZAR_BROCAS_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.editarAccion]
  })
  //METODO POST PARA CREAR UNA broca
  @post('/ActualizarBroca')
  @response(200, {
    description: 'actualizacion de un Broca ',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ModelUpdateBroca),
      },
    },
  })
  async actualizarBroca(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ModelUpdateBroca),
        },
      },
    })
    data: ModelUpdateBroca,
  ): Promise<object> {
    try {
      const sql = SQLConfig.ActualizarBroca;
      const params = [
        data.id_broca,
        data.nom_broca,
        data.tipo_broca,
        data.descripcion_broca,
        data.tamanop_broca,
        data.matrix_broca,
        data.marca_broca,
        data.usuario_creacion
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
        "DATOS": null
      };
    } catch (error) {
      return {
        "CODIGO": 500,
        "MENSAJE": "Error al insertar datos  del TORNEO en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }

  //FUNCION PARA OBTENER UNA BROCA POR ID CON LA FUNCION DE POSTGRES FUN_OBTENER_BROCA_POR_ID_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerBrocaID/{id_broca}')
  @response(200, {
    description: 'Obtener Broca por id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerBROCAID(
    @param.path.number('id_broca') id_broca: number,
  ): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerBrocaID;
      const params = [
        id_broca
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

  //FUNCION PARA OBTENER TODAS LAS BROCAS CON LA FUNCION DE POSTGRES FUN_OBTENER_TODAS_BROCAS_JSON----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.listarAccion]
  })
  @get('/ObtenerBrocas')
  @response(200, {
    description: 'Obtener brocas',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerBrocas(): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerBrocas;
      const result = await this.genericRepository.dataSource.execute(sql);
      // FUN_CONSULTAR_BROCAS()  fun_consultar_brocas()
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


  //FUNCION PARA ELIMINAR UNA BROCA POR ID CON LA FUNCION DE POSTGRES FUN_ELIMINAR_BROCA_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.eliminarAccion]
  })
  @post('/EliminarBroca')
  @response(200, {
    description: 'eliminar una broca por id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(IdEntero),
      },
    },
  })
  async EliminarBroca(
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
      const sql = SQLConfig.EliminarBroca;
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


  //----------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------
  // AQUI COMIENZAN LAS FUNCIONES PARA LA TABLA BROCASINSTANCIADAS
  //----------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------

  //FUNCION PARA CREAR UNA BROCA INSTANCIADA CON LA FUNCION DE POSTGRES FUN_INSERTAR_BROCAINSTANCIADAS_JSON----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.guardarAccion]
  })
  //METODO POST PARA CREAR UNA broca INSTANCIADA
  @post('/CrearBrocaInstanciada')
  @response(200, {
    description: 'creacion de un Broca Instanciada',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ModelInsertBrocaInstanciada),
      },
    },
  })
  async crearBocainstanciada(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ModelInsertBrocaInstanciada),
        },
      },
    })
    data: ModelInsertBrocaInstanciada,
  ): Promise<object> {
    try {
      //tomamos la fecha actual para enviarla a la funcion de postgres bogotá Colombia GMT-5
      // Hora actual en Colombia (GMT-5)
      const timeZone = 'America/Bogota';
      const fechaActual = formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ss.SSS');

      const sql = SQLConfig.CrearBrocaInstanciada;
      const params = [
        data.id_broca_instanciada,
        data.id_broca,
        fechaActual,
        data.usuario_creacion,
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
        "MENSAJE": "Error al insertar datos  del TORNEO en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }

  // FUNCION PARA ACTUALIZAR UNA BROCA INSTANCIADA CON LA FUNCION DE POSTGRES FUN_ACTUALIZAR_BROCAS_JSON----------------------------------------------------------------------------------------------------------


  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.editarAccion]
  })
  //METODO POST PARA CREAR UNA broca instanciada
  @post('/ActualizarBrocaInstanciada')
  @response(200, {
    description: 'actualizacion de un Broca Instanciada',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ModelUpdateBrocaInstanciada),
      },
    },
  })
  async actualizarBrocaInstanciada(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ModelUpdateBrocaInstanciada),
        },
      },
    })
    data: ModelUpdateBrocaInstanciada,
  ): Promise<object> {
    try {
      //tomamos la fecha actual para enviarla a la funcion de postgres bogotá Colombia GMT-5
      // Hora actual en Colombia (GMT-5)
      const timeZone = 'America/Bogota';
      const fechaActual = formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ss.SSS');

      const sql = SQLConfig.ActualizarBrocaInstanciada;
      const params = [
        data.id_brocaInstanciada,
        data.id_broca,
        data.estado_broca,
        data.estado_disponibilidad_broca,
        fechaActual,
        data.usuario_modificacion
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
        "DATOS": null
      };
    } catch (error) {
      return {
        "CODIGO": 500,
        "MENSAJE": "Error al insertar datos  del TORNEO en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }

  // FUNCION PARA OBTENER UNA BROCA INSTANCIADA POR ID CON LA FUNCION DE POSTGRES FUN_OBTENER_BROCAINSTANCIADA_POR_ID_JSON----------------------------------------------------------------------------------------------------------


  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerBrocaInstanciadaID/{id_brocaInstanciada}')
  @response(200, {
    description: 'Obtener Broca Instanciada por id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerBrocaInstanciadaID(
    @param.path.string('id_brocaInstanciada') id_brocaInstanciada: String,
  ): Promise<object> {
    try {

      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES




      const sql = SQLConfig.ObtenerBrocaInstanciadaID;
      const params = [
        id_brocaInstanciada
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

  // FUNCION PARA OBTENER TODAS LAS BROCAS INSTANCIADAS CON LA FUNCION DE POSTGRES FUN_OBTENER_TODAS_BROCASINSTANCIADAS_JSON----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.listarAccion]
  })
  @get('/ObtenerBrocasInstanciadas')
  @response(200, {
    description: 'Obtener brocas instanciadas',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerBrocasInstanciadas(): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerBrocasInstanciadas;
      const result = await this.genericRepository.dataSource.execute(sql);
      // FUN_CONSULTAR_BROCAS()  fun_consultar_brocas()
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

  //ELIMINACION DE BROCA INSTANCIADA SOLO SE PODRA ELIMINAR LAS BROCAS NO VINCULADAS A PROYECTOS


  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.eliminarAccion]
  })
  @post('/EliminarBrocaInstanciada')
  @response(200, {
    description: 'eliminar una broca instanciada por id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(IdString),
      },
    },
  })
  async EliminarBrocaInstanciada(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IdString),
        },
      },
    })
    id: IdString,
  ): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.EliminarBrocaInstanciada;
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


  //MARCAR BROCA COMO DAÑADA
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.eliminarAccion]
  })
  @post('/MarcarBrocaDaniada')
  @response(200, {
    description: 'marcar una broca instanciada como dañada por id y usuario que realiza la acción',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ModelMarcarBrocaDaniada),
      },
    },
  })
  async MarcarBrocaDaniada(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ModelMarcarBrocaDaniada),
        },
      },
    })
    data: ModelMarcarBrocaDaniada,
  ): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.MarcarBrocaDaniada;
      const params = [
        data.id_broca,
        data.usuario
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



  //----------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------
  // AQUI VAN LAS FUNCIONES PARA EL TRAMITE DE PRESTAMO DE BROCAS
  //----------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------


  // REGISTRAR PRESTAMO DE BROCA INSTANCIADA CON LA FUNCION DE POSTGRES REGISTRAR_PRESTAMO_BROCA----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/RegistrarPrestamoBroca')
  @response(200, {
    description: 'registrar un préstamo de broca instanciada',
    content: {
      'application/json': {
        schema: getModelSchemaRef(InsertPrestamoBroca),
      },
    },
  })
  async RegistrarPrestamoBroca(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InsertPrestamoBroca),
        },
      },
    })
    data: InsertPrestamoBroca,
  ): Promise<object> {
    try {

      // tomamos la fecha actual para enviarla a la funcion de postgres bogotá Colombia GMT-5
      const timeZone = 'America/Bogota';
      const fechaActual = formatInTimeZone(
        new Date(),
        timeZone,
        'yyyy-MM-dd HH:mm:ss.SSS'
      );

      const sql = SQLConfig.RegistrarPrestamoBroca;

      const params = [
        data.id_broca_instanciada,
        data.id_proyecto,
        fechaActual,
        data.nom_usuario
      ];

      const result = await this.genericRepository.dataSource.execute(sql, params);

      if (result[0].resultado.CODIGO != 200) {
        return {
          "CODIGO": result[0].resultado.CODIGO,
          "MENSAJE": result[0].resultado.MENSAJE,
          "DATOS": null
        };
      }

      // enviar correo al supervisor asignado notificando el préstamo
      //aca comienza la captura de datos para el envio de correo al supervisor del proyecto al que se le asigno la broca prestada
      const proyectoSql = SQLConfig.ObtenerProyectoID;
      const proyectoParams = [data.id_proyecto];

      const proyectoResult = await this.genericRepository.dataSource.execute(
        proyectoSql,
        proyectoParams
      );

      if (proyectoResult[0].resultado.CODIGO != 200) {
        console.log('Error al obtener datos del proyecto para enviar correo');
      } else {

        const proyectoData = proyectoResult[0].resultado.DATOS;

        const nom_supervisor = proyectoData.NOM_SUPERVISOR;
        const id_supervisor = proyectoData.ID_SUPERVISOR;
        const nom_proyecto = proyectoData.NOM_PROYECTO;

        const supervisorSql = SQLConfig.ObtenerSupervisorID;
        const supervisorParams = [id_supervisor];

        const supervisorResult = await this.genericRepository.dataSource.execute(
          supervisorSql,
          supervisorParams
        );

        if (supervisorResult[0].resultado.CODIGO != 200) {
          console.log('Error al obtener datos del supervisor para enviar correo');
        } else {

          const supervisorData = supervisorResult[0].resultado.DATOS;
          const correoSupervisor = supervisorData.CORREO_SUPERVISOR;

          // obtenemos la broca instanciada
          const brocainstanciadaSql = SQLConfig.ObtenerBrocaInstanciadaID;
          const brocainstanciadaParams = [data.id_broca_instanciada];

          const brocainstanciadaResult =
            await this.genericRepository.dataSource.execute(
              brocainstanciadaSql,
              brocainstanciadaParams
            );

          if (brocainstanciadaResult[0].resultado.CODIGO != 200) {
            console.log('Error al obtener datos de la broca para enviar correo');
          } else {

            const brocainstanciadaData =
              brocainstanciadaResult[0].resultado.DATOS;

            const idbroca = brocainstanciadaData.ID_BROCA;

            // obtener nombre de la broca
            const sqlBroca = SQLConfig.ObtenerBrocaID;
            const paramsBroca = [idbroca];

            const brocaResult = await this.genericRepository.dataSource.execute(
              sqlBroca,
              paramsBroca
            );

            if (brocaResult[0].resultado.CODIGO != 200) {
              console.log('Error al obtener datos de la broca para enviar correo');
            } else {

              const brocaData = brocaResult[0].resultado.DATOS;
              const nombreBroca = brocaData.NOM_BROCA;

              await this.mailService.sendAsignacionBrocaProyectoEmail(
                correoSupervisor,
                nom_supervisor,
                nom_proyecto,
                data.id_broca_instanciada,
                nombreBroca
              );

              console.log(
                'Correo enviado al supervisor:',
                correoSupervisor
              );
            }
          }
        }
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


  // FUNCION PARA DEVOLVER UNA BROCA PRESTADA CON LA FUNCION DE POSTGRES DEVOLVER_PRESTAMO_BROCA----------------------------------------------------------------------------------------------------------


  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/DevolverPrestamoBroca')
  @response(200, {
    description: 'devolver un préstamo de broca instanciada',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ModelDevolverBroca),
      },
    },
  })
  async DevolverPrestamoBroca(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ModelDevolverBroca),
        },
      },
    })
    data: ModelDevolverBroca,
  ): Promise<object> {
    try {

      // tomamos la fecha actual para enviarla a la funcion de postgres bogotá Colombia GMT-5
      const timeZone = 'America/Bogota';
      const fechaActual = formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd HH:mm:ss.SSS');
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.DevolverPrestamoBroca;
      const params = [
        data.id_prestamo,
        data.id_broca_instanciada,
        fechaActual,
        data.nom_usuario

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


      // enviar correo al administrador de brocas notificando la devolución
      // aca comienza la captura de datos para el envio de correo al administrador de brocas
      const correoAdmin = ConfiguracionSeguridad.correoAdmin;

      await this.mailService.sendDevolucionBrocaEmail(correoAdmin!,"Administrado", data.nom_usuario, data.id_broca_instanciada);

      console.log('Correo enviado al administrador:', correoAdmin);




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


  //FUNCION PARA OBTENER LAS BROCAS PRESTADAS POR PROYECTO CON LA FUNCION DE POSTGRES OBTENER_PRESTAMOS_BROCA_POR_PROYECTO    ----------------------------------------------------------------------------------------------------------
    @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerBrocasPorProyecto/{id_proyecto}')
  @response(200, {
    description: 'Obtener Brocas por Proyecto',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerBrocasPorProyecto(
    @param.path.number('id_proyecto') id_proyecto: number,
  ): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerPrestamosBrocaPorProyecto;
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







  // FUNCION PARA OBTENER TODAS LAS BROCAS PRESTADAS ACTUALMENTE CON OBTENER_PRESTAMOS_BROCA_ACTIVOS() ---------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.listarAccion]
  })
  @get('/ObtenerBrocasPrestadasActivos')
  @response(200, {
    description: 'Obtener brocas prestadas actualmente',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerBrocasPrestadas(): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerBrocasPrestadasActivos;
      const result = await this.genericRepository.dataSource.execute(sql);
      // FUN_CONSULTAR_BROCAS()  fun_consultar_brocas()
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






  //FUNCION PARA OBTENER EL HISTORIAL DE PRESTAMOS DE UNA BROCA OBTENER_HISTORIAL_PRESTAMOS_BROCA_POR_BROCA_INSTANCIADA    ----------------------------------------------------------------------------------------------------------
    @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuBrocas, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER EL HISTORIAL DE PRESTAMOS DE UNA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerHistorialPrestamosBroca/{id_broca_instanciada}')
  @response(200, {
    description: 'Obtener Brocas por Proyecto',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerHistorialPrestamosBroca(
    @param.path.string('id_broca_instanciada') id_broca_instanciada: string,
  ): Promise<object> {
    try {
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerHistorialPrestamosBrocaPorBrocaInstanciada;
      const params = [
        id_broca_instanciada
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
