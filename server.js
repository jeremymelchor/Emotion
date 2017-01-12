/** Initialisation server variables **/
let express = require('express');
let session = require('express-session');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');

/** Variables **/
let pseudo = null;
let listUsers = {
    gw: [],
    debate: []
};

app.set('view engine', 'ejs');

// To use scripts, css .. in html files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
    pseudo = req.params.pseudo;
    res.render('lobby.ejs', {pseudo: req.params.pseudo});
    req.session.pseudo = req.params.pseudo;
    console.log(req.session.pseudo);
});

app.post('/chat/*', (req, res) => {
    res.render('chat.ejs', {pseudo: req.body.pseudo, room: req.body.room});
});

/********************
 * SOCKET ***********
 *******************/
io.on('connection', function (socket) {

    //console.log("nouveau client : !" + pseudo);

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

    socket.on('disconnection', function(data){
        var index = listUsers[data.room].indexOf(data.pseudo);
        listUsers[data.room].splice(index, 1);
        console.log('disconnect: list users:');
        console.log(listUsers);
        io.sockets.in(data.room).emit('list users', listUsers[data.room]);
        io.sockets.in(data.room).emit('user left', data.pseudo);
    });

    socket.on('disconnect', function (data) {
        console.log('A user disconnected');
    });
});


http.listen(3000, () => {
    console.log('Listening on port 3000');
});
