import Express from 'express'
import recordsController from '../controllers/recordsController'

const router = Express.Router()

router.get('/:date', recordsController.show)
router.get('/month/:date', recordsController.month)
router.post('/', recordsController.create)
router.put('/:id', recordsController.update)
router.delete('/', recordsController.deleteAll)
router.delete('/:id', recordsController.delete)

export default router
