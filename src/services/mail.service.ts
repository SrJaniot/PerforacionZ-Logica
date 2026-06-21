import {BindingScope, injectable} from '@loopback/core';
import * as nodemailer from 'nodemailer';
import {EmailTemplates} from '../templates/email-templates';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
// se instalo las dependencias nodemailer y @types/nodemailer para el servicio de mail
// npm install nodemailer @types/nodemailer --save


export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@injectable({scope: BindingScope.TRANSIENT})
export class MailService {private transporter: nodemailer.Transporter;

  constructor() {
    // Configuración del servidor de mail
    // Para desarrollo local (laptop), cambiar MAIL_HOST a 'localhost' o tu IP local
    // Para producción en servidor, usar la configuración del servidor con tu dominio

    const mailHost = process.env.MAIL_HOST || 'localhost'; // 'localhost' para desarrollo, 'mail.ejaniot.com' para servidor
    const mailPort = parseInt(process.env.MAIL_PORT || '587', 10);
    const mailSecure = process.env.MAIL_SECURE === 'true'; // false para puerto 587 (STARTTLS)
    const mailUser = process.env.MAIL_USER || 'app_ejaniot';
    const mailPass = process.env.MAIL_PASS || 'App52252779.101299*';
    const mailFromAddress = process.env.MAIL_FROM || 'app@ejaniot.com';


    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailSecure, // false para STARTTLS (puerto 587), true para SSL (puerto 465)
      auth: {
        user: mailUser,
        pass: mailPass,
      },
      tls: {
        rejectUnauthorized: false, // Aceptar certificados auto-firmados en desarrollo
      },
    });
  }

  /**
   * Envía un email usando la configuración del servidor de mail
   * @param options Opciones del email (to, subject, text, html)
   * @returns Promesa con la respuesta del servidor
   */
  async sendEmail(options: MailOptions): Promise<any> {
    try {
      const mailOptions = {
        from: process.env.MAIL_FROM || 'app@ejaniot.com',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.response);
      return info;
    } catch (error) {
      console.error('ERROR al enviar email:', error);
      throw error;
    }
  }

  /**
   * Verifica la conexión con el servidor de mail
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Conexión al servidor de mail verificada ✓');
      return true;
    } catch (error) {
      console.error('ERROR: No se puede conectar al servidor de mail:', error);
      return false;
    }
  }



    /**
   * Plantilla para notificar asignación a un proyecto
   * @param usuario - Nombre del usuario
   * @param email - Correo del usuario
   * @param nombreProyecto - Nombre del proyecto asignado
   * @param descripcionProyecto - Descripción del proyecto
   */
  async sendAsignacionProyectoEmail(
    email: string,
    usuario: string,
    nombreProyecto: string,
    descripcionProyecto: string,
    enlaceLogin: string = ConfiguracionSeguridad.linkLogin || 'https://perforacionz.ejaniot.com/seguridad/login'
  ): Promise<any> {
    try {
      const html = EmailTemplates.plantillaAsignacionProyecto(
        usuario,
        email,
        nombreProyecto,
        descripcionProyecto,
        enlaceLogin
      );

      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM || 'app@ejaniot.com',
        to: email,
        subject: '⛏️ Proyecto Asignado - PerforacionZ',
        html: html,
      });

      console.log('Email de asignación de proyecto enviado:', info.response);
      return {success: true, info};
    } catch (error) {
      console.error('ERROR al enviar email de asignación de proyecto:', error);
      throw error;
    }
  }



  /**
   * Envía notificación de asignación de broca a un supervisor
   * @param email Correo del supervisor
   * @param supervisor Nombre del supervisor
   * @param nombreProyecto Nombre del proyecto
   * @param idBroca Identificador de la broca
   * @param modeloBroca Modelo de la broca
   * @param enlaceLogin URL de acceso al sistema
   */
  async sendAsignacionBrocaProyectoEmail(
    email: string,
    supervisor: string,
    nombreProyecto: string,
    idBroca: string,
    modeloBroca: string,
    enlaceLogin: string = ConfiguracionSeguridad.linkLogin || 'https://perforacionz.ejaniot.com/seguridad/login'
  ): Promise<any> {
    try {
      const html = EmailTemplates.plantillaAsignacionBrocaProyecto(
        supervisor,
        nombreProyecto,
        idBroca,
        modeloBroca,
        enlaceLogin
      );

      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM || 'app@ejaniot.com',
        to: email,
        subject: `🛠️ Nueva Broca Asignada - ${nombreProyecto}`,
        html: html,
      });

      console.log(
        'Email de asignación de broca enviado:',
        info.response
      );

      return {
        success: true,
        info,
      };
    } catch (error) {
      console.error(
        'ERROR al enviar email de asignación de broca:',
        error
      );
      throw error;
    }
  }





  async sendDevolucionBrocaEmail(
    emailAdmin: string,
    administrador: string,
    supervisor: string,
    serialBroca: string,
    enlaceLogin: string =  ConfiguracionSeguridad.linkLogin || 'https://perforacionz.ejaniot.com/seguridad/login'
  ): Promise<any> {
    try {
      const html = EmailTemplates.plantillaDevolucionBroca(
        administrador,
        supervisor,
        serialBroca,
        enlaceLogin
      );

      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM || 'app@ejaniot.com',
        to: emailAdmin,
        subject: `🔄 Devolución de Broca ${serialBroca} - Requiere Revisión`,
        html: html,
      });

      console.log(
        'Email de devolución de broca enviado:',
        info.response
      );

      return {
        success: true,
        info,
      };
    } catch (error) {
      console.error(
        'ERROR al enviar email de devolución de broca:',
        error
      );
      throw error;
    }
  }




/**
 * Envía notificación al administrador sobre un movimiento de broca
 */
async sendMovimientoBrocaPerforacionEmail(
  emailAdmin: string,
  administrador: string,
  nombreProyecto: string,
  idPerforacion: number,
  serialBroca: string,
  fechaMovimiento: string,
  tipoMovimiento: string,
  profundidadMovimiento: number,
  supervisor: string,
  enlaceLogin: string =
    ConfiguracionSeguridad.linkLogin ||
    'https://perforacionz.ejaniot.com/seguridad/login'
): Promise<any> {
  try {
    const html = EmailTemplates.plantillaMovimientoBrocaPerforacion(
      administrador,
      nombreProyecto,
      idPerforacion,
      serialBroca,
      fechaMovimiento,
      tipoMovimiento,
      profundidadMovimiento,
      supervisor,
      enlaceLogin
    );

    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM || 'app@ejaniot.com',
      to: emailAdmin,
      subject: `📊 ${tipoMovimiento.toUpperCase()} de Broca ${serialBroca} - ${nombreProyecto}`,
      html: html,
    });

    console.log(
      'Email de movimiento de broca enviado:',
      info.response
    );

    return {
      success: true,
      info,
    };
  } catch (error) {
    console.error(
      'ERROR al enviar email de movimiento de broca:',
      error
    );
    throw error;
  }
}












}
