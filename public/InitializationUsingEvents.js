/**
 * @file This example shows an initialization sequence using events that has a race-condition between the
 * Authenticator.init() and the getPortfolioIdForUser() functions.
 * getPortfolioIdForUser() must complete first for correct behavior, else the StockPortfolioList misses attaching
 * to the Authenticator.init event handler
 *
 * It accomapnies the Initialization use case slides from
 * https://docs.google.com/presentation/d/1J8O8S1gJnGjPy7jyPHwU-otrtRprD4qTp-ZYzIDfFj0
 */

function Authenticator(elem) {
  this.elem = elem;
}

Authenticator.prototype.init = function () {
  window.setTimeout(() => {
    console.log('Authenticator initialized');
    this.elem.trigger('init', { token: 'd1798adc-8dca-47b1-95c3-b6f883f29020' });
  }, 2000); // **** Change this timeout to 200 to break the site!
}

function StockPortfolioList(element, auth, portfolioId) {
  this.elem = element;
  console.log('Initializing StockPortfolioList with portfolioId: ' + portfolioId);
  this.portfolioId = portfolioId;

  // Do the rest of initialization once the Authenticator has finished it's initialization
  auth.elem.on('init', this.init.bind(this));
}

StockPortfolioList.prototype.init = function (event, token) {
  console.log('StockPortfolioList - authenticator provided token: ' + JSON.stringify(token));
  this.elem.append('<div>AAPL</div>');
  this.elem.append('<div>GOOG</div>');
}

function getPortfolioIdForUser(userEmail, callback) {
  window.setTimeout(function () {
    console.log('Finished getting portfolio id for user with email: ' + userEmail);
    callback('12345');
  }, 1000);
}

function pageInit() {
  var auth = new Authenticator($('#body'));
  auth.init(); // Fires events so all components can finish initializing after completion

  getPortfolioIdForUser('bob@gmail.com', function (portfolioId) {
    $('#stockList').stockPortfolioList = new StockPortfolioList($('#stockList'), auth, portfolioId);
  });
}
