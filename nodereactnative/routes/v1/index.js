import  { Router } from 'express'
import imageUploadRouter from './imageupload/index.js'

const router = Router()

router.use('/image',imageUploadRouter)


export default router