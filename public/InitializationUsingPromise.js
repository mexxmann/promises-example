
function Authenticator(elem) {
  this.elem = elem;
}

Authenticator.prototype.init = function () {
  var deferred = $.Deferred();

  window.setTimeout(() => {
    console.log('Authenticator initialized');
    return deferred.resolve({ token: 'd1798adc-8dca-47b1-95c3-b6f883f29020' });
  }, 2000); // **** Changing this timeout will no longer break the site!

  return deferred.promise();
}

function StockPortfolioList(element, authInitPromise, portfolioId) {
  this.elem = element;
  console.log('Initializing StockPortfolioList with portfolioId: ' + portfolioId);
  this.portfolioId = portfolioId;

  // Do the rest of initialization once the Authenticator has finished it's initialization
  authInitPromise.done(this.init.bind(this));
}

StockPortfolioList.prototype.init = function (token) {
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
  var auth = new Authenticator();
  authInitPromise = auth.init(); // Can re-use this promise for other components

  getPortfolioIdForUser('bob@gmail.com', function (portfolioId) {
    $('#stockList').stockPortfolioList = new StockPortfolioList($('#stockList'), authInitPromise, portfolioId);
  });
}

