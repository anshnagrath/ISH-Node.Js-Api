import { Product } from './product.model';
import { Router, Request, Response } from "express";
import { resObj } from "../common/resObj";
import { agentLocation } from "../agentsLocation/agentsLocation.model";
const axios = require('axios');

export class ProductRouter {
    private router: Router = Router();
    public getRouter(): Router {
        this.router.post("/product", this.saveProducts);
        return this.router;
    }
    saveProducts = async function (request: Request, response: Response) {

        try {

            //if (request.body.deliveryAddress)
            let fullAddress = request.body.deliveryAddress['lane'] + " " + request.body.deliveryAddress['city'] + " " + savedData.deliveryAddress['state'];
            var key = 'AIzaSyCTolWtOMGJI9Hcrm5IF__xStLMKjFfp7I'
            geocode(fullAddress, key);
            function geocode(address, key) {
                // var location = "22 Main street st Boston MA"
                try {
                    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&sensor=false&key=${key}`

                    ).then((res) => {
                        console.log('logging response', res);
                        var agentLocation = agentLocation.find({})
                        let deliveryLocs = res.geometry.location.lat + ',' + res.geometry.location.lng;
                        let endLocs = '';
                        for (let i = 0; i < agentLocation.length; i++) {
                            if (i == 0) {
                                endLocs = agentLocation[i].location.lat + ',' + agentLocation[i].location.lng;
                                continue;
                            }
                            endLocs = endLocs + '|' + agentLocation[i].workingLocation.lat + ',' + agentLocation[i].workingLocation.lng;
                        }
                        var distances = [];
                        axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + deliveryLocs + '&destinations=' + endLocs + '&mode=driving&language=en-US&key=AIzaSyDylu04j5J5oBm9vF9BB6hZtvVZKp24Jbw&units=metric', async function (error, result) {
                            JSON.parse(result.body).rows[0].elements.forEach(function (item) {
                                (item.distance) ? distances.push(item.distance.value) : distances.push(-1);
                            });
                            var min = Math.min.apply(Math, distances.filter((x) => x >= 0))
                            let a = distances.indexOf(min);
                            let nearestAgentLocation = deliveryLocs[a];

                            request.body['assignedAgentLocation'] = nearestAgentLocation;
                            var savedData = await Product.create(request.body);
                            if (savedData) response.status(200).send(resObj(200, 'agent assidgned', savedData));
                            else response.status(400).send(resObj(400, 'agent not  assidgned', null));
                        }).catch((e) => { console.log(e, 'promise catch') });
                    })
                } catch (e) {
                    console.log(e, 'errors')
                    response.status(400).send(resObj(400, 'agent not  assidgned', null));

                }

            }

        } catch (error) {
            console.log(error, 'error occured');
            response.send(resObj(400, "Error occurred", error))
        }
    }
}