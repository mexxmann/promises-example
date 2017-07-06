const express = require('express');
const myModel = require('./modelcb');
const util = require('./util');

const router = express.Router();

router.get('/departures/:userEmail/flightDetails/passengerManifest', (req, res) => {
  userEmail = req.params.userEmail;
  util.logWithDate(`[Callback Mode] userEmail: ${userEmail}`);
  try {
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
  } catch (err) {
    util.logWithDate(`[Callback Mode] Caught <-> exception: ${String(err)}`);
    return res.status(500).send(String(err));
  }
});

router.get('/departures/:userEmail/flightDetails/eta', (req, res) => {
  userEmail = req.params.userEmail;
  util.logWithDate(`[Callback Mode] userEmail: ${userEmail}`);
  try {
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
  } catch (err) {
    util.logWithDate(`[Callback Mode] Caught exception: ${String(err)}`);
    return res.status(500).send(String(err));
  }
});

module.exports = router;
