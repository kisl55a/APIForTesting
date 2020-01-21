const express = require('express');
const router = express.Router();
const user = require('../models/user');
const sensor = require('../models/sensor')

const isAuth = require("../middlewares/isAuth");

user.createTableUsers();
sensor.createTableSensors();

router.get("/:id?", function(req, res, next) {
  if (req.params.id) {
    user.getById(req.params.id, {
      then: rows => {
        res.status(202).json( rows );
      },
      catch: err => {
        res.status(500).json( err );
      }
    });
  } else {
    user.get({
      then: rows => {
        res.status(202).json(rows);
      },
      catch: err => {
        res.status(500).json(err);
      }
    });
  }
});

router.post("/signIn", async function(req, res, next) {
  console.log(req.body);
  const data = await user.login(req.body);
  if (data.code == 1) {
    res
      .status(202)
      .header("x-auth-token", data.token)
      .json({id: data.id, token: data.token});
  } else {
    res.status(403).json({ ...data });
  }
});

router.post('/', function(req, res) {
  user.add(req.body,{
    then: rows => {
      res.status(201).json('User created successfully')
    },
    catch: err => {
      res.status(401).json('Incorrect data')
    }
  })
});
router.delete('/:id', function(req, res, next) {
  book.delete(req.params.id, function(err, count) {
    if (err) {
      res.json(err);
    } else {
      res.json(count);
    }
  });
});
router.put("/:id", isAuth, function(req, res, next) {
  user.update(req.params.id, req.body, {
    then: rows => {
      res.status(200).json("The data was changed succesfully" );
    },
    catch: err => {
      res.status(500).json( err );
    }
  });
});

router.post('/sensor', isAuth, function(req, res) {
  // console.log('req.user.id: ', req.user.id, req.body);
  // userData = { ...req.user }
  sensor.add(req.user.id, req.body, {
    then: rows => {
      // console.log('rows: ', rows);
      res.status(201).json({idSensor: rows[0]})
    },
    catch: err => {
      res.status(401).json('Incorrect data')
    }
  })
});

router.get('/s/sensor', isAuth, function(req, res) {
  console.log('req.user.id: ', req.user.id);
  // userData = { ...req.user }
  sensor.get(req.user.id, {
    then: rows => {
      // console.log('rows: ', rows);
      res.status(201).json(rows)
    },
    catch: err => {
      res.status(401).json('Something is wrong')
    }
  })
});

// router.put('/s/sensor', isAuth, function(req, res) {
//   console.log('req.user.id: ', req.user.id);
//   // userData = { ...req.user }
//   sensor.get(req.user.id, {
//     then: rows => {
//       // console.log('rows: ', rows);
//       res.status(201).json(rows)
//     },
//     catch: err => {
//       res.status(401).json('Something is wrong')
//     }
//   })
// });

module.exports = router;
