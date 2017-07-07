/**
 * @file The functions in this module contain the re-usable business logic for the flight examples
 * using promises
 */

const util = require('./util');

/**
 * Returns some departure details given a customer email address
 * @param {string} customerEmail - the customer who's ID to look up
 * @return {Promise} - the departure details (asynchronously)
 */
function getDeparture(customerEmail) {
  return new Promise((resolve, reject) => {
    if (customerEmail === 'bob@gmail.com') {
      util.logWithDate(`Making database or network call to look up departure details for \
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

/**
 * Returns flight details given a flight Id
 * @param {int} flightId - identifies the flight
 * @return {Promise} - the flight details (asynchronously)
 */
function getFlightDetails(flightId) {
  return new Promise((resolve, reject) => {
    if (flightId === 7) {
      util.logWithDate(`Making database or network call to look up flight details for flight ID: ${flightId}`);
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
          manifestId: 99,
        });
      }, 2000);
    } else {
      reject('Sorry, we only know about one flight Id: 7');
    }
  });
}

/**
 * Resolves an airport code to an airport name
 * @param {string} airportCode - the airport code to resolve
 * @return {Promise} - the airport name (asynchronously)
 */
function resolveAirportCode(airportCode) {
  return new Promise((resolve, reject) => {
    const sleepTime = Math.floor((Math.random() * 2000) + 1000);
    const validCodes = ['YEG', 'YYC', 'DEN'];
    const mapping = {
      YEG: 'Edmonton',
      YYC: 'Calgary',
      DEN: 'Denver',
    };

    util.logWithDate(`Resolving airportCode [${airportCode}] taking [${sleepTime} ms]`);

    if (validCodes.includes(airportCode)) {
      setTimeout(() => {
        resolve(mapping[airportCode]);
      }, sleepTime);
    } else {
      reject(`Sorry. We only fly to ${validCodes}`);
    }
  });
}

/**
 * Returns a passenger manifest given the manifest ID
 * @param {int} manifestId - identifies the manifest
 * @return {Promise} - the passenger manifest (asynchronously)
 */
function getPassengerManifest(manifestId) {
  return new Promise((resolve, reject) => {
    if (manifestId === 99) {
      util.logWithDate(`Making database or network call to look up manifest with ID: ${manifestId}`);
      setTimeout(() => {
        resolve({
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
      reject('Sorry, we only know about one Manifest Id: 99');
    }
  });
}

/**
 * Returns the weather outlook (good/bad) given a timestamp
 * @param {date} date - the time of weather to look up
 * @return {Promise} - the weather details (asynchronously)
 */
function getForecast(date) {
  return new Promise((resolve) => {
    util.logWithDate(`Making database or network call to look up forcast for date: ${date}`);
    setTimeout(() => {
      resolve({
        weatherOutlook: 'good',
      });
    }, 100);
  });
}

/**
 * Returns a flight's ETA given it's flight path and weather outlook
 * @param {string} weatherOutlook - the weather outlook (good/bad)
 * @param {object} flightPath - an array of flight segments
 * @return {Promise} - the ETA (asynchronously)
 */
function getFlightEta(weatherOutlook, flightPath) {
  return new Promise((resolve) => {
    util.logWithDate(`Making database or network call to look up eta for Flight with path: \
${JSON.stringify(flightPath)} under weather condition: ${weatherOutlook}`);
    setTimeout(() => {
      resolve({
        eta: new Date(2017, 7, 1, 17, 0, 0),
      });
    }, 2000);
  });
}

module.exports = {
  getDeparture,
  getFlightDetails,
  getPassengerManifest,
  resolveAirportCode,
  getForecast,
  getFlightEta,
};
