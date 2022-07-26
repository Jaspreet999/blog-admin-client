const express = require('express')

const blogController = require('../controller/blogController')
const userController = require('../controller/userController')
const commentController = require('../controller/commentController')

const router = express.Router()

router.get('/',userController.login_user)
router.post('/',userController.post_login_user)

router.get('/login',userController.login_user)
router.post('/login',userController.post_login_user)

router.get('/sign_up',userController.signup_user)
router.post('/sign_up',userController.post_signup_user)

router.get('/createblog',blogController.create_blog)
router.post('/createblog',blogController.post_create_blog)

router.get('/home',blogController.get_home)
router.get('/home/:id/view',blogController.get_view)
router.post('/home/:id/view',commentController.sent_comment)

router.get('/home/:id/update',blogController.get_update)
router.post('/home/:id/update',blogController.put_update)

router.get('/home/:id',blogController.put_delete)
router.get('/home/:id/visibility',blogController.update_visibility)



module.exports = router