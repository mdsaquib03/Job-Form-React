const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    college: {
        type: String,
        trim: true,
        required: true
    },
    year: {
        type: String,
        trim: true,
        required: true
    },
    aboutOpportunity: {
        type: String,  
        trim: true,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    resume: {
        type: String,
        trim: true
    },
    video: {
        type: String,
        trim: true,
        required: true
    }
});

formSchema.set('timestamps', true);

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
