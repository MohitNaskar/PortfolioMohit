const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path'); // Added missing import

require('dotenv').config(); // Added missing parentheses

const app = express();
const PORT = process.env.PORT || 5000; // Fixed order of PORT declaration

// Middleware
// app.use(cors({
//     origin: function(origin, callback) {
//         // Allow requests with no origin (like mobile apps or curl requests)
//         if (!origin) return callback(null, true);
        
//         // List of allowed origins
//         const allowedOrigins = [
//             'http://localhost:5500',
//             'http://127.0.0.1:5500',
//             'https://mohitnaskar.netlify.app',
//             process.env.FRONTEND_URL
//         ].filter(Boolean); // Remove any undefined values
        
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ["GET", "POST", "OPTIONS"],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'https://mohitnaskar.netlify.app'
        ];
        
        // Check if environment variable exists and add it
        if (process.env.FRONTEND_URL) {
            allowedOrigins.push(process.env.FRONTEND_URL);
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`Origin ${origin} not allowed by CORS`);
            callback(null, false);
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Check if environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('ERROR: Missing email environment variables. Make sure EMAIL_USER and EMAIL_PASSWORD are set in your .env file.');
}

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify transporter connection
transporter.verify(function(error, success) {
    if (error) {
        console.error('Nodemailer connection error:', error);
    } else {
        //console.log('Nodemailer server is ready to send messages');
    }
});

app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const adminHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>📬 New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong><br>${message}</p>
        </div>
    `;

    const userHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Thank You for Contacting!</h2>
            <p>Dear ${name},</p>
            <p>I have received your message regarding "<strong>${subject}</strong>".</p>
            <p>Your message:</p>
            <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
                ${message}
            </blockquote>
            <p>I'll get back to you shortly.</p>
            <p>— Mohit Naskar</p>
        </div>
    `;

    const adminMailOptions = {
        from: process.env.EMAIL_USER,  // Use environment variable
        to: process.env.EMAIL_USER,    // Use environment variable
        subject: `New Contact from ${name}`,
        html: adminHtml,
    };

    const userMailOptions = {
        from: process.env.EMAIL_USER,  // Use environment variable
        to: email,
        subject: 'We Received Your Message!',
        html: userHtml,
    };

    // Send Admin Email
    transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email to admin:', error);
            return res.status(500).json({ success: false, error: 'Failed to send email to admin.' });
        }

        //console.log('Admin email sent:', info.response);

        // Send User Acknowledgment Email
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Error sending acknowledgment email to user:', error);
                return res.status(500).json({ success: false, error: 'Failed to send acknowledgment email.' });
            }

            //console.log('Acknowledgment email sent:', info.response);
            res.status(200).json({ success: true, message: 'Emails sent successfully!' });
        });
    });
});

// Serve static files if needed
// app.use(express.static('public'));


// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle all routes to serve index.html (for SPA-like behavior)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.listen(PORT, () => {
    //console.log(`Server is running on port ${PORT}`);
});
