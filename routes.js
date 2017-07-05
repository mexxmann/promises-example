const path = require('path');
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

/**
 *
 */


/**
 * Returns some flight details given a customer email address
 * @param {string} customerEmail - the customer who's ID to look up
 * @return {Promise} - the flight details (asynchronously)
 */
function getDeparture(customerEmail) {
  return new Promise((resolve, reject) => {
    if (customerEmail === 'bob@gmail.com') {
      console.log(`After a delay, will be looking up departure details for customer with email: ${customerEmail}`);
      setTimeout(() => {
        resolve({
          flightId: 7,
          flightTime: new Date(2017, 7, 1, 13, 0, 0),
        });
      }, 100);
    } else {
      reject('Sorry, we only serve one customer - bob@gmail.com');
    }
  });
}

function getFlightDetails(flightId) {
  return new Promise((resolve, reject) => {
    if (flightId === 7) {
      console.log(`After a delay, will be looking up flight details for flight ID: ${flightId}`);
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
      }, 100);
    } else {
      reject('Sorry, we only know about one flight Id: 7');
    }
  });
}

function getPilotSchedule(pilotId) {
  return new Promise((resolve, reject) => {
    if (pilotId === 99) {
      console.log(`After a delay, will be looking up pilot schedule for pilot ID: ${pilotId}`);
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
    console.log(`After a delay, will be looking up forcast for date: ${date}`);
    setTimeout(() => {
      resolve({
        weatherOutlook: 'good',
      });
    }, 100);
  });
}

function getFlightEta(weatherOutlook, flightPath) {

}

router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

router.get('/departures/:userEmail/flightDetails/pilotSchedule', (req, res) => {
  userEmail = req.params.userEmail;
  console.log(`userEmail: ${userEmail}`);
  getDeparture(userEmail).then((departure) => {
    console.log(`getDeparture promise resolved with: ${JSON.stringify(departure)}`);
    return getFlightDetails(departure.flightId);
  })
  .then((flightDetails) => {
    console.log(`getFlightDetails promise resolved with: ${JSON.stringify(flightDetails)}`);
    return getPilotSchedule(flightDetails.pilotId);
  })
  .then((pilotSchedule) => {
    console.log(`getPilotSchedule promise resolved with: ${JSON.stringify(pilotSchedule)}`);
    return res.status(200).send(pilotSchedule);
  })
  .catch((err) => {
    console.log(`Caught exception: ${String(err)}`);
    return res.status(500).send(err);
  });
});


module.exports = router;
