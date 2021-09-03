const router = require('express').Router();
const { Event, Place, User } = require('../db/models');
const { Op } = require('sequelize');

const { initUser } = require('../middlewares/initUser');


router.route('/')
  .get(initUser, async (req, res) => {
    try {
      if (req?.session?.passport) {
        res.locals.name = req.session.passport.user.displayName;
        res.locals.img = req.session.passport.user.photos[0].value;
      }
        const user_id = req.session.passport.user.local_id;
        var myDate = new Date('2016-06-18 05:18:27')
        console.log('THIS DATE>>>>>>>>>', new Date())
        const futureEvents = await Event.findAll({ order: [['date', 'ASC']], where: { user_id, date: { [Op.gt]: new Date(), } }, limit: 6 })
        const lastEvents = await Event.findAll({ order: [['date', 'DESC']], where: { user_id, date: { [Op.lt]: new Date(), } }, limit: 6 })
        console.log('future EVENTS >>>>>>>>>>>>>>>>>', futureEvents);

      res.render('index', { futureEvents, lastEvents });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500).end();
    }
 
  });

  
module.exports = router;
