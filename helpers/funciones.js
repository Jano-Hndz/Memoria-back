const nodemailer = require('nodemailer');


function generateRandomPassword(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

function EnviarEmailContrasena({email,contrasena}) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "notificacionesasistente5@gmail.com",
          pass: "ecvd giyx vjni rqay",
        },
    });
    
    const mailOptions = {
        from: 'notificacionesasistente5@gmail.com',
        to: email, 
        subject: 'Se le ha creado una cuentra en ?????',
        text: `Hola, se le ha creado una cuenta en ????? y esta es su contraseña para que pueda acceder : ${contrasena}`
    };
    
    // Envía el correo electrónico
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });

}




module.exports = {
    generateRandomPassword,
    EnviarEmailContrasena
}