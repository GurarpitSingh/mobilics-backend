const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://gurarpitsingh2:kanavpreet@cluster0.gth6rj4.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to database');
})
.catch(() => {
    console.log('Connection failed');
}
);

