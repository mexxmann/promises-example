const util = require('./util');
const express = require('express');
const router = express.Router();
const request = require('request-promise');



function makeNetworkCall(query) {
  return new Promise((resolve, reject) => {
    if (query === 'bad') {
      reject('call failed!\n');
    } else {
      resolve('call success\n');
    }
  });
}

function makeRealNetworkCall(responseTime) {
  responseTime = responseTime || 0;
  const uri = `http://slowwly.robertomurray.co.uk/delay/${responseTime}/url/https://jsonplaceholder.typicode.com/posts`
  return request({
    uri,
    method: 'GET',
    json: true,
    timeout: 1000,
  })
}

function searchAPassthru(query) {
  return makeNetworkCall(query);
}

function searchBPassthru(query) {
  return makeRealNetworkCall(query);  
}


/**
 * Test promise chain with a promise we create
 * Usage:
 * curl http://localhost:3000/chain/searchA?q=good
 * curl http://localhost:3000/chain/searchA?q=bad
 */
router.get('/searchA', (req, res) => {
  searchAPassthru(req.query.q).then((result) => {
    return res.status(200).send(result);
  }).catch((err) => {
    return res.status(500).send(err);
  });
});
  
/**
 * Test promise chain with promise returned by request-promise library
 * Usage:
 * curl http://localhost:3000/chain/searchB?responseTime=0
 * -> Should succeed since it's below the timeout threshold
 * 
 * curl http://localhost:3000/chain/searchB?responseTime=2000
 * -> Should fail since it exceeds the timeout threshold
 */
router.get('/searchB', (req, res) => {
  searchBPassthru(req.query.responseTime).then((result) => {
    return res.status(200).send(result);
  }).catch((err) => {
    return res.status(500).send(err);
  });
});

module.exports = router;
