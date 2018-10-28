import { auth } from './auth.model';
import { Router, Request, Response } from "express";
import { resObj } from "../common/resObj";
import { config } from '../common/auth';
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcryptjs');
export class AuthRouter {
    private router: Router = Router();
    public getRouter(): Router {
        this.router.post("/auth", this.createUser);
        this.router.put("/auth", this.updateUserPassword);
        this.router.get("/auth", this.getUser);
        this.router.get('/auth/facebook', passport.authenticate('facebook'));
        this.router.get('/auth/facebook/callback', passport.authenticate('facebook', { sucessRedirect: '/api/auth', failureRedirect: '/api/auth' }))
        passport.use(new FacebookStrategy({
            clientID: config.facebookAuth.clientId,
            clientSecret: config.facebookAuth.clientSecret,
            callbackURL: config.facebookAuth.callbackUrl,
        }, function (accessToken, referenceToken, profile, done) {
            process.nextTick(async function () {
                let user = auth.findOne({ email: profile.id })
                if (user) done(null, user);
                else {
                    let newUser = await auth.create({
                        email: profile.emails[0].value,
                        password: accessToken,
                        name: profile.name.givenName + " " + profile.name.familyName
                    })
                    if (newUser) done(null, newUser)
                    else done();
                }
            })
        }));
        return this.router;
    }

    createUser = async function (request: Request, response: Response) {
        try {
            console.log(request.body, 'kuch aya facebook se = ======>')
            if (request.body) {
                let userexist = await auth.findOne({ email: request.body.email });
                if (userexist) response.status(200).send(resObj(400, 'user Already exist', 'null'))
                else {
                    let data = await saveUser(request.body);

                    if (data) {
                        data['password'] = null;
                        console.log(data.password, 'loook')
                        response.status(200).send(resObj(200, 'saved sucessfully', data))
                    }
                    else response.status(200).send(resObj(400, 'error while saving', 'null'))

                }
            }
        } catch (error) {
            console.error(error, 'error while saving')
            response.status(200).send(resObj(400, 'error while saving', error))
        }
    }
    getUser = async function (request: Request, response: Response) {
        try {
            console.log(request.headers, 'sdfsdfd')
            if (request.headers['email']) {
                // console.log(request.headers['email'], 'check tthis out')
                let User = await auth.findOne({ email: request.headers['email'] });

                if (User) {
                    let compare = bcrypt.compareSync(request.headers.password, User.password);
                    if (compare) response.status(200).send(resObj('200', 'user found', User))
                }
            }
            else { response.status(200).send(resObj('400', 'user not  found', 'null')) }
        } catch (e) {
            console.error(e, 'error caught')
            response.status(200).send(resObj('400', 'user not  found', 'null'))
        }
    }
    updateUserPassword = async function (request: Request, response: Response) {
        try {
            if (request.body) {

                const userData = await auth.findOne({ email: request.body.email })
                let compare = bcrypt.compareSync(request.body.oldPassword, userData.password);
                if (compare) {
                    let data = await saveUser(request.body, true);
                    console.log(data, 'check this out')
                    if (data) {
                        delete data.password;
                        response.status(200).send(resObj(200, 'updated sucessfully', data))
                    } else { response.status(200).send(resObj(404, 'error while updating', 'null')) }

                }
            }
        } catch (e) {
            console.log(e, 'error while fetching')
            response.send(resObj(400, "Error occurred", null))
        }
    }
}
async function saveUser(data, update?) {
    let salt = bcrypt.genSaltSync(10);
    let pass;
    data.password ? pass = data.password : pass = data.newPassword;
    let hash = bcrypt.hashSync(pass, salt);
    data['password'] = hash
    console.log("hashedPAssword", hash);
    if (update) {
        let dat = auth.findOneAndUpdate({ email: data.email }, data, { upsert: true });
        return dat;
    }
    else {
        let savedData = await auth.create(data);
        return savedData;
    }
}