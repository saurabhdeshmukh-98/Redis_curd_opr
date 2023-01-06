const router = require("express").Router();
const redisContro=require('../controller/redisContro');

router.post('/save',redisContro.add);
router.get('/all',redisContro.fetch);
router.delete('/move',redisContro.remove);
router.put('/updatedata',redisContro.modify);

module.exports=router