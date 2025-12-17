const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configuração do multer.
const upload = multer({ dest: 'uploads/' });

router.post('/enviar-formulario', upload.single('documento'), async (req, res) => {
    const { name, email, tel, area, menssage } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: 'Arquivo não enviado.' });
    }

    // Configuração do transporter do nodemailer
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});


    // Montar o e-mail
    const mailOptions = {
        from: `"Site TC do Brasil" <SEU_EMAIL@gmail.com>`,
        to: 'marcelo.junior@tcdobrasil.com.br', // pode ser outro se quiser receber em outro
        subject: 'Novo currículo enviado pelo site',
        text: `
            Nome: ${name}
            E-mail: ${email}
            Telefone: ${tel}
            Área de Interesse: ${area}
            Mensagem: ${menssage}
        `,
        attachments: [
            {
                filename: file.originalname,
                path: file.path
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);

        // Remove o arquivo temporário depois do envio
        fs.unlink(file.path, (err) => {
            if (err) console.error('Erro ao remover arquivo temporário:', err);
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ success: false, message: 'Erro ao enviar e-mail' });
    }
});

module.exports = router;
