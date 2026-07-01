const fetch = require('node-fetch');

import {injectable, BindingScope} from '@loopback/core';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
import {UsuarioInsertActivacion} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class CrearUsuariosApiSeguridadService {

  constructor() {}

  async crearUsuario(
    datos: UsuarioInsertActivacion,
    token: string
  ) {
    const url = `${ConfiguracionSeguridad.hostSeguridad}/funcion-inserta-usuario-roluSupervisor-CONACTIVACION`;

    const respuesta = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(datos),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    return await respuesta.json();
  }





  async UpdateUsuario(
    datos: UsuarioInsertActivacion,
    token: string
  ) {
    const url = `${ConfiguracionSeguridad.hostSeguridad}/funcion-actualiza-usuario-rolSupervisor-CONACTIVACION`;

    const respuesta = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(datos),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    return await respuesta.json();
  }



  //obtener usuarios de la api de seguridad para gestionar los usuarios en la aplicacion de gestion de proyectos
   async ObtenerUsuarios(
    token: string
  ) {
    const url = `${ConfiguracionSeguridad.hostSeguridad}/usuarios/valores`;

    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });


    return await respuesta.json();
  }

  //obtener usuarios de la api de seguridad para gestionar los usuarios en la aplicacion de gestion de proyectos
  async ObtenerUsuarioPorId(
    id: String,
    token: string
  ) {
    const url = `${ConfiguracionSeguridad.hostSeguridad}/usuarios/valores/${id}`;

    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    return await respuesta.json();
  }


}
