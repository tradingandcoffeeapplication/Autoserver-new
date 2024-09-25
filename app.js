const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const SocketsSchema = require('./models/sockets.model');
const Sockets = mongoose.model('socket', SocketsSchema); //שימוש במודל וסכמה של משתמש
const { localStrategyHandler, serializeUser, deserializeUser, isValid } = require('./passport');
const fileUpload = require('express-fileupload');
const UsersController = require('./controllers/usersController.js');
const EmailsController = require('./controllers/emailsController');
const positionsController = require('./controllers/positionsController');
const pdfController = require('./controllers/pdfController');
const usersSetupController = require('./controllers/usersSetupController');
const usersInfoController = require('./controllers/usersInfoController');
const usersSymbolsController = require('./controllers/usersSymbolsController');
const reportsController = require('./controllers/reportsController');
const exchangeController = require('./controllers/exchangesController');
const server = require("http").createServer(app);
const bodyParser = require('body-parser');
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const path = require('path');
const PORT = process.env.PORT || 4423;
const { mongoDBStoreConfig, cookiesConfig, mongooseConnection, passportConfig } = require('./config')
const dbString = "mongodb://adminnew:x8engX86cy8B@80.179.152.210:27018/TradingData?authSource=admin";
const cors = require('cors')

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true}));
app.use(cookieParser()); //שימוש בקוקיז
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload()); //אפשרות להעלות קבצים
app.use(cors());

app.use(session({ //שימוש בקוקיז פספורט סשן
    secret: 'Jovani123!$@#$',
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore(mongoDBStoreConfig),
    cookie: cookiesConfig,
}));



passport.use('local', new LocalStrategy(localStrategyHandler, passportConfig));
passport.serializeUser(serializeUser); //סיריאלייז למשתמש
passport.deserializeUser(deserializeUser); //דיסיריאלייז למשתמש

app.use(passport.initialize()); //שימוש בפספורט באפליקצייה
app.use(passport.session()); //שימוש בסשן באלפיקצייה


app.use('/auth', UsersController); // API של משתמשים
app.use('/emails', EmailsController); //API של הודעות
app.use('/positions', positionsController);
app.use('/usersSetup', usersSetupController);
app.use('/usersInfo', usersInfoController);
app.use('/usersSymbols', usersSymbolsController);
app.use('/pdf', pdfController);
app.use('/reports', reportsController);
app.use('/exchanges', exchangeController);

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public", "index.html"));
});

// app.use('*', isValid);


// io.of("/api/socket").on("connection", (socket) => {
//     console.log("socket.io: User connected: ", socket.id);

//     socket.on("disconnect", () => {
//         console.log("socket.io: User disconnected: ", socket.id);
//     });
// });

const init = async () => { //פונקצייה חכמה שמוודאת התחברות לדאטא בייס לפני הפעלת השרת
    try {
        await mongoose.connect(dbString, mongooseConnection);
        server.listen(PORT, (err) => { //הפעלת השרת
            console.log('server is up on port' + PORT);
        });

    } catch (err) { //במידה והתחברות נכשלה
        console.log(err);
    };
};

init();

const connection = mongoose.connection;

// connection.once("open", () => {
//     console.log('mongodb connected');
//     const changeStream = connection.collection("AutoUsersInfo").watch([], {
//         fullDocument: 'updateLookup'
//     });
//     changeStream.on('change', async (changes) => {
//         const { webId } = await Sockets.findOne({ user: changes.documentKey._id })
//         console.log(changes.documentKey._id, webId);
//         io.emit('mongoStream', changes);
//     });
// })
