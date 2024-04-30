
import { Router } from 'express'
import multer from 'multer'
import { save } from '../../../controllers/ImageUpload.controller.js'
import { storage } from '../../../middlewares/upload.js'

const router = Router()
const upload = multer({ storage: storage })

router.post('/save',  upload.single('filename'), save)

export default router