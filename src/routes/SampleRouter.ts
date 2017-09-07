import {Router, Request, Response, NextFunction} from 'express';
const Samples = require('../data');

export class SampleRouter {
  router: Router
  
  /**
   * Initialize the SampleRouter
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
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
  }

  /**
   * GET all Samples.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    res.send(Samples);
  }

  /**
   * GET one sample by id
   */
  public getOne(req: Request, res: Response, next: NextFunction) {
    let query = parseInt(req.params.id);
    let sample = Samples.find(sample => sample.id === query);
    if (sample) {
      res.status(200)
        .send({
          message: 'Success',
          status: res.status,
          sample
        });
    }
    else {
      res.status(404)
        .send({
          message: 'No sample found with the given id.',
          status: res.status
        });
    }
  }
}

// Create the SampleRouter, and export its configured Express.Router
const sampleRoutes = new SampleRouter();
sampleRoutes.init();

export default sampleRoutes.router;
