'use strict';

exports.ok = function(values, res) {
  
  var data = {
      'shopping': values
  };
  res.json(data);
  res.end();
};
