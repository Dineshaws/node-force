import { Router, Request, Response, NextFunction } from 'express';
import currentConnection from '../sfConnectionHandler';
import * as _ from 'underscore';
import * as async from 'async';

export class MetaDataRouter {
    router: Router

    /**
     * Initialize the OpportunityRouter
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/', this.metadataCreate);
        this.router.get('/show', this.showMetaData);
    }

    /**
     * 
     create metadata
    */
    metadataCreate(req, res, next) {
        console.log("metadata create api call here", req.body);
        async.waterfall([
            // create metadata here
            function (callback) {
                // creating metadata in array
                var metadata = [{
                    fullName: req.body.fullName,
                    label: req.body.label,
                    description: req.body.description,
                    frameHeight: 600,
                    mobileReady: false,
                    motif: 'Custom53: Bell',
                    url: req.body.url,
                    urlEncodingKey: 'UTF-8',
                }];
                console.log("metadata ",JSON.stringify(metadata))
                currentConnection.metadata.create('CustomTab', metadata, function (err, results) {
                    if (err) {
                        console.error("ERROR here in create metadata", JSON.stringify(err));
                        return callback(err);
                    } else if(results && results.hasOwnProperty("errors") && results.hasOwnProperty("success") && !results.success) {
                        console.error("ERROR here in create metadata in else part", results);
                        const errorMgs = results.errors.message || "Error found";
                        return callback(errorMgs);
                    } else {
                        console.log("success create results", JSON.stringify(results));
                        callback(null);
                    }
                });
            },
            // read metadata from profile
            function (callback) {
                let fullNames = ['Admin'];
                currentConnection.metadata.read('Profile', fullNames, function (err, metadata) {
                    if (err) {
                        console.error("Error in meta data read ", JSON.stringify(err));
                        return callback(err);
                    } else {
                        console.log("success read result ");
                        callback(null, metadata);
                    }
                });
            },
            //update metadata of profile, push to tabVisibilities
            function (metadata, callback) {
                let newMetaData = new Object();
                let newTabVisibilities = new Array();
                newTabVisibilities.push({ "tab": req.body.fullName, "visibility": "DefaultOn" }); // adding one more tabVisibilities
                newMetaData["fullName"] = metadata.fullName;
                newMetaData["tabVisibilities"] = newTabVisibilities;
                console.log("modified newMetaData ", JSON.stringify(newMetaData));
                currentConnection.metadata.update('Profile', newMetaData, function (err, results) {
                    if (err) {
                        console.error("Error in meta data update 1", JSON.stringify(err));
                        return callback(err);
                    } else {
                        console.log("success update result", JSON.stringify(results));
                        callback(null);
                    }
                });
            },
            // fetch customApp data here
            function (callback) {
                var fullNames = ['standard__Sales'];
                currentConnection.metadata.read('CustomApplication', fullNames, function (err, metadata) {
                    if (err) {
                        console.error("Error in meta data read customApp ", JSON.stringify(err));
                        return callback(err);
                    } else {
                        console.log("success fetched meta data here -- ", JSON.stringify(metadata));
                        callback(null, metadata);
                    }
                });
            },
            // update customApp data here
            function (metadata, callback) {
                if (metadata.hasOwnProperty("tab") && Array.isArray(metadata.tab)) {
                    metadata.tab.push(req.body.fullName);
                    currentConnection.metadata.update('CustomApplication', metadata, function (err, results) {
                        if (err) {
                            console.error("Error in meta data update customApp ", JSON.stringify(err));
                            return callback(err);
                        } else {
                            console.log("success update customApp meta data here -- ", JSON.stringify(metadata));
                            callback(null);
                        }
                    });
                } else {
                    console.log("no tab data  -- ", JSON.stringify(metadata));
                    callback(null);
                }
            }
        ], function (error) {
            if (error) {
                res.status(400).send({type:"error", message: 'Error while adding metadata.', error: error });
            } else {
                res.status(200).send({ type:"success",message: 'Successfully added.'});
            }
        });
    }


    /**
     * show meta data in dashboard forcefully
     */
    showMetaData(req, res, next) {
        console.log("metadata show  api call here", req.body);
        async.waterfall([
            // fetch customApp data here 4th
            function (callback) {
                var fullNames = ['standard__Sales'];
                currentConnection.metadata.read('CustomApplication', fullNames, function (err, metadata) {
                    if (err) {
                        console.error("Error in meta data read customApp 2", JSON.stringify(err));
                        return callback(err);
                    } else {
                        console.log("success fetched meta data here -- 2", JSON.stringify(metadata));
                        callback(null, metadata);
                    }
                });
            },
            // update customApp data here 4th
            function (metadata, callback) {
                if (metadata.hasOwnProperty("tab") && Array.isArray(metadata.tab)) {
                    currentConnection.metadata.update('CustomApplication', metadata, function (err, results) {
                        if (err) {
                            console.error("Error in meta data update customApp 2", JSON.stringify(err));
                            return callback(err);
                        } else {
                            console.log("success update customApp meta data here 2-- ", JSON.stringify(metadata));
                            callback(null);
                        }
                    });
                } else {
                    console.log("no tab data  -- ", JSON.stringify(metadata));
                    callback(null);
                }
            }
        ], function (error) {
            if (error) {
                res.status(400).send({type:"error", message: 'Error while showing metadata.', error: error });
            } else {
                res.status(200).send({ type:"success",message: 'Successfully showing.'});
            }
        });
    }
}

//create object and export router
const metaDataRouter = new MetaDataRouter();
metaDataRouter.init();

export default metaDataRouter.router;