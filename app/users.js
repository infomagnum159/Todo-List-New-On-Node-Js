const express = require('express');
const User = require('../models/User');
const auth = require("../middleware/auth");
const router = express.Router();



router.post('/', async (req, res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        res.status(400).send({error: 'Data not valid'});
    }
    const userData = {username, password};
    try {
        const user = new User(userData);
        user.generateToken();
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})
router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user) {
        res.status(401).send({error: 'Username not found'});
    }
    const isMatch = await user.checkPassword(req.body.password);

    if(!isMatch) {
        res.status(401).send({error: 'Password is wrong'});
    }
    user.generateToken();
    await user.save();
    res.send({message: 'Username and password correct', user});
});
router.get('/secret', auth, async(req, res) => {

    res.send({message: 'Secret message', username: req.user.username});
});

module.exports = router;