const path = require('path');
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

function logWithDate(message) {
  console.log(`${new Date()}: ${message}`);
}

/**
 * Returns some flight details given a customer email address
 * @param {string} customerEmail - the customer who's ID to look up
 * @return {Promise} - the flight details (asynchronously)
 */
function getDeparture(customerEmail, cb) {
  if (customerEmail === 'bob@gmail.com') {
    logWithDate(`Making database or network call to look up departure details for \
customer with email: ${customerEmail}`);
    setTimeout(() => {
      cb({
        flightId: 7,
        flightTime: new Date(2017, 7, 1, 13, 0, 0),
      });
    }, 2000);
  } else {
    throw new Error('Sorry, we only serve one customer - bob@gmail.com');
  }
}

function getFlightDetails(flightId, cb) {
  if (flightId === 7) {
    logWithDate(`Making database or network call to look up flight details for flight ID: ${flightId}`);
    setTimeout(() => {
      cb({
        flightPath: [
          {
            origin: 'YEG',
            destination: 'YYC',
            distanceKm: 300,
          },
          {
            origin: 'YYC',
            destination: 'DEN',
            distanceKm: 1753,
          },
        ],
        pilotId: 99,
      });
    }, 2000);
  } else {
    throw new Error('Sorry, we only know about one flight Id: 7');
  }
}

function getPilotSchedule(pilotId, cb) {
  if (pilotId === 99) {
    logWithDate(`Making database or network call to look up pilot schedule for pilot ID: ${pilotId}`);
    setTimeout(() => {
      cb({
        schedule: [
          {
            flightTime: new Date(2017, 7, 1, 13, 0, 0),
            origin: 'YEG',
          },
          {
            flightTime: new Date(2017, 7, 1, 14, 0, 0),
            origin: 'DEN',
          },
        ],
      });
    }, 100);
  } else {
    throw new Error('Sorry, we only know about one Pilot Id: 99');
  }
}

function getForecast(date, cb) {
  logWithDate(`Making database or network call to look up forcast for date: ${date}`);
  setTimeout(() => {
    cb({
      weatherOutlook: 'good',
    });
  }, 100);
}

function getFlightEta(weatherOutlook, flightPath, cb) {
  logWithDate(`Making database or network call to look up eta for Flight with path: ${JSON.stringify(flightPath)} \
under weather condition: ${weatherOutlook}`);
  setTimeout(() => {
    cb({
      eta: new Date(2017, 7, 1, 17, 0, 0),
    });
  }, 2000);
}

router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

router.get('/departures/:userEmail/flightDetails/pilotSchedule', (req, res) => {
  userEmail = req.params.userEmail;
  logWithDate(`userEmail: ${userEmail}`);
  try {
    getDeparture(userEmail, (departure) => {
      getFlightDetails(departure.flightId, (flightDetails) => {
        getPilotSchedule(flightDetails.pilotId, (pilotSchedule) => {
          res.status(200).send(pilotSchedule);
        });
      });
    });
  } catch (err) {
    logWithDate(`Caught <-> exception: ${String(err)}`);
    return res.status(500).send(String(err));
  }
});

router.get('/departures/:userEmail/flightDetails/eta', (req, res) => {
  userEmail = req.params.userEmail;
  logWithDate(`userEmail: ${userEmail}`);
  try {
    getDeparture(userEmail, (departure) => {
      getFlightDetails(departure.flightId, (flightDetails) => {
        getForecast(departure.flightTime, (forecast) => {
          getFlightEta(forecast.weatherOutlook, flightDetails.flightPath, (flightEta) => {
            logWithDate(`getFlightEta promise resolved with: ${JSON.stringify(flightEta)}`);
            return res.status(200).send(flightEta);
          });
        });
      });
    });
  } catch (err) {
    logWithDate(`Caught --- exception: ${String(err)}`);
    return res.status(500).send(String(err));
  }
});

module.exports = router;
