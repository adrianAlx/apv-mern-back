'use strict';
'use strict';

import nodemailer from 'nodemailer';
import {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
  FRONT_END_URL,
} from '../config/index.js';

export const emailResetPassword = async dataForEmail => {
  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const { email, name, token } = dataForEmail;

  // Enviar emial
  const info = await transport.sendMail({
    from: 'APV - Administrador de Pacientes de Veterinaria',
    to: email,
    subject: 'Reestablece tu Password',
    text: 'Reestablece tu Password - Text',
    html: `<p>Hola ${name}, has solicitado restablecer tu password.</p>

      <p>Sigue el siguiente enlace para generar tu nuevo password:
        <a href="${FRONT_END_URL}/reset-password/${token}">Restablecer Password</a>
      </p>

      <p>Si tu no solicitaste esto, puedes ignorar este mensaje.</p>
    `,
  });

  console.log('Mensaje enviado: %s', info.messageId);
};
