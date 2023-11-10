const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Mailgun',
    secure: true,
    port: 465,
    auth: {
        user: process.env.MAILGUN_USERNAME,
        pass: process.env.MAILGUN_PASSWORD,
    },
});

const sendEmail = async (html, email, sub, resumePath) => {
    const mailOptions = {
        from: 'noreply@example.com',
        to: email,
        subject: sub,
        html: html,
        attachments: [],
    };

    if (resumePath) {
        mailOptions.attachments.push({ path: resumePath });
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending admin email:', error);
    }
};

module.exports = {
    sendEmail,
};
