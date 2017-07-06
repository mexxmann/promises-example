const express = require('express');
const myModel = require('./model');
const util = require('./util');

const router = express.Router();

router.get('/pyramidOfDoom/:userEmail/', (req, res) => {
  const userEmail = req.params.userEmail;

  // 1. Get user's departure details
  myModel.getDeparture(userEmail)
  .then((results) => {
      myModel.getFlightDetails(results.flightId)
      .then((results) => {
        myModel.getPassengerManifest(results.manifestId)
        .then((results) => {
          return res.status(200).send(results);
        });
      });
  })

  // Handle any errors
  .catch((err) => {
    util.logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(String(err));
  });
});


router.get('/forEach/bad1/:userEmail/', (req, res) => {
  const userEmail = req.params.userEmail;

  myModel.getDeparture(userEmail)
  .then((departure) => { return departure.flightId; })
  .then(myModel.getFlightDetails)
  .then((flightDetails) => {
    return new Promise((resolve, reject) => {
      const results = [];
      util.logWithDate(`flight Details: ${JSON.stringify(flightDetails.flightPath)}`);
      flightDetails.flightPath.forEach((currentHop) => {
        myModel.resolveAirportCode(currentHop.origin)
        .then((resolvedAirportCode) => {
          results.push(resolvedAirportCode);
        });
      });
      resolve(results);
    });
  })
  .then((resolvedAirportCodes) => {
    util.logWithDate(`We resolved airport codes: [${resolvedAirportCodes}]`);
    return res.status(200).send(resolvedAirportCodes);
  })
  .catch((err) => {
    util.logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(String(err));
  });
});

router.get('/forEach/bad2/:userEmail/', (req, res) => {
  const userEmail = req.params.userEmail;

  myModel.getDeparture(userEmail)
  .then((departure) => { return departure.flightId; })
  .then(myModel.getFlightDetails)
  .then((flightDetails) => {
    return new Promise((resolve, reject) => {
      const results = [];
      util.logWithDate(`flight Details: ${JSON.stringify(flightDetails.flightPath)}`);
      flightDetails.flightPath.forEach((currentHop) => {
        myModel.resolveAirportCode(currentHop.origin)
        .then((resolvedAirportCode) => {
          results.push(resolvedAirportCode);
          resolve(results);
        });
      });
    });
  })
  .then((resolvedAirportCodes) => {
    util.logWithDate(`We resolved airport codes: [${resolvedAirportCodes}]`);
    return res.status(200).send(resolvedAirportCodes);
  })
  .catch((err) => {
    util.logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(String(err));  
  });
});

router.get('/forEach/good/:userEmail/', (req, res) => {
  const userEmail = req.params.userEmail;

  myModel.getDeparture(userEmail)
  .then((departure) => { return departure.flightId; })
  .then(myModel.getFlightDetails)
  .then((flightDetails) => {
    util.logWithDate(`flight Details: ${JSON.stringify(flightDetails.flightPath)}`);
    return Promise.all(flightDetails.flightPath.map((currentHop) => {
      return myModel.resolveAirportCode(currentHop.origin);
    }));
  })
  .then((resolvedAirportCodes) => {
    return res.status(200).send(resolvedAirportCodes);
  })
  .catch((err) => {
    util.logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(String(err));  
  });
});

module.exports = router;
