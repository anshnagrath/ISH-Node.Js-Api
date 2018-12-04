import { mail } from './mail.model';
import { Router, Request, Response } from "express";
import { resObj } from "../common/resObj";
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
export class MailRouter {
    private router: Router = Router();
    public getRouter(): Router {
        this.router.post("/email", this.createUser);
        return this.router;
    }

    createUser = async function (request: Request, response: Response) {
        try {
            console.log(request.body, 'body')
            const sendmail = function () {
                let name = `Hey you have a message from ${request.body.name}:`
                let email = `Email:${request.body.email}`;
                let phone = `Phone Number:${request.body.mobileNumber}`;
                let message = `Message:${request.body.message}`;
                var mailContent = "<center><table class='body-wrap' style='text-align:center;width:86%;font-family:arial,sans-serif;border:12px solid rgba(126, 122, 122, 0.08);border-spacing:4px 20px;'>\
            <tr><img src='https://u.imageresize.org/v2/4b2d5227-78ed-48a1-ae27-0d6d8a990f4b.png' style='width:50%;height:70%'></tr>\
            <tr>\
                <td>\
                    <center>\
                        <table bgcolor='#FFFFFF' width='80%'' border='0'>\
                            <tbody>\
                                <tr style='text-align:center;color:#575252;font-size:14px;'>\
                                    <td>\
                                        <span><h3>"+ decodeURIComponent(name) + "<h3></span>\
                                         <span><h3>"+ decodeURIComponent(email) + "<h3></span>\
                                          <span><h3>"+ decodeURIComponent(phone) + "<h3></span>\
                                           <span><h3>"+ decodeURIComponent(message) + "<h3></span>\
                                    </td>\
                                </tr>\
                            </tbody>\
                        </table>\
                        </center>\
                    </td>\
            </tr>\
        </table></center>";
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "anshnagrath448@gmail.com", // Your gmail address.
                        pass: "wezzy33beat",
                    }
                });
                var mailOptions = {
                    from: "anshnagrath448@gmail.com",
                    to: 'anshnagrath448@gmail.com',
                    subject: `Message from ${request.body.name}`,
                    generateTextFromHTML: true,
                    html: mailContent
                }

                transporter.sendMail(mailOptions, function (error, response) {
                    if (response) {
                        console.log(response);
                        return response.status(200).send(resObj('200', 'mailsent successfully', 'ok'));
                    }
                    if (error) {
                        console.log(error);
                        return response.status(400).send(resObj('400', 'error occured', error))
                    }
                });

            }();
            return response.status(200).send(resObj('200', 'mailSent successfully', 'ok'));
        } catch (e) {
            return response.status(400).send(resObj('400', 'error occured', e));
        }
    }
}