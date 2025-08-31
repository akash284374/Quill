import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, otp) => {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Missing email configuration in environment variables.");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: Number(process.env.EMAIL_PORT) === 465, // true for SSL (465), false for TLS (587)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Quill Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your email - Quill App',
        html: `
            <div style="font-family:sans-serif">
                <h2>Welcome to Quill!</h2>
                <p>Your OTP is:</p>
                <h1 style="color:#007bff">${otp}</h1>
                <p>This OTP is valid for <b>10 minutes</b>.</p>
                <br/>
                <p>If you did not request this, you can safely ignore this email.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};
