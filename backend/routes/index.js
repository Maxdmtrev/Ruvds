const express = require ('express');
const router = express.Router();
const Server = require ('../models/server');

router.route('/')
    .get(async (req, res) => {
      let allServer = await Server.find();
      res.setHeader('Access-Control-Allow-Origin', '*');
      await res.json(allServer);
    })
     .post (async (req, res) => {
       try {
         const work = new Server ({
           createDate: req.body.createDate,
           removeDate: ''
         });
          await work.save ();
          await res.json ({result: true});
       } catch (e) {
         return await res.json ({result: false, error: e});
       }
      })
    .put(async (req, res) => {
      try {
        const { removeDate, id } = req.body;
        await Server.findOneAndUpdate({_id: id}, {$set: {removeDate: removeDate}});
        await res.json({result: true});
      } catch (e) {
        return await res.json ({result: false, error: e});
      }
    })
    .delete(async(req, res) => {
      // console.log(req.body);
      const { id } = req.body;
      await Server.findOneAndDelete({_id: id});
      await res.json({result: true});
    });

module.exports = router;