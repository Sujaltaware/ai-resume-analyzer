const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

const sendPasswordResetEmail = async ({ toEmail, resetLink }) => {
    const mailOptions = {
        from: `"PrepIQ" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Reset your PrepIQ password',
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f0f17; color: #e8e8f0; border-radius: 12px;">
                <h2 style="color: #6c63ff; margin-bottom: 8px;">Reset your password</h2>
                <p style="color: #9090a8; margin-bottom: 24px;">Click the button below to reset your password. This link expires in <strong style="color: #e8e8f0;">1 hour</strong>.</p>
                <a href="${resetLink}"
                   style="display: inline-block; padding: 12px 28px; background: #6c63ff; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Reset Password
                </a>
                <p style="color: #555; font-size: 12px; margin-top: 24px;">If you didn't request this, ignore this email. Your password won't change.</p>
            </div>
        `
    }

    await transporter.sendMail(mailOptions)
}

module.exports = { sendPasswordResetEmail }