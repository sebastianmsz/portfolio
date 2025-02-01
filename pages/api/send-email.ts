import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
     tls: {
      rejectUnauthorized: true
    }
});


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, message } = req.body;


    const mailOptions = {
        from: email,
        to: process.env.EMAIL_RECEIVER,
        subject: `Contact form submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
         const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
        res.status(200).json({ message: 'Email sent', info: info.response });
    } catch (error) {
        console.error('Error sending email: ', error);
        const errorMessage = error instanceof Error ? error.toString() : 'Unknown error';
        res.status(500).json({ message: 'Error sending email', error: errorMessage });
    }
};

export default handler;