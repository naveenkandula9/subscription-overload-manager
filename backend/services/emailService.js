const nodemailer = require("nodemailer");
const logger = require("../config/logger");
const { env } = require("../config/env");
const { formatCurrency } = require("../utils/date");

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  return transporter;
};

const buildReminderTemplate = ({ userEmail, userName, subscription }) => {
  const serviceName = subscription.serviceName || subscription.name;
  const formattedPrice = formatCurrency(subscription.price, subscription.currency);
  const renewalDate = new Date(subscription.renewalDate).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });

  return {
    subject: `${serviceName} renews soon`,
    text: [
      `Hello ${userName || userEmail},`,
      "",
      `This is a reminder that your ${serviceName} subscription renews on ${renewalDate} UTC.`,
      `Price: ${formattedPrice}`,
      `Billing cycle: ${subscription.billingCycle}`,
      "",
      "Open Subscription Overload Manager to review or cancel the subscription before the charge hits.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; background:#0f172a; color:#e2e8f0; padding:24px;">
        <div style="max-width:560px; margin:0 auto; background:#111827; border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:32px;">
          <p style="margin:0 0 16px;">Hello ${userName || userEmail},</p>
          <h1 style="margin:0 0 12px; font-size:24px;">${serviceName} renews soon</h1>
          <p style="margin:0 0 16px; color:#94a3b8;">Stay ahead of unwanted charges with a quick review.</p>
          <div style="background:#0f172a; border-radius:16px; padding:18px; margin-bottom:16px;">
            <p style="margin:0 0 8px;"><strong>Renewal date:</strong> ${renewalDate} UTC</p>
            <p style="margin:0 0 8px;"><strong>Price:</strong> ${formattedPrice}</p>
            <p style="margin:0;"><strong>Billing cycle:</strong> ${subscription.billingCycle}</p>
          </div>
          <p style="margin:0; color:#cbd5e1;">Open your dashboard to update or cancel the subscription before the renewal date.</p>
        </div>
      </div>
    `,
  };
};

const sendReminderEmail = async ({ userEmail, userName, subscription }) => {
  const template = buildReminderTemplate({ userEmail, userName, subscription });
  logger.info("Sending reminder email", {
    userEmail,
    subscriptionId: subscription.id || subscription._id,
  });

  return getTransporter().sendMail({
    from: env.EMAIL_FROM,
    to: userEmail,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

module.exports = {
  sendReminderEmail,
  buildReminderTemplate,
};
