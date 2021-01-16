// takes a function as an argument and wraps it in a promise
const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
 
module.exports = asyncMiddleware;
