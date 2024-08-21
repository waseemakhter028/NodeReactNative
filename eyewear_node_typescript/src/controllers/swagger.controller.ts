import { Router } from 'express';
import Controller from '../interfaces/controller.interface';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

class SwaggerController implements Controller {
  public path = '/docs';
  public router = Router();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.use(`${this.path}`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}

export default SwaggerController;
