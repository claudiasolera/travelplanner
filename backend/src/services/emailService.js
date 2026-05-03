import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const sendVerificationEmail = async (email, name, token) => {
    try {
        await transporter.sendMail({
            from: '"Travel Planner" <noreply@tuapp.com>',
            to: email,
            subject: 'Verifica tu cuenta',
            html: `...tu html...`
        });
        console.log('✅ Email enviado a:', email);
        return true;
    } catch (error) {
        console.error('❌ Error enviando email (pero el registro continúa):', error.message);
        
        return false; 
    }
};

export const sendResetPasswordEmail = async (email, name, token) => {
    await transporter.sendMail({
        from: '"Travel Planner" <noreply@tuapp.com>',
        to: email,
        subject: 'Recuperar contraseña',
        html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #2563EB;">Recuperar contraseña</h2>
                <p>Hola ${name}, recibimos una solicitud para restablecer tu contraseña.</p>
                <a href="${BASE_URL}/reset-password?token=${token}"
                    style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 500; margin: 16px 0;">
                    Restablecer contraseña
                </a>
                <p style="color: #9A9A9A; font-size: 12px;">Este enlace expira en 1 hora.</p>
            </div>
        `
    });
};