const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

// ── Google Strategy ───────────────────────────────────────────────────────────
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  '/api/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value
        const username = profile.displayName || profile.username || email.split('@')[0]

        // find existing user or create new one
        let user = await User.findOne({ email })

        if (user) {
            // existing user — update googleId if missing
            if (!user.googleId) {
                user.googleId = profile.id
                await user.save()
            }
        } else {
            // new user via Google
            user = await User.create({
                username,
                email,
                googleId: profile.id,
                password: null,
            })
        }

        return done(null, user)
    } catch (error) {
        return done(error, null)
    }
}))

// ── GitHub Strategy ───────────────────────────────────────────────────────────
passport.use(new GitHubStrategy({
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  '/api/auth/github/callback',
    scope: ['user:email'],
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`
        const username = profile.username || profile.displayName || email.split('@')[0]

        let user = await User.findOne({ email })

        if (user) {
            if (!user.githubId) {
                user.githubId = profile.id
                await user.save()
            }
        } else {
            user = await User.create({
                username,
                email,
                githubId: profile.id,
                password: null,
            })
        }

        return done(null, user)
    } catch (error) {
        return done(error, null)
    }
}))

module.exports = passport