const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const mjml2html = require('mjml');
const fs = require('fs').promises;
const Form = require('./models/form');
const { uploadFile } = require('./s3.js');
const nodemailer = require('nodemailer');
const { sendEmail } = require('./services/emailService');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const uploadPath = path.join(__dirname, 'uploads');
try {
    fs.mkdir(uploadPath, { recursive: true }); 
} catch (error) {
    console.log(`Error creating uploads directory: ${error}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('DB is connected');
    })
    .catch((err) => {
        console.log(err);
    });

const readMJMLTemplates = async () => {
    try {
        const emailTemplate = await fs.readFile('emailTemplate.mjml', 'utf8');
        const formTemplate = await fs.readFile('formTemplate.mjml', 'utf8');
        return { emailTemplate, formTemplate };
    } catch (error) {
        console.error('Error reading MJML templates:', error);
        throw error;
    }
}

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
    try {
        // const { name, email, college, year, aboutOpportunity, phone } = req.body;
        // const user = await Form.findOne({ email });
        // if (user) {
        //     return res.status(200).json({ message: "Email is already registered." });
        // }

        // let resumePath;
        // if (req.files.resume) {
        //     resumePath = req.files.resume[0].path;
            // const resumeResult = await uploadFile(req.files.resume, college, email, name);
        // }

        // const videoPath = req.files.video[0].path;
        // const videoResult = await uploadFile(req.files.video, college, email, name);

        // const { emailTemplate, formTemplate } = await readMJMLTemplates();
        // const compiledEmailMJML = emailTemplate.replace('{name}', name);
        // const { html: emailHTML, errors: emailErrors } = mjml2html(compiledEmailMJML);

        // const compiledFormMJML = formTemplate
        //     .replace('{name}', name)
        //     .replace('{email}', email)
        //     .replace('{college}', college)
        //     .replace('{year}', year)
        //     .replace('{aboutOpportunity}', aboutOpportunity)
        //     .replace('{phone}', phone)
        //     .replace('{link}', videoResult);
        

        // const { html: formHTML, errors: formErrors } = mjml2html(compiledFormMJML);

        // if (emailErrors.length || formErrors.length) {
        //     console.error('MJML compilation errors:', emailErrors, formErrors);
        //     return res.status(500).json({ message: 'Email template compilation error.' });
        // }

        // const adminEmail = process.env.ADMIN_EMAIL;
        // const userSub="Thank You for Applying"
        // const adminSub="New Job Application for Sales & Marketing"
        // const sendUserEmail = await sendEmail(emailHTML, email, userSub);
        // const sendAdminEmail = await sendEmail(formHTML, adminEmail, adminSub, resumePath);

        // const directory = uploadPath;
        // for (const file of await fs.readdir(directory)) {
        //     await fs.unlink(path.join(directory, file));
        // }
       
        // await Form.create({ name, email, college, year, aboutOpportunity, phone, resume: resumePath, video: videoPath });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use((req, res, next) => {
    res.redirect('/error');
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
