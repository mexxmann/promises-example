/**
 * @file The examples in this file show usages of callbacks that result in the 'pyramid of doom'
 *
 * It accomapnies the Chaining and Simulaneous Execution slides from
 * https://docs.google.com/presentation/d/1J8O8S1gJnGjPy7jyPHwU-otrtRprD4qTp-ZYzIDfFj0
 */

const express = require('express');
const myModel = require('./modelcb');
const util = require('./util');

const router = express.Router();

router.get('/departures/:userEmail/flightDetails/passengerManifest', (req, res) => {
  userEmail = req.params.userEmail;
  util.logWithDate(`[Callback Mode] userEmail: ${userEmail}`);
  // 1. Get user's departure details
  myModel.getDeparture(userEmail, (departure) => {

    // 2. Use departure details to get flight details
    myModel.getFlightDetails(departure.flightId, (flightDetails) => {

      // 3. Use flight details to get Passenger Manifest
      myModel.getPassengerManifest(flightDetails.manifestId, (passengerManifest) => {

        // Return the result
        res.status(200).send(passengerManifest);
      }, (error) => {
        return res.status(500).send(String(error));
      });
    }, (error) => {
      return res.status(500).send(String(error));
    });
  }, (error) => {
    return res.status(500).send(String(error));
  });
});

router.get('/departures/:userEmail/flightDetails/eta', (req, res) => {
  userEmail = req.params.userEmail;
  util.logWithDate(`[Callback Mode] userEmail: ${userEmail}`);
  // 1. Get user's departure details
  myModel.getDeparture(userEmail, (departure) => {

    // 2. Use departure details to get flight details (note cannot get flight and weather simulaneously)
    myModel.getFlightDetails(departure.flightId, (flightDetails) => {

      // 3. Use departure details to get weather details (note cannot get flight and weather simulaneously)
      myModel.getForecast(departure.flightTime, (forecast) => {

        // 3. Use flight details and weather to get ETA
        myModel.getFlightEta(forecast.weatherOutlook, flightDetails.flightPath, (flightEta) => {

          // Return the result
          util.logWithDate(`[Callback Mode] getFlightEta promise resolved with: ${JSON.stringify(flightEta)}`);
          return res.status(200).send(flightEta);
        }, (error) => {
          return res.status(500).send(String(error));
        });
      }, (error) => {
        return res.status(500).send(String(error));
      });
    }, (error) => {
      return res.status(500).send(String(error));
    });
  }, (error) => {
    return res.status(500).send(String(error));
  });
});

module.exports = router;
