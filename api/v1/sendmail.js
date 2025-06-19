const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port:  587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"MobiIe Legends: Bang Bang" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html
    });

    return res.status(200).json({ message: 'Email sent!', info });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to send email', error: err.toString() });
  }
};
