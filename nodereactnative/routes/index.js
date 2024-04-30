import { Router }  from 'express'
import routesV1 from './v1/index.js'

const router = Router()

router.use('/', routesV1)

export default router
