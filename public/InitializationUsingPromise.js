
function Authenticator(elem) {
  this.elem = elem;
}

Authenticator.prototype.init = function () {
  var deferred = $.Deferred();

  window.setTimeout(() => {
    console.log('Authenticator initialized');
    return deferred.resolve({ token: 'd1798adc-8dca-47b1-95c3-b6f883f29020' });
  }, 2000);

  return deferred.promise();
}

function StockPortfolioLister(element, authInitPromise, portfolioId) {
  this.elem = element;
  authInitPromise.done(this.init.bind(this));
  console.log('Initializing StockPortfolioLister with portfolioId: ' + portfolioId);
  this.portfolioId = portfolioId;
}

StockPortfolioLister.prototype.init = function (token) {
  console.log('StockPortfolioLister - authenticator provided token: ' + JSON.stringify(token));
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
  authInitPromise = auth.init();

  getPortfolioIdForUser('bob@gmail.com', function (portfolioId) {
    $('#stockList').stockPortfolioLister = new StockPortfolioLister($('#stockList'), authInitPromise, portfolioId);
  });
}
