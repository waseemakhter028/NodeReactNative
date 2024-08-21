import nodemailer from 'nodemailer';
import ejs from 'ejs';
import { getRootPath } from '../utils/common';
import { Attachment } from '../interfaces/common';

const { renderFile } = ejs;

const SendMail = async (to: string, subject: string, text: string, sendData?: object, attachment?: Attachment) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_HOST,
      // port: process.env.EMAIL_PORT,
      // secure: process.env.SECURE,
      // requireTls:true,
      //cc:"test@gmail.com",
      //bcc:"test@gmail.com",
      auth: {
        user: process.env.EMAIL_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    let htmlText = null;
    try {
      sendData = !sendData ? { test: 'test' } : sendData;
      htmlText = await renderFile(getRootPath() + '/views/mail/' + text, sendData);
    } catch (e) {
      console.log('Template file loader error');
      return e;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM_EMAIL,
      to: to,
      subject: subject,
      text: '',
      html: htmlText,
    };

    let attachments = {};
    if (attachment) {
      attachments = {
        attachments: [
          {
            filename: attachment.filename,
            path: attachment.filepath,
            contentType: attachment.contentType,
          },
        ],
      };
    }

    transporter.sendMail({ ...mailOptions, ...attachments }, function (error) {
      if (error) {
        console.log(error);
      }
    });
  } catch (e: any) {
    console.log('Send Email Error=' + e);
    return e;
  }

  return true;
};

export default SendMail;
