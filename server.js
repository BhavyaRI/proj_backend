const express = require('express');
const app = require('./app.js');

console.log("Starting server...");
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});