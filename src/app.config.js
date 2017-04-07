(function(){
  'use strict';

  angular.module('config', [])
  .constant('statics', {
    path: '__path__'
  })
  .constant('routes', {
    loading: ['pages/loading.html', 'pages/loading.js'],
    index: ['pages/index.html', 'pages/index.js'],
    recharge: ['pages/recharge.html', 'pages/recharge.js'],
    my: ['pages/my.html', 'pages/my.js'],
    discove: ['pages/discove.html', 'pages/discove.js'],
    record: ['pages/record.html', 'pages/record.js']
  });
})();