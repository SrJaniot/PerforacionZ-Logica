/**
 * Plantillas de email para PerforacionZ
 * Diseños en modo oscuro profesionales
 */

import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';

export namespace EmailTemplates {
  const linkLogin = ConfiguracionSeguridad.linkLogin || 'https://perforacionz.ejaniot.com/seguridad/login';






  /**
   * Plantilla para notificar asignación a un proyecto
   * @param usuario - Nombre del usuario
   * @param email - Correo del usuario
   * @param nombreProyecto - Nombre del proyecto asignado
   * @param descripcionProyecto - Descripción del proyecto
   * @param enlaceLogin - URL del sistema
   * @returns HTML del email
   */
  export function plantillaAsignacionProyecto(
    usuario: string,
    email: string,
    nombreProyecto: string,
    descripcionProyecto: string,
    enlaceLogin: string = linkLogin
  ): string {
    return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Proyecto Asignado</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #0a0e27;
              color: #e0e0e0;
              line-height: 1.6;
          }

          .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, #1a1f3a 0%, #16213e 100%);
              border-left: 4px solid #00d4ff;
              box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
          }

          .header {
              background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
              padding: 30px 20px;
              text-align: center;
              border-bottom: 3px solid #00b8d4;
          }

          .header h1 {
              color: #fff;
              font-size: 28px;
              font-weight: 700;
          }

          .header p {
              color: rgba(255,255,255,0.9);
              margin-top: 5px;
          }

          .logo-section {
              text-align: center;
              padding: 20px;
              color: #00d4ff;
              font-size: 24px;
              font-weight: 700;
          }

          .content {
              padding: 40px 30px;
          }

          .greeting {
              font-size: 18px;
              color: #00d4ff;
              margin-bottom: 20px;
              font-weight: 600;
          }

          .message {
              color: #c0c0c0;
              margin-bottom: 25px;
              line-height: 1.8;
          }

          .project-box {
              background: rgba(0, 212, 255, 0.05);
              border: 2px solid #00d4ff;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
          }

          .project-label {
              color: #00d4ff;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 8px;
          }

          .project-value {
              background: rgba(10, 14, 39, 0.8);
              color: #00ff88;
              padding: 12px 15px;
              border-radius: 5px;
              border-left: 3px solid #00ff88;
              margin-bottom: 15px;
          }

          .description-value {
              background: rgba(10, 14, 39, 0.8);
              color: #c0c0c0;
              padding: 15px;
              border-radius: 5px;
              border-left: 3px solid #00d4ff;
              line-height: 1.8;
          }

          .info-box {
              background: rgba(76, 175, 80, 0.1);
              border-left: 4px solid #4caf50;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              color: #a5d6a7;
          }

          .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
              color: #fff;
              text-decoration: none;
              padding: 14px 40px;
              border-radius: 6px;
              font-weight: 600;
              box-shadow: 0 4px 15px rgba(0,212,255,0.3);
          }

          .button-container {
              text-align: center;
              margin: 30px 0;
          }

          .footer {
              background: rgba(0, 212, 255, 0.05);
              padding: 25px 30px;
              text-align: center;
              border-top: 1px solid rgba(0, 212, 255, 0.2);
              color: #808080;
              font-size: 12px;
          }

          .divider {
              height: 1px;
              background: linear-gradient(
                  to right,
                  transparent,
                  rgba(0,212,255,0.3),
                  transparent
              );
              margin: 20px 0;
          }

          @media (max-width: 600px) {
              .content {
                  padding: 25px 20px;
              }

              .header h1 {
                  font-size: 22px;
              }
          }
      </style>
  </head>
  <body>

  <div class="container">

      <div class="header">
          <h1>⛏️ PERFORACIONZ</h1>
          <p>Sistema Integrado de Notificaciones</p>
      </div>

      <div class="logo-section">
          📁 Nuevo Proyecto Asignado
      </div>

      <div class="content">

          <p class="greeting">
              ¡Hola, ${usuario}!
          </p>

          <p class="message">
              Te informamos que un administrador te ha agregado a un nuevo proyecto dentro del sistema
              <strong>PerforacionZ</strong>.
          </p>

          <div class="project-box">

              <div class="project-label">
                  📁 Nombre del Proyecto
              </div>
              <div class="project-value">
                  ${nombreProyecto}
              </div>

              <div class="divider"></div>

              <div class="project-label">
                  📝 Descripción del Proyecto
              </div>
              <div class="description-value">
                  ${descripcionProyecto}
              </div>

              <div class="divider"></div>

              <div class="project-label">
                  👤 Usuario Asignado
              </div>
              <div class="project-value">
                  ${usuario}
              </div>

              <div class="project-label">
                  📧 Correo
              </div>
              <div class="project-value">
                  ${email}
              </div>

          </div>

          <div class="info-box">
              <strong>ℹ️ Información:</strong>
              Ya puedes ingresar al sistema para consultar la información y actividades relacionadas con este proyecto.
          </div>

          <div class="button-container">
              <a href="${enlaceLogin}" class="cta-button">
                  🚀 Ver Proyecto
              </a>
          </div>

          <p class="message">
              Accede a la plataforma utilizando tu cuenta para revisar los detalles del proyecto y comenzar tus actividades asignadas.
          </p>

      </div>

      <div class="footer">
          <p>
              <strong>PerforacionZ © 2026</strong><br>
              Sistema Integrado de Notificaciones para Operaciones de Perforación
          </p>

          <p style="margin-top:15px;">
              Este es un correo automático. Por favor, no respondas a este mensaje.
          </p>
      </div>

  </div>

  </body>
  </html>
    `;
  }










  /**
   * Plantilla para notificar asignación de broca a un proyecto
   * @param supervisor - Nombre del supervisor
   * @param nombreProyecto - Nombre del proyecto
   * @param idBroca - Identificador de la broca
   * @param modeloBroca - Modelo de la broca
   * @param enlaceLogin - URL del sistema
   * @returns HTML del email
   */
  export function plantillaAsignacionBrocaProyecto(
    supervisor: string,
    nombreProyecto: string,
    idBroca: string,
    modeloBroca: string,
    enlaceLogin: string = linkLogin
  ): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Broca Asignada al Proyecto</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
    background-color:#0a0e27;
    color:#e0e0e0;
    line-height:1.6;
}

.container{
    max-width:600px;
    margin:0 auto;
    background:linear-gradient(135deg,#1a1f3a 0%,#16213e 100%);
    border-left:4px solid #ff9800;
    box-shadow:0 8px 32px rgba(255,152,0,0.15);
}

.header{
    background:linear-gradient(135deg,#ff9800 0%,#f57c00 100%);
    padding:30px 20px;
    text-align:center;
}

.header h1{
    color:#fff;
    font-size:28px;
    font-weight:700;
}

.header p{
    color:rgba(255,255,255,0.9);
    margin-top:5px;
}

.logo-section{
    text-align:center;
    padding:20px;
    color:#ff9800;
    font-size:24px;
    font-weight:700;
}

.content{
    padding:40px 30px;
}

.greeting{
    font-size:18px;
    color:#ff9800;
    margin-bottom:20px;
    font-weight:600;
}

.message{
    color:#c0c0c0;
    margin-bottom:25px;
    line-height:1.8;
}

.broca-box{
    background:rgba(255,152,0,0.05);
    border:2px solid #ff9800;
    border-radius:8px;
    padding:20px;
    margin:25px 0;
}

.label{
    color:#ff9800;
    font-size:12px;
    font-weight:600;
    text-transform:uppercase;
    letter-spacing:1px;
    margin-bottom:8px;
}

.value{
    background:rgba(10,14,39,0.8);
    color:#00ff88;
    padding:12px 15px;
    border-radius:5px;
    border-left:3px solid #00ff88;
    margin-bottom:15px;
}

.info-box{
    background:rgba(255,193,7,0.10);
    border-left:4px solid #ffc107;
    padding:15px;
    border-radius:5px;
    margin:20px 0;
    color:#ffd54f;
}

.cta-button{
    display:inline-block;
    background:linear-gradient(135deg,#ff9800 0%,#f57c00 100%);
    color:#fff;
    text-decoration:none;
    padding:14px 40px;
    border-radius:6px;
    font-weight:600;
}

.button-container{
    text-align:center;
    margin:30px 0;
}

.footer{
    background:rgba(255,152,0,0.05);
    padding:25px 30px;
    text-align:center;
    border-top:1px solid rgba(255,152,0,0.2);
    color:#808080;
    font-size:12px;
}

.divider{
    height:1px;
    background:linear-gradient(
        to right,
        transparent,
        rgba(255,152,0,0.3),
        transparent
    );
    margin:20px 0;
}
</style>

</head>

<body>

<div class="container">

    <div class="header">
        <h1>⛏️ PERFORACIONZ</h1>
        <p>Sistema Integrado de Notificaciones</p>
    </div>

    <div class="logo-section">
        🛠️ Broca Asignada al Proyecto
    </div>

    <div class="content">

        <p class="greeting">
            Hola, ${supervisor}
        </p>

        <p class="message">
            Te informamos que una nueva broca ha sido asignada a un proyecto bajo tu supervisión.
            A continuación encontrarás los detalles de la asignación.
        </p>

        <div class="broca-box">

            <div class="label">
                📁 Proyecto
            </div>
            <div class="value">
                ${nombreProyecto}
            </div>

            <div class="divider"></div>

            <div class="label">
                🔩 Identificador de la Broca
            </div>
            <div class="value">
                ${idBroca}
            </div>

            <div class="label">
                ⚙️ Modelo de la Broca
            </div>
            <div class="value">
                ${modeloBroca}
            </div>

        </div>

        <div class="info-box">
            <strong>ℹ️ Acción requerida:</strong>
            Verifica que la broca se encuentre disponible y correctamente registrada para su utilización dentro del proyecto.
        </div>

        <div class="button-container">
            <a href="${enlaceLogin}" class="cta-button">
                🔍 Revisar Asignación
            </a>
        </div>

        <p class="message">
            Puedes ingresar al sistema para consultar el estado de la broca,
            su historial de uso y la información relacionada con el proyecto.
        </p>

    </div>

    <div class="footer">
        <p>
            <strong>PerforacionZ © 2026</strong><br>
            Sistema Integrado de Notificaciones para Operaciones de Perforación
        </p>

        <p style="margin-top:15px;">
            Este es un correo automático. Por favor, no respondas a este mensaje.
        </p>
    </div>

</div>

</body>
</html>
  `;
  }






