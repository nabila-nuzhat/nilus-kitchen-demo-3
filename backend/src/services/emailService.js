/**
 * using node mailer, app password generator
 * 
 * SMTP_PASS must be the generated Google App Password, not your normal Gmail password.
To create one:
1. Open your Google Account security settings.
2. Enable 2-Step Verification.
3. Open the App Passwords page, if available for your account.
4. Generate an App Password and copy it into your local .env.
Some accounts or security configurations may not offer App Passwords. If yours does not, use OAuth 2.0 or a suitable email API instead. 

Nodemailer: ?????????? check for changes in .env after uninstallation of initially used "Resend" Package??????
 */


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationLink =
    `${process.env.API_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your Nilus Kitchen account",
    text: `Verify your email using this link: ${verificationLink}`,
    html: `
      <h2>Nilus Kitchen</h2>
      <p>Please verify your email address to activate your owner account.</p>
      <a href="${verificationLink}">Verify email</a>
      <p>This link expires in 30 minutes.</p>
    `,
  });
}
