const util = require('./util');

function getDeparture(customerEmail, cb) {
  if (customerEmail === 'bob@gmail.com') {
    util.logWithDate(`[Callback Mode] Making database or network call to look up departure details for \
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
    util.logWithDate(`[Callback Mode] Making database or network call to look up flight details for flight ID: ${flightId}`);
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
        manifestId: 99,
      });
    }, 2000);
  } else {
    throw new Error('Sorry, we only know about one flight Id: 7');
  }
}

function getPassengerManifest(manifestId, cb) {
  if (manifestId === 99) {
    util.logWithDate(`[Callback Mode] Making database or network call to look up manifest with ID: ${manifestId}`);
    setTimeout(() => {
      cb({
        manifest: [
          {
            PassengerName: 'Bob Mckenzie',
            gender: 'M',
          },
          {
            PassengerName: 'Rose Swanger',
            gender: 'F',
          },
        ],
      });
    }, 100);
  } else {
    throw new Error('Sorry, we only know about one Manifest Id: 99');
  }
}

function getForecast(date, cb) {
  util.logWithDate(`[Callback Mode] Making database or network call to look up forcast for date: ${date}`);
  setTimeout(() => {
    cb({
      weatherOutlook: 'good',
    });
  }, 100);
}

function getFlightEta(weatherOutlook, flightPath, cb) {
  util.logWithDate(`[Callback Mode] Making database or network call to look up eta for Flight with path: ${JSON.stringify(flightPath)} \
under weather condition: ${weatherOutlook}`);
  setTimeout(() => {
    cb({
      eta: new Date(2017, 7, 1, 17, 0, 0),
    });
  }, 2000);
}

module.exports = {
  getDeparture,
  getFlightDetails,
  getPassengerManifest,
  getForecast,
  getFlightEta,
};