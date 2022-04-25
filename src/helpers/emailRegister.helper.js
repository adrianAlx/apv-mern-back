'use strict';

import nodemailer from 'nodemailer';
import {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
  FRONT_END_URL,
} from '../config/index.js';

export const emailRegister = async dataForEmail => {
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
    subject: 'Comprueba tu cuenta en APV',
    text: 'Comprueba tu cuenta en APV - Text',
    html: `<p>Hola ${name}, comprueba tu cuenta en APV.</p>
      <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${FRONT_END_URL}/confirm/${token}">Comrpobar cuenta</a>
      </p>

      <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
    `,
  });

  console.log('Mensaje enviado: %s', info.messageId);
};
