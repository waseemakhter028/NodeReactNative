
import { Router } from 'express'
// import multer from 'multer'
import { save } from '../../../controllers/ImageUpload.controller.js'
// import { storage, fileFilter, limits } from '../../../middlewares/upload.js'
import { fileUpload } from '../../../middlewares/fileUpload.js'

const router = Router()



// const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits,})

const upload = fileUpload()

function uploadMiddleware(req, res, next) {
    try {
        upload.single('filename')(req, res, function(err) {
            if(err) res.status(400).json({status: 'error', message: err.message})
            else next()
        })
    } catch (error) {
        res.status(400).json({status: 'error', message: 'fileVaidation Error'})
    }
}



router.post('/save',  uploadMiddleware, save)

export default router