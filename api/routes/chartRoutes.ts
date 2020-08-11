import Express from 'express'
import chartsController from '../controllers/chartsController'

const router = Express.Router()

router.get('/1-week/:date', chartsController.week)
router.get('/1-month/:date', chartsController.month)
router.get('/3-month/:date', chartsController.quarter)
router.get('/1-year/:date', chartsController.week)

export default router
