import HomeController from "../src/controllers/HomeController.js";
import AdminController from "../src/controllers/AdminController.js";
import MovieController from "../src/controllers/MovieController.js";
import BddController from "../src/controllers/BddController.js";
import { get as connectionControllerGet, post as ConnectionControllerPost, ConnectionControllerDeconnect} from '../src/controllers/ConnectionController.js';
import {userExists, controlJWT}from '../src/services/jwtService.js';
import  QRCode  from "qrcode";
import { authenticator } from 'otplib';
//console.log(authenticator.generateSecret());

export default (app) => {
    app.use('/', userExists);
     /**
     * Gérer le JWT pour toutes les urls commencant par /admin
     */
    app.use('/admin', controlJWT);

    app.get('/movies',HomeController.index);

    app.get('/',HomeController.index);

    app.get('/connexion',connectionControllerGet);

    app.post ('/connexion', ConnectionControllerPost);
    app.post ('/deconnexion', ConnectionControllerDeconnect);
    
    app.get('/admin', AdminController)

    app.get('/admin/toto', AdminController)
    app.get('/admin/movie/:id', MovieController)

    app.post('/admin/movie/:id', BddController)

    app.get('/qrcode', (req, res) => {
    
        QRCode.toDataURL(authenticator.keyuri(req.user, 'webflix', process.env.SECRET_2FA), (err, url) => {
            if (err) res.redirect('/');
            res.render('qrcode', { 
                qr: url, 
                account: `webflix`,
                key: process.env.SECRET_2FA
            })
        }); 
    });

    app.get('/2fa-valid', (req, res) => { 
        if(req.session.a2f != undefined && req.session.a2f) {
            return res.redirect('/admin')
        }
        res.render('2fa'); 
    });
    app.post('/2fa-valid', (req, res) => {
        try {
            const isValid = authenticator.check(req.body.number_2fa, process.env.SECRET_2FA);
            // si c'est valide, on peut connecter l'utilisateur
            if(isValid) {
                req.session.a2f = true;
                res.redirect('/admin')
            } else {
                // si non valide, recharger la page du formulaire 2FA
                res.render('2fa', {statut: 'error'});
            }
        } catch (err) {
            res.render('2fa', {statut: 'error'});
        }
    });

    
};
