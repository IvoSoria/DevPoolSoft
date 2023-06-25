const passport = require("passport")
const { Router } = require('express');
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const authRouter = Router();

function isLoggedIn(req, res, next) {
 if (req.user) {
   next();
 } else {
   res.redirect('/auth/google');
 }
}

//Esta es la ruta que tiene que ir en el boton para entrar
//a la autenticacion de google. Sería a barra auth o sea /auth
authRouter.get('/',
  passport.authenticate('google', { 
   scope: [ 'email', 'profile' ] }
));

passport.use(
 new GoogleStrategy({
   clientID: process.env.GOOGLE_CLIENTID_PASSPORT,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET_PASSPORT,
   //esta es la ruta que se puede cambiar a donde vuelve luego de iniciar sesion
   callbackURL: "http://localhost:3001/auth/google/callback",
   passReqToCallback: true
 },
   function (request, accessToken, refreshToken, profile, done) {
     // User_data.findOrCreate({ googleId: profile.id }, function (err, user) {
     //   return done(err, user);
     // });
     done(null, profile)
   }
 ));
passport.serializeUser((user, done) => {
 done(null, user)
})
passport.deserializeUser((user, done) => {
 done(null, user)
})

//ruta que deriva al volver del inicio de sesion a donde va
//si a protecte que es cuando inicia o failure cuando falla
authRouter.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/protected',
        failureRedirect: '/auth/google/failure'
}));

//ruta cuando ya estas iniciado sesion
authRouter.get('/google/protected', isLoggedIn, (req, res) =>{
 res.redirect('http://localhost:5173/home');
})

//ruta cuando falla el inicio de sesion
authRouter.get('/google/failure', isLoggedIn, (req, res) =>{
res.send ("Inicio de sesion fallido", error)
})

//ruta para desloguearte(habria que ponerla en un boton)
authRouter.use('/google/logout', (req, res) =>{
 req.session.destroy();
 res.redirect('http://localhost:5173/home');
})

module.exports = authRouter;