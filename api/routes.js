/**
 * @file The examples in this file show usages of promises and async/await syntax
 *
 * It accomapnies the Chaining and Simulaneous Execution slides from
 * https://docs.google.com/presentation/d/1J8O8S1gJnGjPy7jyPHwU-otrtRprD4qTp-ZYzIDfFj0
 */

const express = require('express');
const myModel = require('./model');
const util = require('./util');

/**
 * Given a user's email, uses this sequence:
 * getDeparture() -> getFlightDetails() -> getPassengerManifest()
 * to look up the passenger manifest.
 * @param {string} userEmail - user to look up
 * @return {object} - promise that resolves to the Passenger manifest
 */
function getPassengerManifestForUser(userEmail) {
  // 1. Get user's departure details
  return myModel.getDeparture(userEmail)

  // 2. Use departure details to get flight details
  .then((departure) => {
    return myModel.getFlightDetails(departure.flightId);
  })

  // 3. Use flight details to get Passenger Manifest
  .then((flightDetails) => {
    return myModel.getPassengerManifest(flightDetails.manifestId);
  })

  // Return the result
  .then((passengerManifest) => {
    return passengerManifest;
  })

  // Handle any errors.  Notice how error handling can be consolidated because the promise chain stops if there's
  // an exception.
  .catch((err) => {
    util.logWithDate(`getPassengerManifestForUser - Caught exception: ${String(err)}`);
    throw err;
  });
}

/**
 * Same as getPassengerManifestForUser except using async/await syntax
 * @param {string} userEmail - user to look up
 * @return {object} - promise that resolves to the Passenger manifest
 */
async function getPassengerManifestForUserUsingAsyncAwait(userEmail) {
  try {
    // 1. Get user's departure details
    const departure = await myModel.getDeparture(userEmail);

    // 2. Use departure details to get flight details
    const flightDetails = await myModel.getFlightDetails(departure.flightId);

    // 3. Use flight details to get Passenger Manifest
    const passengerManifest = await myModel.getPassengerManifest(flightDetails.manifestId);

    // Return the result
    util.logWithDate(`getPassengerManifest promise resolved with: ${JSON.stringify(passengerManifest)}`);
    return passengerManifest;

    // Handle any errors.  Notice how error handling can be consolidated because the promise chain stops if there's
    // an exception.
  } catch (err) {
    util.logWithDate(`getPassengerManifestForUserUsingAsyncAwait - Caught exception: ${String(err)}`);
    throw err;
  }
}

/**
 * Given a user's email, uses this sequence:
 * getDeparture() |-> getFlightDetails() |-> getFlightEta()
 *                |-> getForecast()      |
 * to look up user's ETA.
 * @param {string} userEmail - user to look up
 * @return {object} - promise that resolves to the Eta
 */
function getEtaForUser(userEmail) {
  // 1. Get user's departure details
  return myModel.getDeparture(userEmail)

  // 2. Use departure details to get flight and weather details simultaneously
  .then((departure) => {
    return Promise.all([
      myModel.getFlightDetails(departure.flightId),
      myModel.getForecast(departure.flightTime)]);
  })

  // 3. Use flight details and weather to get ETA
  .then(([flightDetails, forecast]) => {
    return myModel.getFlightEta(forecast.weatherOutlook, flightDetails.flightPath);
  })

  // Return the result
  .then((flightEta) => {
    util.logWithDate(`getFlightEta promise resolved with: ${JSON.stringify(flightEta)}`);
    return flightEta;
  })

  // Handle any errors.  Notice how error handling can be consolidated because the promise chain stops if there's
  // an exception.
  .catch((err) => {
    util.logWithDate(`getEtaForUser - Caught exception: ${String(err)}`);
    throw err;
  });
}

/**
 * Same as getEtaForUser except using async/await syntax
 * @param {string} userEmail - user to look up
 * @return {object} - promise that resolves to the Eta
 */
async function getEtaForUserUsingAsyncAwait(userEmail) {
  try {
    // 1. Get user's departure details
    const departure = await myModel.getDeparture(userEmail);

    // 2. Get the flight details and weather forecast simultaneously
    const asyncResults = await Promise.all([
      myModel.getFlightDetails(departure.flightId),
      myModel.getForecast(departure.flightTime)]);

    // 3. Use flight details and weather to get ETA
    const flightEta = await myModel.getFlightEta(asyncResults.weatherOutlook, asyncResults.flightPath);

    // Return the result
    util.logWithDate(`getFlightEta promise resolved with: ${JSON.stringify(flightEta)}`);
    return flightEta;

    // Handle any errors.  Notice how error handling can be consolidated because the promise chain stops if there's
    // an exception.
  } catch (err) {
    util.logWithDate(`getEtaForUserUsingAsyncAwait - Caught exception: ${String(err)}`);
    throw err;
  }
}

const router = express.Router();

router.get('/departures/:userEmail/flightDetails/passengerManifest', (req, res) => {
  userEmail = req.params.userEmail;
  util.logWithDate(`userEmail: ${userEmail}`);

  let func = getPassengerManifestForUser;
  if (req.query.useAsync) {
    util.logWithDate('Using async/await syntax');
    func = getPassengerManifestForUserUsingAsyncAwait;
  }

  func(userEmail).then((result) => {
    return res.status(200).send(result);
  }).catch((err) => {
    return res.status(500).send(err);
  });
});

router.get('/departures/:userEmail/flightDetails/eta', (req, res) => {
  userEmail = req.params.userEmail;
  util.logWithDate(`userEmail: ${userEmail}`);

  let func = getEtaForUser;
  if (req.query.useAsync) {
    util.logWithDate('Using async/await syntax');
    func = getEtaForUserUsingAsyncAwait;
  }

  func(userEmail).then((result) => {
    return res.status(200).send(result);
  }).catch((err) => {
    return res.status(500).send(err);
  });
});

module.exports = router;