/**
 * Plantilla para notificar devolución de broca
 * @param administrador Nombre del administrador
 * @param supervisor Nombre del supervisor que realiza la devolución
 * @param serialBroca Serial o ID de la broca devuelta
 * @param enlaceLogin URL del sistema
 * @returns HTML del email
 */
export function plantillaDevolucionBroca(
  administrador: string,
  supervisor: string,
  serialBroca: string,
  enlaceLogin: string = linkLogin
): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Devolución de Broca</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
    background-color:#0a0e27;
    color:#e0e0e0;
    line-height:1.6;
}

.container{
    max-width:600px;
    margin:0 auto;
    background:linear-gradient(135deg,#1a1f3a 0%,#16213e 100%);
    border-left:4px solid #f44336;
    box-shadow:0 8px 32px rgba(244,67,54,0.15);
}

.header{
    background:linear-gradient(135deg,#f44336 0%,#d32f2f 100%);
    padding:30px 20px;
    text-align:center;
}

.header h1{
    color:#fff;
    font-size:28px;
    font-weight:700;
}

.logo-section{
    text-align:center;
    padding:20px;
    color:#f44336;
    font-size:24px;
    font-weight:700;
}

.content{
    padding:40px 30px;
}

.greeting{
    font-size:18px;
    color:#f44336;
    margin-bottom:20px;
    font-weight:600;
}

.message{
    color:#c0c0c0;
    margin-bottom:25px;
    line-height:1.8;
}

.info-box{
    background:rgba(244,67,54,0.05);
    border:2px solid #f44336;
    border-radius:8px;
    padding:20px;
    margin:25px 0;
}

.label{
    color:#f44336;
    font-size:12px;
    font-weight:600;
    text-transform:uppercase;
    margin-bottom:8px;
}

.value{
    background:rgba(10,14,39,0.8);
    color:#00ff88;
    padding:12px 15px;
    border-radius:5px;
    border-left:3px solid #00ff88;
    margin-bottom:15px;
}

.alert-box{
    background:rgba(255,193,7,0.10);
    border-left:4px solid #ffc107;
    padding:15px;
    border-radius:5px;
    color:#ffd54f;
    margin:20px 0;
}

.button-container{
    text-align:center;
    margin:30px 0;
}

.cta-button{
    display:inline-block;
    background:linear-gradient(135deg,#f44336 0%,#d32f2f 100%);
    color:#fff;
    text-decoration:none;
    padding:14px 40px;
    border-radius:6px;
    font-weight:600;
}

.footer{
    background:rgba(244,67,54,0.05);
    padding:25px 30px;
    text-align:center;
    border-top:1px solid rgba(244,67,54,0.2);
    color:#808080;
    font-size:12px;
}
</style>
</head>

<body>

<div class="container">

    <div class="header">
        <h1>⛏️ PERFORACIONZ</h1>
        <p>Sistema Integrado de Seguridad</p>
    </div>

    <div class="logo-section">
        🔄 Devolución de Broca
    </div>

    <div class="content">

        <p class="greeting">
            Hola, ${administrador}
        </p>

        <p class="message">
            Se ha registrado una devolución de broca dentro del sistema
            <strong>PerforacionZ</strong>.
        </p>

        <div class="info-box">

            <div class="label">
                👷 Supervisor
            </div>
            <div class="value">
                ${supervisor}
            </div>

            <div class="label">
                🔩 Serial de la Broca
            </div>
            <div class="value">
                ${serialBroca}
            </div>

        </div>

        <div class="alert-box">
            <strong>⚠️ Acción requerida:</strong><br><br>

            Por favor verifica el estado físico y operativo de la broca devuelta para determinar si puede continuar siendo utilizada en futuros proyectos.

            En caso de que la broca presente desgaste excesivo, daños o no cumpla las condiciones necesarias para su reutilización, se recomienda darla de baja dentro del sistema para evitar futuras asignaciones.
        </div>

        <div class="button-container">
            <a href="${enlaceLogin}" class="cta-button">
                🔍 Revisar Broca
            </a>
        </div>

        <p class="message">
            Esta notificación fue generada automáticamente tras el proceso de devolución registrado por el supervisor responsable.
        </p>

    </div>

    <div class="footer">
        <p>
            <strong>PerforacionZ © 2026</strong><br>
            Sistema Integrado de Seguridad para Operaciones de Perforación
        </p>

        <p style="margin-top:15px;">
            Este es un correo automático. Por favor, no respondas a este mensaje.
        </p>
    </div>

</div>

</body>
</html>
  `;
}






/**
 * Plantilla para notificar movimiento de broca en una perforación
 * @param administrador Nombre del administrador
 * @param nombreProyecto Nombre del proyecto
 * @param idPerforacion Identificador de la perforación
 * @param serialBroca Serial de la broca
 * @param fechaMovimiento Fecha y hora del movimiento
 * @param tipoMovimiento Entrada o Salida
 * @param profundidadMovimiento Profundidad del movimiento en metros
 * @param supervisor Supervisor que registró el movimiento
 * @param enlaceLogin URL del sistema
 */
export function plantillaMovimientoBrocaPerforacion(
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
): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Movimiento de Broca Registrado</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
    background-color:#0a0e27;
    color:#e0e0e0;
    line-height:1.6;
}

.container{
    max-width:600px;
    margin:0 auto;
    background:linear-gradient(135deg,#1a1f3a 0%,#16213e 100%);
    border-left:4px solid #9c27b0;
    box-shadow:0 8px 32px rgba(156,39,176,0.15);
}

.header{
    background:linear-gradient(135deg,#9c27b0 0%,#7b1fa2 100%);
    padding:30px 20px;
    text-align:center;
}

.header h1{
    color:#fff;
    font-size:28px;
    font-weight:700;
}

.header p{
    color:rgba(255,255,255,0.9);
    margin-top:5px;
}

.logo-section{
    text-align:center;
    padding:20px;
    color:#ba68c8;
    font-size:24px;
    font-weight:700;
}

.content{
    padding:40px 30px;
}

.greeting{
    font-size:18px;
    color:#ba68c8;
    margin-bottom:20px;
    font-weight:600;
}

.message{
    color:#c0c0c0;
    margin-bottom:25px;
    line-height:1.8;
}

.movement-box{
    background:rgba(156,39,176,0.05);
    border:2px solid #9c27b0;
    border-radius:8px;
    padding:20px;
    margin:25px 0;
}

.label{
    color:#ba68c8;
    font-size:12px;
    font-weight:600;
    text-transform:uppercase;
    letter-spacing:1px;
    margin-bottom:8px;
}

.value{
    background:rgba(10,14,39,0.8);
    color:#00ff88;
    padding:12px 15px;
    border-radius:5px;
    border-left:3px solid #00ff88;
    margin-bottom:15px;
}

.info-box{
    background:rgba(156,39,176,0.08);
    border-left:4px solid #9c27b0;
    padding:15px;
    border-radius:5px;
    margin:20px 0;
    color:#d1c4e9;
}

.button-container{
    text-align:center;
    margin:30px 0;
}

.cta-button{
    display:inline-block;
    background:linear-gradient(135deg,#9c27b0 0%,#7b1fa2 100%);
    color:#fff;
    text-decoration:none;
    padding:14px 40px;
    border-radius:6px;
    font-weight:600;
}

.footer{
    background:rgba(156,39,176,0.05);
    padding:25px 30px;
    text-align:center;
    border-top:1px solid rgba(156,39,176,0.2);
    color:#808080;
    font-size:12px;
}

.divider{
    height:1px;
    background:linear-gradient(
        to right,
        transparent,
        rgba(156,39,176,0.3),
        transparent
    );
    margin:20px 0;
}
</style>

</head>

<body>

<div class="container">

    <div class="header">
        <h1>⛏️ PERFORACIONZ</h1>
        <p>Sistema Integrado de Notificación</p>
    </div>

    <div class="logo-section">
        📊 Movimiento de Broca Registrado
    </div>

    <div class="content">

        <p class="greeting">
            Hola, ${administrador}
        </p>

        <p class="message">
            Se ha registrado un nuevo movimiento de broca dentro de una perforación.
            A continuación se presenta el detalle del movimiento reportado por el supervisor.
        </p>

        <div class="movement-box">

            <div class="label">📁 Proyecto</div>
            <div class="value">${nombreProyecto}</div>

            <div class="label">🕳️ Perforación</div>
            <div class="value">${idPerforacion}</div>

            <div class="label">🔩 Serial de la Broca</div>
            <div class="value">${serialBroca}</div>

            <div class="label">🔄 Tipo de Movimiento</div>
            <div class="value">${tipoMovimiento}</div>

            <div class="label">📏 Profundidad</div>
            <div class="value">${profundidadMovimiento} metros</div>

            <div class="label">📅 Fecha del Movimiento</div>
            <div class="value">${fechaMovimiento}</div>

            <div class="label">👷 Supervisor Responsable</div>
            <div class="value">${supervisor}</div>

        </div>

        <div class="info-box">
            <strong>ℹ️ Información:</strong><br><br>
            Este movimiento ha sido registrado correctamente en el sistema y forma parte de la trazabilidad operativa de la perforación y de la broca utilizada.
        </div>

        <div class="button-container">
            <a href="${enlaceLogin}" class="cta-button">
                📊 Ver Movimiento
            </a>
        </div>

    </div>

    <div class="footer">
        <p>
            <strong>PerforacionZ © 2026</strong><br>
            Sistema Integrado de Notificación para Operaciones de Perforación
        </p>

        <p style="margin-top:15px;">
            Este es un correo automático. Por favor, no respondas a este mensaje.
        </p>
    </div>

</div>

</body>
</html>
  `;
}








}
