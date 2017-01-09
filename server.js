/** Initialisation server variables **/
let express = require('express');
let session = require('express-session');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

/** Variables **/
let pseudo = '';
let listUsers = [];

app.set('view engine', 'ejs');

// To use scripts, css .. in html files
app.use(express.static(__dirname + '/public'));

// To store sessions values
app.use(session({
    secret: 'chat',
    resave: false,
    saveUninitialized: true
}));

/** **************
 * ROUTES*********
 * ***************/
app.get('/', (req, res) => {
    res.render('index', pseudo);
});

app.get('/lobby/:pseudo', (req, res) => {
    pseudo = req.params.pseudo;
    res.render('lobby.ejs', {pseudo: req.params.pseudo});
    req.session.pseudo = req.params.pseudo;
});

app.get('/chat/:pseudo', (req, res) => {
    pseudo = req.params.pseudo;
    res.render('chat.ejs', {pseudo: req.params.pseudo});
    req.session.pseudo = req.params.pseudo;
});

/********************
 * SOCKET ***********
 *******************/
io.on('connection', function (socket) {

    console.log("nouveau client : !" + pseudo);

    // fired when the server receive a message from a client
    socket.on('chat message', (res) => {
        io.emit('chat message', res);
    });

    if (pseudo) {
        if (listUsers.includes(pseudo) == false) {
            listUsers.push(pseudo);
            console.log(listUsers);
        }
        io.emit('list users', listUsers);
    }
    socket.on('disconnect', function () {
        console.log('A user disconnected');
        var index = listUsers.indexOf(pseudo);
        listUsers.splice(index, 1);
        console.log(listUsers);

    });

});


http.listen(3000, () => {
    console.log('Listening on port 3000');
});
