[![build status](https://git.ask.com/XXX/badges/master/build.svg)](https://git.ask.com/XXXX/commits/master)


# Technical Notes
* Promises are part of the ECMAScript 2015 (ES6) specification, specifically https://github.com/promises-aplus/promises-spec
  * Node: Fully supported in Node 6.4 (Investopedia's current node version as of Jul 2017) - reference: http://node.green/
  * Browser: All major browsers except IE11 - reference: https://kangax.github.io/compat-table/es6/
    * Can use jQuery deferred - out of scope: differences between jQuery deferred and standard promises
* TODO:
  * chain example without promises to show nesting
  * async/await examples

# Setup
Clone Repository
```
$ git clone git@git.ask.com:XXXXX.git
```

Run npm install
```
$ npm install
```

# Run Options
Run service
```
$ npm start
```

Run in debug mode
```
$ npm run debug
```

Run linter
```
$ npm run lint
```