import Express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import passportTwitter from 'passport-twitter'
import session from 'express-session'
import router from './routes'
import errorController from './controllers/ErrorController'
import { connect } from './db'

const twitterStrategy = passportTwitter.Strategy

connect()

const app = Express()

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: 'auto' }
  })
)
app.use(passport.initialize())
app.use(passport.session())
passport.use(
  new twitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT || 'test',
      consumerSecret: process.env.TWITTER_CLIENT_SECRET || 'test',
      callbackURL: process.env.BASE_URL + '/login'
    },
    function(token, tokenSecret, profile, done) {
      return done(null, profile)
    }
  )
)
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((obj, done) => {
  done(null, obj)
})
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())
app.use(cookieParser())
app.get('/api/auth/twitter', passport.authenticate('twitter'))
app.get(
  '/api/auth/twitter/callback',
  passport.authenticate('twitter'),
  (req, res) => {
    res.json({ user: req.user })
  }
)
app.use('/api', router)
app.use('/', errorController.errorHandler)

export default app
