// Uncomment these imports to begin using these cool features!

import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {GenericModel, ModelInsertSupervisor, ModelUpdateSupervisor, UsuarioInsertActivacion} from '../models';
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
import {get, getModelSchemaRef, param, post, requestBody, response} from '@loopback/rest';
import {SQLConfig} from '../config/sql.config';
import {CrearUsuariosApiSeguridadService} from '../services';
// importe esto para poder enviar el token al otro microservicio de seguridad que el enpoint pide token
import {Request, RestBindings} from '@loopback/rest';


// import {inject} from '@loopback/core';

// AGREGAMOS EL PAQUETE NODE FETCH EN SU VERCION 2  npm i node-fetch@2.7.0 ESTO PARA HACER PETICIONES HTTP ES DECIR PODER CONECTARSE CON
// EL OTRO MICROSERVICIO DE SEGURIDAD
const fetch = require('node-fetch');



export class SupervisoresController {
  //Generacion de un repositorio generico para conectarme a la base de datos postgresql
  private genericRepository: DefaultCrudRepository <GenericModel, typeof GenericModel.prototype.id>;


  constructor(
    // inyectar el datasource de postgresql
    @inject('datasources.postgres') dataSource:  juggler.DataSource,
    // inyectar request para obtener el token y enviarlo al microservicio de seguridad
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    //inyectar el servicio para crear usuarios en el microservicio de seguridad
    @inject('services.CrearUsuariosApiSeguridadService')
    private crearUsuariosApiSeguridadService: CrearUsuariosApiSeguridadService,

  ) {
    //configuracion del genericRepository para que se conecte a la base de datos postgresql
    this.genericRepository = new DefaultCrudRepository<any,any>(
      GenericModel,
      dataSource
    );
  }

  //Funcion para crear un nuevo supervisor

  //FUNCION PARA CREAR UNA BROCA CON LA FUNCION DE POSTGRES FUN_INSERTAR_BROCAS_JSON----------------------------------------------------------------------------------------------------------

  /**
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  */
  //METODO POST PARA CREAR UNA broca

