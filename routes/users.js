const express = require('express');
const router = express.Router();
const user = require('../models/user');
const sensor = require('../models/sensor')
const validator = require('validator')

const isAuth = require("../middlewares/isAuth");

user.createTableUsers();
sensor.createTableSensors();

router.get("/:id?", function (req, res, next) {
  if (req.params.id) {
    user.getById(req.params.id, {
      then: rows => {
        res.status(202).json(rows);
      },
      catch: err => {
        res.status(500).json(err);
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

router.post("/signIn", async function (req, res, next) {
  console.log(req.body);
  if (req.body.username.trim() !== "" && req.body.password.trim()) {
    const data = await user.login(req.body);
    if (data.code == 1) {
      res
        .status(202)
        .header("x-auth-token", data.token)
        .json({ id: data.id, token: data.token });
    } else {
      res.status(403).json('Incorrect user or password');
    }
  } else {
    res.status(500).json('Incorrect data')
  }

});

router.post('/', function (req, res) {
  if (req.body.username.trim() !== "" &&
  req.body.password.trim() !== "" &&
  req.body.country.trim() !== "" &&
  req.body.name.trim() !== "" &&
  req.body.city.trim() !== "" &&
  req.body.email.trim() !== "" &&
  req.body.dateOfBirth.trim() !== "" &&
  req.body.country.trim() !== "" &&
  validator.isEmail(req.body.email)){
    user.add(req.body, {
      then: rows => {
        res.status(201).json('User created successfully')
      },
      catch: err => {
        res.status(401).json('Incorrect data')
      }
    })
  } else {
    res.status(401).json('Incorrect input')
  }

});

router.put("/:id", isAuth, function (req, res, next) {
  user.update(req.params.id, req.body, {
    then: rows => {
      res.status(200).json("The data was changed succesfully");
    },
    catch: err => {
      res.status(500).json(err);
    }
  });
});

router.post('/sensor', isAuth, function (req, res) {

  if (req.body.deviceType.trim() !== "" &&
  req.body.description.trim() !== "" &&
  req.body.sensorType.trim() !== "" &&
  (req.body.location.latitude) &&
  (req.body.location.longitude)) {
    sensor.add(req.user.id, req.body, {
      then: rows => {
        // console.log('rows: ', rows);
        res.status(201).json({ idSensor: rows[0] })
      },
      catch: err => {
        res.status(401).json('Incorrect data')
      }
    })
} else {
  res.status(401).json('Incorrect input')
  
}

});

router.get('/s/sensor', isAuth, function (req, res) {
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
