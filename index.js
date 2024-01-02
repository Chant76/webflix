import 'dotenv/config';
import express from 'express';
import path from 'path';
import session from 'express-session';
import flash  from 'express-flash-messages';
import { fileURLToPath } from 'url';
import routes from './app/routes.js';



const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();


//--------------------------------------------------------------------
//      Mise en place du moteur de template
//--------------------------------------------------------------------
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

app.use(express.urlencoded({extended: false}))
//--------------------------------------------------------------------
//      Mise en place du répertoire static
//--------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
    secret: process.env.APP_KEY, resave:false, saveUninitialized:false, 
    cookie: {maxAge: 3600000} 

}));

app.use((req, res, next) => {
    if(process.env.APP === 'dev') {
        req.session.a2f = true;
    }
    next();
})
//--------------------------------------------------------------------
//      Chargement des routes
//--------------------------------------------------------------------
routes(app);

//--------------------------------------------------------------------
//     Ecoute du serveur HTTP
//--------------------------------------------------------------------
app.listen(process.env.PORT,() => {
    console.log(`Le serveur est démarré : http://localhost:${process.env.PORT}`);
});