   @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/CrearSupervisor')
  @response(200, {
    description: 'creacion de un Supervisor ',
    content:{
      'application/json':{
        schema: getModelSchemaRef(ModelInsertSupervisor),
      },
    },
  })
  async crearSupervisor(
    @requestBody({
      content:{
        'application/json':{
          schema: getModelSchemaRef(ModelInsertSupervisor),
        },
      },
    })
    data: ModelInsertSupervisor,
  ):Promise<object>{
    try{
      const sql = SQLConfig.CrearSupervisor;
      const params =[
        data.id_supervisor,
        data.nom_supervisor,
        data.correo_supervisor,
        data.num_cel_supervisor,
        data.ususario_creacion,
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
      //si es correcto entonces vamos a crear el usuario en el microservicio de seguridad con la funcion crearUsuario del servicio CrearUsuariosApiSeguridadService y le vamos a enviar el token que trae la request para que el microservicio de seguridad valide el token y permita crear el usuario
      const token = this.request.headers.authorization;
      console.log(token);
      const datosUsuarioSeguridad = new UsuarioInsertActivacion({
      id_usuario: data.id_supervisor,
      nombre: data.nom_supervisor,
      correo: data.correo_supervisor,
      celular: data.num_cel_supervisor,
      clave: "12345678",
      cuenta_activa: true,
      });
      const respuestaSeguridad = await this.crearUsuariosApiSeguridadService.crearUsuario(datosUsuarioSeguridad, token!);
      console.log(respuestaSeguridad);

      if(respuestaSeguridad.CODIGO != 200){
        //eliminar el supervisor que se creo en la base de datos postgresql por que no se pudo crear el usuario en el microservicio de seguridad
        const sqlEliminar = SQLConfig.EliminarSupervisor;
        const paramsEliminar = [data.id_supervisor];
        await this.genericRepository.dataSource.execute(sqlEliminar, paramsEliminar);
        return {
          "CODIGO": respuestaSeguridad.CODIGO,
          "MENSAJE": "Error al crear el usuario en el microservicio de seguridad, se elimino el supervisor creado en la base de datos postgresql",
          "DATOS": respuestaSeguridad.MENSAJE
        };


      }


      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": result[0].resultado.ID_SUPERVISOR
      };
    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error al insertar datos  del usuario en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }



  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/ActualizarSupervisor')
  @response(200, {
    description: 'Actualizacion de un Supervisor ',
    content:{
      'application/json':{
        schema: getModelSchemaRef(ModelUpdateSupervisor),
      },
    },
  })
  async actualizarSupervisor(
    @requestBody({
      content:{
        'application/json':{
          schema: getModelSchemaRef(ModelUpdateSupervisor),
        },
      },
    })
    data: ModelUpdateSupervisor,
  ):Promise<object>{
    try{
      const sql = SQLConfig.ActualizarSupervisor;
      const params =[
        data.id_supervisor,
        data.nom_supervisor,
        data.correo_supervisor,
        data.num_cel_supervisor,
        data.ususario_creacion,
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
      //si es correcto entonces vamos a crear el usuario en el microservicio de seguridad con la funcion crearUsuario del servicio CrearUsuariosApiSeguridadService y le vamos a enviar el token que trae la request para que el microservicio de seguridad valide el token y permita crear el usuario
      const token = this.request.headers.authorization;
      console.log(token);
      const datosUsuarioSeguridad = new UsuarioInsertActivacion({
      id_usuario: data.id_supervisor,
      nombre: data.nom_supervisor,
      correo: data.correo_supervisor,
      celular: data.num_cel_supervisor,
      clave: "12345678",
      cuenta_activa: data.cuenta_activa,
      });
      const respuestaSeguridad = await this.crearUsuariosApiSeguridadService.UpdateUsuario(datosUsuarioSeguridad, token!);
      console.log(respuestaSeguridad);

      if(respuestaSeguridad.CODIGO != 200){
        //eliminar el supervisor que se creo en la base de datos postgresql por que no se pudo crear el usuario en el microservicio de seguridad

        return {
          "CODIGO": respuestaSeguridad.CODIGO,
          "MENSAJE": "Error al Actualizar el usuario en el microservicio de seguridad, se actualizo el supervisor en la base de datos postgresql pero no se pudo actualizar el usuario en el microservicio de seguridad",
          "DATOS": respuestaSeguridad.MENSAJE
        };


      }


      return {
        "CODIGO": result[0].resultado.CODIGO,
        "MENSAJE": result[0].resultado.MENSAJE,
        "DATOS": result[0].resultado.ID_SUPERVISOR
      };
    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error al insertar datos  del usuario en la funcion de postgres ERROR POSTGRES",
        "DATOS": error
      };
    }
  }



   //FUNCION PARA OBTENER UNA SUPERVISOR POR ID CON LA FUNCION DE POSTGRES FUN_OBTENER_SUPERVISOR_POR_ID_JSON----------------------------------------------------------------------------------------------------------

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.MenuSupervisor, ConfiguracionSeguridad.buscarAccion_id]
  })
  //METODO GET PARA OBTENER DATOS DE LA TABLA BROCA USANDO EL REPOSITORIO GENERICO PEDIR PARAMETRO ID_BROCA
  @get('/ObtenerSupervisorID/{id_supervisor}')
  @response(200, {
  description: 'Obtener Supervisor por id',
  content:{
    'application/json':{
      schema: getModelSchemaRef(GenericModel),
    },
  },
  })
  async obtenerSupervisorID(
    @param.path.string('id_supervisor') id_supervisor: String,
  ):Promise<object>{
    try{
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerSupervisorID;
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




  //FUNCION PARA OBTENER TODAS LOS SUPERVISORES CON LA FUNCION DE POSTGRES FUN_OBTENER_TODOS_SUPERVISORES_JSON----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.listarAccion]
  })
  @get('/ObtenerSupervisores')
  @response(200, {
    description: 'Obtener supervisores',
    content:{
      'application/json':{
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerSupervisores():Promise<object>{
    try{
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      const sql = SQLConfig.ObtenerSupervisores;
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




   //FUNCION PARA OBTENER TODAS LOS USUARIOS DE LA API DE SEGURIDAD----------------------------------------------------------------------------------------------------------
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.listarAccion]
  })
  @get('/ObtenerUsuariosSeguridad')
  @response(200, {
    description: 'Obtener usuarios de la api de seguridad',
    content:{
      'application/json':{
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerUsuariosSeguridad():Promise<object>{
    try{
      //const sql =SQLConfig.crearContexto;
      // EN ESTE CASO ESTA FUNCION RETORNA UN JSON DESDE POSTGRES
      //const sql = SQLConfig.ObtenerSupervisores;
      //const result = await this.genericRepository.dataSource.execute(sql);
      // FUN_CONSULTAR_BROCAS()  fun_consultar_brocas()
      // gracias a que descubri que si le pongo al final del llamado select ej: SELECT FUN_INSERTAR_PRUEBA_GENERICA_JSON($1,$2,$3) as resultado; ese "as resultado"  puedo acceder a resultado con result[0].resultado y ahi tengo el CODIGO, MENSAJE Y DATOS que es lo que retorna la funcion de postgres
      //ahora se llama result[0].resultado.CODIGO, result[0].resultado.MENSAJE, result[0].resultado.DATOS

      //llamamos al servicio CrearUsuariosApiSeguridadService para obtener los usuarios de la api de seguridad y le enviamos el token que trae la request para que el microservicio de seguridad valide el token y permita obtener los usuarios
      const token = this.request.headers.authorization;
      console.log(token);
      const result = await this.crearUsuariosApiSeguridadService.ObtenerUsuarios(token!);
      console.log(result);

      if(!result){
        return {
          "CODIGO": 500,
          "MENSAJE": "Error al obtener los usuarios de la api de seguridad",
          "DATOS": null
        };
      }
      return {
        "CODIGO": 200,
        "MENSAJE": "Usuarios obtenidos correctamente de la api de seguridad",
        "DATOS": result
      };

    }catch(error){
      return {
        "CODIGO": 500,
        "MENSAJE": "Error POSTGRES",
        "DATOS": error
      };
    }
  }



  //funcion para obtener los usuarios de la api de seguridad por id de usuario, para poder obtener los datos del usuario y mostrarlos en la aplicacion de gestion de proyectos
  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuadmin, ConfiguracionSeguridad.buscarAccion_id]
  })
  @get('/ObtenerUsuarioSeguridadPorId/{id_usuario}')
  @response(200, {
    description: 'Obtener usuario de la api de seguridad por id',
    content:{
      'application/json':{
        schema: getModelSchemaRef(GenericModel),
      },
    },
  })
  async obtenerUsuarioSeguridadPorId(
    @param.path.string('id_usuario') id_usuario: String,
  ):Promise<object>{
    try{
      //llamamos al servicio CrearUsuariosApiSeguridadService para obtener los usuarios de la api de seguridad y le enviamos el token que trae la request para que el microservicio de seguridad valide el token y permita obtener los usuarios
      const token = this.request.headers.authorization;
      console.log(token);
      const result = await this.crearUsuariosApiSeguridadService.ObtenerUsuarioPorId(id_usuario, token!);
      console.log(result);

      if(!result){
        return {
          "CODIGO": 500,
          "MENSAJE": "Error al obtener el usuario de la api de seguridad",
          "DATOS": null
        };
      }
      return {
        "CODIGO": 200,
        "MENSAJE": "Usuario obtenido correctamente de la api de seguridad",
        "DATOS": result
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
