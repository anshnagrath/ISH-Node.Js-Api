import { agentLocation } from './agentsLocation.model';
import { Router, Request, Response } from "express";
import { resObj } from "../common/resObj";
export class TackingRouter {
    private router: Router = Router();
    public getRouter(): Router {
        this.router.get("/track", this.track);
        this.router.put("/track", this.updateLocation);
        return this.router;
    }
    track = async function (request: Request, response: Response) {

        try {
            const allMaterials = await agentLocation.find({});
            console.log(allMaterials, 'check material')
            if (allMaterials) response.send(resObj('200', "ok", allMaterials));
            response.send(resObj('404', 'error fetcing data', null));
        } catch (error) {
            console.log(error, 'error occured');
            response.send(resObj(400, "Error occurred", error))
        }
    }
    updateLocation = async function (request: Request, response: Response) {
        try {
            if (request.body.mobile) {
                const updatedData = await agentLocation.findByIdAndUpdate({ mobile: request.body.mobile }, { $set: request.body }, { new: true })
                if (updatedData) response.send(resObj('200', "ok", updatedData));
                else response.send(resObj(400, "Error occurred", null))
            }
        } catch (e) {
            console.log(e, 'error while fetching')
        } response.send(resObj(400, "Error occurred", null))
    }
}