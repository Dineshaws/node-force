import {Router, Request, Response, NextFunction} from 'express';
import currentConnection from '../sfConnectionHandler';
import * as _ from 'underscore';
export class OpportunityRouter {
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
    this.router.get('/get', this.get);
    this.router.get('/create_metadata', this.metadataCreate);
  }


  /**
     * 
     create metadata
     */
  metadataCreate(req, res, next) {
    console.log("metadata call here");

    // creating metadata in array
    // var metadata = [{
    //   fullName: 'JituTab',
    //   label: 'Jitu URL Tab',
    //   description: 'created Using JSForce API',
    //   frameHeight: 600,
    //   mobileReady: false,
    //   motif: 'Custom53: Bell',
    //   url: 'http://www.google.com',
    //   urlEncodingKey: 'UTF-8',
    // },
    // {
    //   fullName: 'MinuTab',
    //   label: 'Minu URL Tab',
    //   description: 'created Using JSForce API',
    //   frameHeight: 600,
    //   mobileReady: false,
    //   motif: 'Custom53: Bell',
    //   url: 'http://www.google.com',
    //   urlEncodingKey: 'UTF-8',
    // }
    // ];
    // console.log("here");
    // currentConnection.metadata.create('CustomTab', metadata, function (err, results) {
    //   if (err) {
    //     console.error("ERROR here in create metadata", err);
    //   }
    //   console.log("results", JSON.stringify(results));
    //   for (var i = 0; i < results.length; i++) {
    //     var result = results[i];
    //     console.log('success ? : ' + result.success);
    //     console.log('fullName : ' + result.fullName);
    //   }
    // });

    // var fullNames = ['Admin'];
    // currentConnection.metadata.read('Profile', fullNames, function (err, metadata) {
    //   if (err) {
    //     console.error("Error in meta data read ", err);
    //   } else {
    //     console.log("fetched meta data here -- ", JSON.stringify(metadata));



    //     let newMetaData = new Object();
    //     let newTabVisibilities = new Array();
    //     newTabVisibilities.push({ "tab": "MinuTab", "visibility": "DefaultOn" }); // adding one more tabVisibilities
    //     newMetaData["fullName"] = metadata.fullName;
    //     newMetaData["tabVisibilities"] = newTabVisibilities;
    //     //console.log("modified visibility ",JSON.stringify(metadata["tabVisibilities"]));
    //     console.log("modified newMetaData ", JSON.stringify(newMetaData));

    //     currentConnection.metadata.update('Profile', newMetaData, function (err, results) {
    //       if (err) {
    //         console.error(err);
    //       } else {
    //         console.log("success in");
    //         console.log("results ", JSON.stringify(results))
    //       }

    //     });

    //   }

    // });









    // var fullNames = ['standard__Sales'];
    // currentConnection.metadata.read('CustomApplication', fullNames, function (err, metadata) {
    //   if (err) {
    //     console.error("Error in meta data read ", err);
    //   } else {
    //     console.log("fetched meta data here -- ", JSON.stringify(metadata));



        // let newMetaData = new Object();
        // let newTabVisibilities = new Array();
        // newTabVisibilities.push({ "tab": "MinuTab", "visibility": "DefaultOn" }); // adding one more tabVisibilities
        // newMetaData["fullName"] = metadata.fullName;
        // newMetaData["tabVisibilities"] = newTabVisibilities;
        //console.log("modified visibility ",JSON.stringify(metadata["tabVisibilities"]));
        // console.log("modified newMetaData ", JSON.stringify(newMetaData));
        // metadata.tab.push("MinuTab");
        //delete metadata.defaultLandingTab;
        let metadata = {"fullName":"standard__Sales","defaultLandingTab":"standard-home","tab":["standard-Chatter","standard-Campaign","standard-Lead","standard-Account","standard-Contact","standard-Opportunity","standard-ForecastItem","standard-AdvForecast","standard-Forecasting3","standard-Contract","standard-Order","MinuTab"]};
        currentConnection.metadata.update('CustomApplication', metadata, function (err, results) {
          if (err) {
            console.error(err);
          } else {
            console.log("success in");
            console.log("results ", JSON.stringify(results))
          }

        });

    //   }

    // });
  }

  /**
   * GET login.
   */
  public get(req: Request, res: Response, next: NextFunction) {
    var query = "SELECT Id, Name FROM Opportunity"
    currentConnection.query(query, function(err, results) {
      if (err) {
        return res.status(400)
        .send({
          message: 'Error found while fetching Opportunity.',
          error: err
        });
      }
      console.log("Query: " + results.totalSize);
      if(results.hasOwnProperty('done') && results.done) {
        res.status(200)
        .send({
          message: 'Successfully found.',
          records: results.records
        });
      } else {
        res.status(404)
        .send({
          message: 'No Opportunity found.'
        });
      }
    });
  }

}

// Create the OpportunityRouter, and export its configured Express.Router
const opportunityRoutes = new OpportunityRouter();
opportunityRoutes.init();

export default opportunityRoutes.router;
