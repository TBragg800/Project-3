const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./models/user");

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
}

// authorization to protect end points
passport.use(new JwtStrategy({
    jwtFromRequest : cookieExtractor,
    secretOrKey : "Air Bob!"
}, (payload, done) => {
    User.findById({_id : payload.sub}, (err, user) => {
        if (err)
            return done(err, false);
        if (user)
        return done(null, user);
        else
            return done(null, false);
    });
}));

// authenticated local strategy using name and password
passport.use(new LocalStrategy((name, password, done) => {
    User.findOne({name}, (err, user)=> {
        //something went wrong with database
        if (err)
            return done(err);
        //if no user exist
        if (!user)
            return done(null, false);
        //check if password is correct
        user.comparePassword(password, done);
    });
}));