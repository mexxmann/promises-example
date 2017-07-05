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
function getDeparture(customerEmail) {
  return new Promise((resolve, reject) => {
    if (customerEmail === 'bob@gmail.com') {
      logWithDate(`Making database or network call to look up departure details for \
customer with email: ${customerEmail}`);
      setTimeout(() => {
        resolve({
          flightId: 7,
          flightTime: new Date(2017, 7, 1, 13, 0, 0),
        });
      }, 2000);
    } else {
      reject('Sorry, we only serve one customer - bob@gmail.com');
    }
  });
}

function getFlightDetails(flightId) {
  return new Promise((resolve, reject) => {
    if (flightId === 7) {
      logWithDate(`Making database or network call to look up flight details for flight ID: ${flightId}`);
      setTimeout(() => {
        resolve({
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
      reject('Sorry, we only know about one flight Id: 7');
    }
  });
}

function getPilotSchedule(pilotId) {
  return new Promise((resolve, reject) => {
    if (pilotId === 99) {
      logWithDate(`Making database or network call to look up pilot schedule for pilot ID: ${pilotId}`);
      setTimeout(() => {
        resolve({
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
      reject('Sorry, we only know about one Pilot Id: 99');
    }
  });
}

function getForecast(date) {
  return new Promise((resolve, reject) => {
    logWithDate(`Making database or network call to look up forcast for date: ${date}`);
    setTimeout(() => {
      resolve({
        weatherOutlook: 'good',
      });
    }, 100);
  });
}

function getFlightEta(weatherOutlook, flightPath) {
  return new Promise((resolve, reject) => {
    logWithDate(`Making database or network call to look up eta for Flight with path: ${JSON.stringify(flightPath)} \
under weather condition: ${weatherOutlook}`);
    setTimeout(() => {
      resolve({
        eta: new Date(2017, 7, 1, 17, 0, 0),
      });
    }, 2000);
  });
}

router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

router.get('/departures/:userEmail/flightDetails/pilotSchedule', (req, res) => {
  userEmail = req.params.userEmail;
  logWithDate(`userEmail: ${userEmail}`);
  getDeparture(userEmail).then((departure) => {
    // logWithDate(`getDeparture promise resolved with: ${JSON.stringify(departure)}`);
    return getFlightDetails(departure.flightId);
  })
  .then((flightDetails) => {
    // logWithDate(`getFlightDetails promise resolved with: ${JSON.stringify(flightDetails)}`);
    return getPilotSchedule(flightDetails.pilotId);
  })
  .then((pilotSchedule) => {
    // logWithDate(`getPilotSchedule promise resolved with: ${JSON.stringify(pilotSchedule)}`);
    return res.status(200).send(pilotSchedule);
  })
  .catch((err) => {
    logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(err);
  });
});

router.get('/departures/:userEmail/flightDetails/eta', (req, res) => {
  userEmail = req.params.userEmail;
  logWithDate(`userEmail: ${userEmail}`);
  getDeparture(userEmail).then((departure) => {
    return Promise.all([
      getFlightDetails(departure.flightId),
      getForecast(departure.flightTime)]);
  })
  .then(([flightDetails, forecast]) => {
    return getFlightEta(forecast.weatherOutlook, flightDetails.flightPath);
  })
  .then((flightEta) => {
    logWithDate(`getFlightEta promise resolved with: ${JSON.stringify(flightEta)}`);
    return res.status(200).send(flightEta);
  })
  .catch((err) => {
    logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(err);
  });
});

module.exports = router;
