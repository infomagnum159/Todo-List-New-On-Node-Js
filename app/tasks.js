const express = require('express');
const Task = require('../models/Task');
const auth = require("../middleware/auth");
const router = express.Router();


router.get('/', auth, async (req, res) => {
    try {
        const users = await Task.find({name: req.user.name});

        res.send(users);
    } catch (e) {
        res.sendStatus(500);
    }

});

router.post('/', auth, async (req, res) => {

      if(!req.body.title || !req.body.status) {
          return res.status(400).send({error: 'Data not valid'});
      }
      const taskData = {
          name: req.user._id,
          title: req.body.title,
          description: req.body.description || null,
          status: req.body.status,
      }
      const task = new Task(taskData);
    try {
        await task.save();
      return res.send(task);
    }catch (e) {
        return res.status(400).send(e);
    }
});

module.exports = router;