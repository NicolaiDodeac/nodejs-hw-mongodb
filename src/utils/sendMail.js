import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';
import { SMTP } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  try {
    const result = await transporter.sendMail(options);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send the email, please try again later.');
  }
};
