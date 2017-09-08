import {Router, Request, Response, NextFunction} from 'express';
import currentConnection from '../sfConnectionHandler';
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
