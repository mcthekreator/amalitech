const userController = require("../controllers/user.controller")
router.get('/users', userController.getAllUsers)
router.post('/register', userController.registerUser)

router.post('/login', userController.login)



module.exports = router