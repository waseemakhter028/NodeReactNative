 const  { Router }  = require('express')
 const imageUploadRouter  =  require('./imageupload')

const router = Router()

router.use('/image',imageUploadRouter)


module.exports = router