import { config } from 'dotenv-safe';
config()
import express from 'express';
const app = express()


app.get('/', async (req, res) => {
    res.send('working server')
  })

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