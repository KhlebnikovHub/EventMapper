const router = require('express').Router();
const { Place } = require('../db/models');

router.route('/create')
  .get(async (req, res) => {
    try {
      res.render('place/create_place')
    } catch (error) {
      console.log(error);
      return res.sendStatus(500).end();
    }
  })
  .post(async (req, res) => {
    try {
      console.log(req.body);
      const { name, address, time_work, site, latitude, longitude } = req.body;
      const user_id = req.session.passport.user.local_id;
      const newPlace = await Place.create({ name, address, time_work, site, latitude, longitude, user_id });
      return res.json(newPlace);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500).end();
    }
  })

router.route('/my')
  .get(async (req, res) => {
    try {
      res.render('place/my')
    } catch (error) {
      console.log(error);
      return res.sendStatus(500).end();
    }
  })
  .post(async (req, res) => {
    try {
      const user_id = req?.session?.passport?.user?.local_id;
      const allPlaces = await Place.findAll({ where: { user_id } });
      return res.json(allPlaces);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500).end();
    }
  })


module.exports = router;
