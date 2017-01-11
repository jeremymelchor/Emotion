/** Initialisation server variables **/
let express = require('express');
let session = require('express-session');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

/** Variables **/
let pseudo = null;
let listUsers = {
    gw: [],
    debate: []
};

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
    req.params.pseudo = "";
    res.render('index', {pseudo: req.params.pseudo});
});

app.get('/lobby/:pseudo', (req, res) => {
    console.log(req.params.pseudo);
    pseudo = req.params.pseudo;
    res.render('lobby.ejs', {pseudo: req.params.pseudo});
    req.session.pseudo = req.params.pseudo;
});

app.get('/chat/:room', (req, res) => {
    res.render('chat.ejs', {pseudo: pseudo, room: req.params.room});
});

/********************
 * SOCKET ***********
 *******************/
io.on('connection', function (socket) {

    console.log("nouveau client : !" + pseudo);

    socket.on('joinRoom', function (data) {
        // send client to room 1
        console.log("joinroom");
        console.log(data);
        socket.join(data.room);
        //Tell all those in the room that a new user joined
        io.sockets.in(data.room).emit('user joined', data);

        if (listUsers[data.room].includes(data.pseudo) == false) {
            listUsers[data.room].push(data.pseudo);
            console.log('list users: ');
            console.log(listUsers[data.room]);
        }
        io.sockets.in(data.room).emit('list users', listUsers[data.room]);
    });

    // fired when the server receive a message from a client
    socket.on('chat message', function (data) {
        io.sockets.in(data.room).emit('chat message', data);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected');
        //var index = listUsers[data.room].indexOf(pseudo);
        //listUsers[data.room].splice(index, 1);
        console.log('disconnect: list users:');
        console.log(listUsers);
    });
});


http.listen(3000, () => {
    console.log('Listening on port 3000');
});
