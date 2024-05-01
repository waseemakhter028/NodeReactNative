import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser'
import path from 'path'
import helmet from 'helmet';
import compression from 'compression'
import cors from 'cors'
import {fileURLToPath} from 'url';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json' assert{ type: "json" }
import * as errorHandler from './middlewares/error-handler.js'
import Routes from './routes/index.js';
import connectDB from './config/db.js';

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.appRoot = path.join(__dirname)

connectDB()

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
)
app.use(
  compression({
    level: 6,
    threshold: 10 * 100,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false
      }
      return compression.filter(req, res)
    }
  })
)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.options('*', cors())
// Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// Api Routes
app.use('/', Routes)

app.get('/', async (req, res) => {
  res.send('working server')
})

// Error Middlewares
//404 not found handle
app.use(errorHandler.notFound)
// generic Error handler
app.use(errorHandler.genericErrorHandler)

//server configuration
const server = app.listen(process.env.PORT, async () => {
  console.log(`Server up successfully - host: ${process.env.HOST} port: ${process.env.PORT}`)
})

process.on('unhandledRejection', (err) => {
  console.log('possibly unhandled rejection happened')
  console.log(err.message)
})

const closeHandler = () => {
  // eslint-disable-next-line no-undef
  Object.values(connections).forEach((connection) => connection.close())

  server.close(() => {
    console.log('Server is stopped succesfully')
    process.exit(0) /* eslint-disable-line */
  })
}

process.on('SIGTERM', closeHandler)
process.on('SIGINT', closeHandler)