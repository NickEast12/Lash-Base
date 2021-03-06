const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const promiify = require("es6-promisify");

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASS
    }
});

const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(
        `${__dirname}/../views/email/${filename}.pug`,
        options
    );
    const inLine = juice(html);
    return inLine;
};

exports.send = async options => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: "LashBase <noreply@lashbase.com",
        to: options.user.email,
        subject: options.subject,
        html: html,
        text: text
    };
    const sendMail = promiify(transport.sendMail, transport);
    return sendMail(mailOptions);
};





