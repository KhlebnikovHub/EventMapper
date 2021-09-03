const router = require('express').Router();
const { Place, Event } = require('../db/models');
const { Op } = require('sequelize');  

router.route('/create')
  .get(async (req, res) => {
    try {
      res.render('event/create_event')
    } catch (error) {
      console.log(error);
      return res.sendStatus(500).end();
    }
  })
  .post(async (req, res) => {
    try {
      const { event_name: name, description, date, place_name } = req.body;
      console.log('>>>>REQ.BODY', req.body);
      console.log('>>>>>REQ.SESSION', req.session);  
      const user_id = req?.session?.passport.user.local_id;
      const ourPlace = await Place.findOne({ where: { name: place_name } });
      console.log('>>>>> Place', ourPlace);
      const newEvent = await Event.create({ name, description, user_id, place_id: ourPlace.id, date });
      return res.json(newEvent);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500).end();
    }
  })

  router.route('/one/:eventId/')
    .get(async (req, res) => {
      try {
        const event_id = req.params.eventId;
        const oneEvent = await Event.findByPk(event_id)
        res.render('event/one', { oneEvent });  
      } catch (error) {
        console.log(error);
        return res.sendStatus(500).end();
      }
    })
    .delete(async (req, res) => {
      try {
        const event_id = req.params.eventId;
        const deleted = Event.destroy({ where: { id: event_id } });
        return res.json({ deleted }) 
      } catch (error) {
        console.log(error);
        return res.sendStatus(500).end();
      }
    })

    router.route('/last')
    .get(async (req, res) => {
      try {
          const user_id = req.session.passport.user.local_id;
          const lastEvents = await Event.findAll({ order: [['date', 'DESC']], where: { user_id, date: { [Op.lt]: new Date(), } }, limit: 6 })
        res.render('event/last', { lastEvents });
      } catch (error) {
        console.log(error);
        return res.sendStatus(500).end();
      }
   
    });

    router.route('/future')
    .get(async (req, res) => {
      try {
          const user_id = req.session.passport.user.local_id;
          const futureEvents = await Event.findAll({ order: [['date', 'ASC']], where: { user_id, date: { [Op.gt]: new Date(), } }, limit: 6 })
        res.render('event/future', { futureEvents });
      } catch (error) {
        console.log(error);
        return res.sendStatus(500).end();
      }
   
    });

    router.route('/map')
    .get(async (req, res) => {
      try {
         

        res.render('event/map_event')


      } catch (error) {
        console.log(error);
        return res.sendStatus(500).end();
      }
   
    });

    router.route('/map/all')
  .get(async (req, res) => {
    try {
      res.render('event/map_all')
    } catch (error) {
      console.log(error);
      return res.sendStatus(500).end();
    }
  })
  .post(async (req, res) => {
    try {
      const { place_name: name } = req.body;
      const ourPlace = await Place.findOne({ where: { name }}); 
      const placeEvents = await Event.findAll({ where: { place_id: ourPlace.id } });
      console.log(placeEvents);  
      return res.json(placeEvents);

    } catch (error) {
      console.log(error);
      return res.sendStatus(500).end();
    }
  })


module.exports = router;
