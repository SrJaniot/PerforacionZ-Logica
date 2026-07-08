// Uncomment these imports to begin using these cool features!

import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {GenericModel, IdEntero, ModelInsertProyecto, ModelUpdateProyecto} from '../models';
import {inject, service} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
import {get, getModelSchemaRef, param, post, requestBody, response} from '@loopback/rest';
import {SQLConfig} from '../config/sql.config';
import {MailService} from '../services';

// import {inject} from '@loopback/core';


export class ProyectoController {
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


    //FUNCION PARA CREAR UN PROYECTO CON LA FUNCION DE POSTGRES FUN_INSERTAR_PROYECTOS_JSON----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  //METODO POST PARA CREAR UNA broca
  @post('/CrearProyecto')
  @response(200, {
    description: 'creacion de un Proyecto ',
    content:{
      'application/json':{
        schema: getModelSchemaRef(ModelInsertProyecto),
      },
    },
  })
  async crearProyecto(
    @requestBody({
      content:{
        'application/json':{
          schema: getModelSchemaRef(ModelInsertProyecto),
        },
      },
    })
    data: ModelInsertProyecto,
  ):Promise<object>{
    try{
      const sql = SQLConfig.CrearProyecto;
      const params =[
        data.id_supervisor,
        data.nom_proyecto,
        data.id_municipio,
        data.descripcion_proyecto,
        data.usuario_insert
      ];
      console.log('SQL a ejecutar:', sql);
      console.log('Parametros:', params);
      const result = await this.genericRepository.dataSource.execute(sql, params);
      console.log('Resultado de la función de PostgreSQL:', result[0]);
      console.log(result[0]);
      //console.log(result[0]);
      //console.log(result[0].fun_insertar_contexto_json);
      //console.log(result[0].fun_insert_torneo.id_torneo);
      //FUN_INSERTAR_PRUEBA_GENERICA_JSON  fun_insertar_prueba_generica_json
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS
      if(result[0].resultado.CODIGO !=200){
        return {
          "CODIGO": result[0].resultado.CODIGO,
          "MENSAJE": result[0].resultado.MENSAJE,
          "DATOS": null
        };
      }
      //console.log('Resultado de la función de PostgreSQL:', result[0]);
      //console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      //enviar correo al supervisor asignado notificando la creación del proyecto
      //obtener datos del supervisor para enviar correo
      const supervisorSql = SQLConfig.ObtenerSupervisorID;
      const supervisorParams = [data.id_supervisor];

      //console.log('sql para obtener supervisor:', supervisorSql);
      //console.log('parametros para obtener supervisor:', supervisorParams);

      const supervisorResult = await this.genericRepository.dataSource.execute(supervisorSql, supervisorParams);
      //console.log('Resultado de la función de PostgreSQL para obtener supervisor:', supervisorResult[0]);

      if(supervisorResult[0].resultado.CODIGO !=200){
        console.log('Error al obtener datos del supervisor para enviar correo');
      }else{
        const supervisorData = supervisorResult[0].resultado.DATOS;
        //enviar correo usando el servicio de mail
        //console.log('Enviando correo al supervisor:', supervisorData.CORREO_SUPERVISOR);
        //console.log('datos nombre supervisor:', supervisorData.NOM_SUPERVISOR);

        await this.mailService.sendAsignacionProyectoEmail(
          supervisorData.CORREO_SUPERVISOR,
          supervisorData.NOM_SUPERVISOR,
          data.nom_proyecto,
          data.descripcion_proyecto
        );
        console.log('Correo enviado al supervisor:', supervisorData.CORREO_SUPERVISOR);
      }

      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": result[0].resultado.ID_BROCA
      };
    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error al insertar datos  del TORNEO en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }




    //FUNCION PARA CREAR UNA Actualizar Proyecto CON LA FUNCION DE POSTGRES ----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  //METODO POST PARA CREAR UNA broca
  @post('/ActualizarProyecto')
  @response(200, {
    description: 'actualizacion de un Proyecto ',
    content:{
      'application/json':{
        schema: getModelSchemaRef(ModelUpdateProyecto),
      },
    },
  })
  async actualizarProyecto(
    @requestBody({
      content:{
        'application/json':{
          schema: getModelSchemaRef(ModelUpdateProyecto),
        },
      },
    })
    data: ModelUpdateProyecto,
  ):Promise<object>{
    try{
      const sql = SQLConfig.ActualizarProyecto;
      const params =[
        data.id_proyecto,
        data.id_supervisor,
        data.nom_proyecto,
        data.id_municipio,
        data.descripcion_proyecto,
        data.usuario_insert,
        data.estado_proyecto,
        data.prioridad_proyecto
      ];
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //console.log(result[0]);
      //console.log(result[0].fun_insertar_contexto_json);
      //console.log(result[0].fun_insert_torneo.id_torneo);
      //FUN_INSERTAR_PRUEBA_GENERICA_JSON  fun_insertar_prueba_generica_json
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS
      if(result[0].resultado.CODIGO !=200){
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
    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error al insertar datos  del TORNEO en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }


     //FUNCION PARA OBTENER UN proyecto POR ID CON LA FUNCION DE POSTGRES FUN_OBTENER_PROYECTO_POR_ID_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerProyectoID/{id_proyecto}')
  @response(200, {
  description: 'Obtener Proyecto por id',
  content:{
    'application/json':{
      schema: getModelSchemaRef(GenericModel),
    },
  },
  })
  async obtenerProyectoID(
    @param.path.number('id_proyecto') id_proyecto: number,
  ):Promise<object>{
    try{
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerProyectoID;
      const params =[
        id_proyecto
      ];
      //console.log(sql);
      //console.log(params);
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //FUN_CONSULTAR_CONTEXTO_ID() fun_consultar_contexto_id()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS


      if(result[0].resultado.CODIGO !=200){
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
    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error POSTGRES",
        "DATOS": error
      };
    }
  }





  //FUNCION PARA OBTENER TODAS LOS SUPERVISORES CON LA FUNCION DE POSTGRES FUN_OBTENER_TODOS_SUPERVISORES_JSON----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.listarAccion]
  })
  @get('/ObtenerProyectos')
  @response(200, {
    description: 'Obtener proyectos',
    content:{
      'application/json':{
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerProyectos():Promise<object>{
    try{
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerProyectos;
      const result = await this.genericRepository.dataSource.execute(sql);
      // FUN_CONSULTAR_BROCAS()  fun_consultar_brocas()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS


      if(result[0].resultado.CODIGO !=200){
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

    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error POSTGRES",
        "DATOS": error
      };
    }
  }



    //FUNCION PARA OBTENER UN proyecto POR ID de supervisor CON LA FUNCION DE POSTGRES FUN_OBTENER_PROYECTO_POR_ID_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerProyectosIDSupervisor/{id_supervisor}')
  @response(200, {
  description: 'Obtener Proyecto por id',
  content:{
    'application/json':{
      schema: getModelSchemaRef(GenericModel),
    },
  },
  })
  async obtenerProyectoIDSupervisor(
    @param.path.string('id_supervisor') id_supervisor: String,
  ):Promise<object>{
    try{
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerProyectosSupervisorID;
      const params =[
        id_supervisor
      ];
      //console.log(sql);
      //console.log(params);
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //FUN_CONSULTAR_CONTEXTO_ID() fun_consultar_contexto_id()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS


      if(result[0].resultado.CODIGO !=200){
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
    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error POSTGRES",
        "DATOS": error
      };
    }
  }



  //funcion para eliminar un proyecto por id usando la funcion de postgres FUN_ELIMINAR_PROYECTO_POR_ID_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.eliminarAccion]
  })
  @post('/EliminarProyecto')
  @response(200, {
    description: 'eliminar un proyecto por id',
    content: {
      'application/json': {
        schema: getModelSchemaRef(IdEntero),
      },
    },
  })
  async EliminarProyecto(
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
      const sql = SQLConfig.EliminarProyecto;
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









  //FUNCION PARA OBTENER TODAS LOS DEPARTAMENOTS CON  FUN_OBTENER_TODOS_DEPARTAMENTOS_JSON----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.listarAccion]
  })
  @get('/ObtenerDepartamentos')
  @response(200, {
    description: 'Obtener departamentos',
    content:{
      'application/json':{
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerDepartamentos():Promise<object>{
    try{
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerDepartamentos;
      const result = await this.genericRepository.dataSource.execute(sql);
      // FUN_CONSULTAR_BROCAS()  fun_consultar_brocas()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS


      if(result[0].resultado.CODIGO !=200){
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

    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error POSTGRES",
        "DATOS": error
      };
    }
  }



    //FUNCION PARA OBTENER MUNICIPIOS A PARTIR DE UN DEPARTAMENTO----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuProyectos, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerMunicipiosIDDepartamento/{id_departamento}')
  @response(200, {
  description: 'Obtener Municipios por id de departamento',
  content:{
    'application/json':{
      schema: getModelSchemaRef(GenericModel),
    },
  },
  })
  async obtenerMunicipiosIDDepartamento(
    @param.path.string('id_departamento') id_departamento: String,
  ):Promise<object>{
    try{
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerMunicipiosIDDepartamento;
      const params =[
        id_departamento
      ];
      //console.log(sql);
      //console.log(params);
      const result = await this.genericRepository.dataSource.execute(sql, params);
      //console.log(result[0]);
      //FUN_CONSULTAR_CONTEXTO_ID() fun_consultar_contexto_id()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS


      if(result[0].resultado.CODIGO !=200){
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
    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error POSTGRES",
        "DATOS": error
      };
    }
  }













}
