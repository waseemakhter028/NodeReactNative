import { Router, Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';

class RootController implements Controller {
  public path = '/';
  public router = Router();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}/`, this.index);
  }

  private async index(req: Request, res: Response): Promise<void> {
    res.send('Working Server!');
  }
}

export default RootController;
