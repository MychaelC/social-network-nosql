const router = require('express').Router();

const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');


router.use('/user', userRoutes);
router.user('/thoughts', thoughtRoutes);

module.exports = router;