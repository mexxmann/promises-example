
function Authenticator(elem) {
  this.elem = elem;
}

Authenticator.prototype.init = function () {
  window.setTimeout(() => {
    console.log('Authenticator initialized');
    this.elem.trigger('init', { token: 'd1798adc-8dca-47b1-95c3-b6f883f29020' });
  }, 2000);
}

function StockPortfolioLister(element, auth, portfolioId) {
  this.elem = element;
  this.authenticator = auth;
  this.authenticator.elem.on('init', this.init.bind(this));
  console.log('Initializing StockPortfolioLister with portfolioId: ' + portfolioId);
  this.portfolioId = portfolioId;
}

StockPortfolioLister.prototype.init = function (event, token) {
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
  var auth = new Authenticator($('#body'));

  getPortfolioIdForUser('bob@gmail.com', function (portfolioId) {
    $('#stockList').stockPortfolioLister = new StockPortfolioLister($('#stockList'), auth, portfolioId);
  });

  auth.init();
}
