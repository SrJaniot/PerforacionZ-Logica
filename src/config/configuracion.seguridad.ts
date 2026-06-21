export namespace ConfiguracionSeguridad{
  //-------------------------VARIABLES DE ENTORNO  -------------------------------------
    //instalar el paquete dotenv npm i dotenv para poder leer variables de entorno  y importar en application.ts require('dotenv').config();
    export const connection_user_postgres = process.env.CONNECTION_USER_POSTGRES ;
    export const connection_password_postgres = process.env.CONNECTION_PASSWORD_POSTGRES ;
    export const connection_database_postgres = process.env.CONNECTION_DATABASE_POSTGRES ;
    export const connection_port_postgres = process.env.CONNECTION_PORT_POSTGRES ;
    //
    //cambiar esta ruta por la url del server con el puerto a la api de seguridad
    export const hostSeguridad = process.env.CONECTION_SEGURIDAD ;
    // mail varibales de entorno
    export const linkLogin = process.env.LINKLOGIN ;
    export const correoAdmin = process.env.CORREO_ADMIN ;



    //-------------------------menus -------------------------------------
  export const menuadmin = 1;
  export const MenuSupervisor = 2;
  export const MenuProyectos = 3;
  export const MenuBrocas = 4;

  //-------------------------acciones -------------------------------------
  export const listarAccion = "listar";
  export const guardarAccion = "guardar";
  export const eliminarAccion = "eliminar";
  export const editarAccion = "editar";
  export const buscarAccion_id = "buscar_id";

  //-------------------------rol -------------------------------------
  export const roladmin = 1;
  export const rolSupervisor = 2;



}
