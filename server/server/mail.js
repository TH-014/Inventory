import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'inventory.1114@gmail.com',
        pass: 'lbfvptuukrlbcqyz'
    }
});

export function mailOptions(email, subject, text){
    return {from: 'inventory.1114@gmail.com',
        to: email,
        subject: subject,
        text: text}
};
