/** Initialisation server variables **/
let express = require('express');
let session = require('express-session');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

/** Variables **/
let pseudo;
let listUsers = [];

// To use scripts, css .. in html files
app.use(express.static(__dirname + '/public'));

// To store sessions values
app.use(session({
    secret: 'chat',
    resave: false,
    saveUninitialized: true
}));

http.listen(3000, () => {
    console.log('Listening on port 3000');
});

/** ROUTES **/
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat/:pseudo', (req, res) => {
    pseudo = req.params.pseudo;
    res.render('chat.ejs', {pseudo: req.params.pseudo});
    //req.session.pseudo = req.params.pseudo;
});

/* Event fired when someone connect to the application. Fired only
 when we open a communication way with io() */
io.on('connection', function(socket) {

    console.log("nouveau client : !" + pseudo);

    // fired when the server receive a message from a client
    socket.on('chat message', (res) => {
        io.emit('chat message', res);
    });

    if (pseudo) {
        listUsers.push(pseudo);
        io.emit('list users', listUsers);
    }
});