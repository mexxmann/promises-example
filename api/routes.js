const express = require('express');
const myModel = require('./model');
const util = require('./util');

/**
 * Given a user's email, uses this sequence:
 * getDeparture() -> getFlightDetails() -> getPassengerManifest()
 * to look up the passenger manifest.
 * @param {string} userEmail - user to look up
 * @param {object} res - express result object
 */
function getPassengerManifestForUser(userEmail, res) {
  // 1. Get user's departure details
  myModel.getDeparture(userEmail)

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
    return res.status(200).send(passengerManifest);
  })

  // Handle any errors.  Notice how error handling can be consolidated because the promise chain stops if there's
  // an exception.
  .catch((err) => {
    util.logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(err);
  });
}

/**
 * Same as getPassengerManifestForUser except using async/await syntax
 * @param {string} userEmail - user to look up
 * @param {object} res - express result object
 * @return {object} - whatever res.status returns
 */
async function getPassengerManifestForUserUsingAsyncAwait(userEmail, res) {
  try {
    // 1. Get user's departure details
    const departure = await myModel.getDeparture(userEmail);

    // 2. Use departure details to get flight details
    const flightDetails = await myModel.getFlightDetails(departure.flightId);

    // 3. Use flight details to get Passenger Manifest
    const passengerManifest = await myModel.getPassengerManifest(flightDetails.manifestId);

    // Return the result
    util.logWithDate(`getPassengerManifest promise resolved with: ${JSON.stringify(passengerManifest)}`);
    return res.status(200).send(passengerManifest);

    // Handle any errors.  Notice how error handling can be consolidated because the promise chain stops if there's
    // an exception.
  } catch (err) {
    util.logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(err);
  }
}

/**
 * Given a user's email, uses this sequence:
 * getDeparture() |-> getFlightDetails() |-> getFlightEta()
 *                |-> getForecast()      |
 * to look up user's ETA.
 * @param {string} userEmail - user to look up
 * @param {object} res - express result object
 */
function getEtaForUser(userEmail, res) {
  // 1. Get user's departure details
  myModel.getDeparture(userEmail)

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
    return res.status(200).send(flightEta);
  })

  // Handle any errors.  Notice how error handling can be consolidated because the promise chain stops if there's
  // an exception.
  .catch((err) => {
    util.logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(err);
  });
}

/**
 * Same as getEtaForUser except using async/await syntax
 * @param {string} userEmail - user to look up
 * @param {object} res - express result object
 * @return {object} - whatever res.status returns
 */
async function getEtaForUserUsingAsyncAwait(userEmail, res) {
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
    return res.status(200).send(flightEta);

    // Handle any errors.  Notice how error handling can be consolidated because the promise chain stops if there's
    // an exception.
  } catch (err) {
    util.logWithDate(`Caught exception: ${String(err)}`);
    return res.status(500).send(err);
  }
}

const router = express.Router();

router.get('/departures/:userEmail/flightDetails/passengerManifest', (req, res) => {
  userEmail = req.params.userEmail;
  util.logWithDate(`userEmail: ${userEmail}`);

  const useAsync = req.query.useAsync;
  if (useAsync) {
    util.logWithDate('Using async/await syntax');
    return getPassengerManifestForUserUsingAsyncAwait(userEmail, res);
  }

  return getPassengerManifestForUser(userEmail, res);
});

router.get('/departures/:userEmail/flightDetails/eta', (req, res) => {
  userEmail = req.params.userEmail;
  util.logWithDate(`userEmail: ${userEmail}`);

  const useAsync = req.query.useAsync;
  if (useAsync) {
    util.logWithDate('Using async/await syntax');
    return getEtaForUserUsingAsyncAwait(userEmail, res);
  }

  return getEtaForUser(userEmail, res);
});

module.exports = router;
