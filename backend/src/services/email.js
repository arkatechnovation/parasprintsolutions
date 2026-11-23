import nodemailer from 'nodemailer';
import { emailTemplate } from '../templates/email.js';
export async function notifySubmission(Model, doc, type) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM || !process.env.NOTIFICATION_EMAIL) {
    await Model.updateOne({ _id: doc._id }, { notificationStatus: 'not-configured' });
    return;
  }
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      disableFileAccess: true,
      disableUrlAccess: true,
      ...(process.env.SMTP_USER
        ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }
        : {}),
      connectionTimeout: 10000,
      socketTimeout: 15000,
    });
    const config = doc.configuration;
    const details = [
      ['Name', doc.customer.name],
      ['Email', doc.customer.email],
      ['Phone', doc.customer.phone],
      ['Company', doc.customer.company],
      ['City', doc.customer.city],
      ['Subject', doc.subject],
      ['Message', doc.message],
      ['Product', doc.productSlug || config?.product],
      ['Quantity', doc.quantity || config?.quantity],
      [
        'Dimensions',
        doc.dimensions ||
          (config ? `${config.length} × ${config.width} × ${config.height} ${config.unit}` : ''),
      ],
      ['Material', doc.material || config?.material],
      ['Printing', doc.printing || config?.printing],
      ['Finishing', doc.finishing || config?.finishing?.join(', ')],
      ['Requirements', doc.requirements],
      ['Attachment references', doc.attachmentIds?.map(String).join(', ')],
    ];
    const data = { name: doc.customer.name, reference: String(doc._id), type, details };
    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.NOTIFICATION_EMAIL,
      replyTo: doc.customer.email,
      subject: `New ${type} – ${String(doc._id)}`,
      html: emailTemplate(data),
    });
    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: doc.customer.email,
      subject: 'Your request to Paras Prints Solutions',
      html: emailTemplate({ ...data, customer: true }),
    });
    await Model.updateOne({ _id: doc._id }, { notificationStatus: 'sent' });
  } catch {
    await Model.updateOne({ _id: doc._id }, { notificationStatus: 'failed' });
    console.warn('email_delivery_failed', { reference: String(doc._id) });
  }
}
