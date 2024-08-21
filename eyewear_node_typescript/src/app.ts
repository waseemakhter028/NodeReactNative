import express, { Request, Response, Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from './interfaces/controller.interface';
import { errorPageNotMiddleware, genericErrorHandler } from './middleware/error.middleware';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';

class App {
  public express: Application;
  public port: number;
  public host: string;

  constructor(controllers: Controller[], port: number, host: string) {
    this.express = express();
    this.port = port;
    this.host = host;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware(): void {
    this.express.use(
      helmet({
        crossOriginResourcePolicy: false,
      }),
    );
    this.express.use(cors());
    this.express.options('*', cors());
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json({ limit: '2mb' }));
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(
      compression({
        level: 6,
        threshold: 10 * 100,
        filter: (req: Request, res: Response) => {
          if (req.headers['x-no-compression']) {
            return false;
          }
          return compression.filter(req, res);
        },
      }),
    );
    this.express.set('views', path.join(__dirname, '../views'));
    this.express.set('view engine', 'ejs');
    this.express.use(express.static(path.join(__dirname, '../public')));
    this.express.use(fileUpload());
  }

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      if (controller.path != '/') this.express.use('/api/v1', controller.router);
      else this.express.use('/', controller.router);
    });
  }

  public initialiseErrorHandling(): void {
    this.express.use(errorPageNotMiddleware);
    this.express.use(genericErrorHandler);
  }

  private async initialiseDatabaseConnection(): Promise<void> {
    const { MONGO_URI } = process.env;
    const uri: string = String(MONGO_URI);
    try {
      await mongoose.connect(uri);
      console.log('MONGODB CONNECTED SUCCESSFULLY!');
    } catch (error: any) {
      console.log('Mongo Connection Error: ' + error);
    }
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`Server up successfully - host: ${this.host} port: ${this.port}`);
    });
  }
}

export default App;
