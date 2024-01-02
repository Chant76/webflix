import bcrypt from 'bcryptjs';
import { selectByUsername } from "../repository/UserRepository.js";
import jwt  from 'jsonwebtoken';
import Cookies from 'cookies';
export function get(req, res) {
    res.render('connexion');
}

export function post(req, res) {
    let error;
    selectByUsername(req.body.usename).then((user) => {
        if(user !== null) {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                console.log(`Youhou les infos de connexion sont correctes, on va maintenir la connexion avec un JWT`)
                let accessToken = jwt.sign({username: user.username, a2f: user.a2f}, process.env.JWT_SECRET, {expiresIn: 604800});       
                new Cookies(req,res).set('access_token', accessToken, {httpOnly: true, secure: (process.env.APP_ENV === 'production') });
                req.flash('notify', 'Votre compte a bien été créé.');
                return res.redirect('/admin')
            } else {
                error = `Echec d'identification.`
            }
        } else {
            error = `Auncun compte n'existe avec cet identifiant.`
        }
        res.render('connexion', { error });
    })
    
}
export function ConnectionControllerDeconnect(req, res) {
    new Cookies(req,res).set('access_token',"", {maxAge: Date.now()});
    req.flash('notify', 'Vous êtes maintenant déconnecté');
    return res.redirect('/');
}

