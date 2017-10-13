const path = require('path')
const express = require('express')
const app = express()

app.use('/static', express.static('static'))
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/static/index.html')
})

app.listen(8080);