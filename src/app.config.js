(function(){
  'use strict';

  angular.module('config', [])
  .constant('api', 'http://api.nbyphy.com/api/')
  .constant('statics', {
    path: '__path__'
  })
  .constant('routes', {
    loading: ['pages/loading.html', 'pages/loading.js'],
    index: ['pages/index.html', 'pages/index.js'],
    recharge: ['pages/recharge.html', 'pages/recharge.js'],
    my: ['pages/my.html', 'pages/my.js'],
    discove: ['pages/discove.html', 'pages/discove.js'],
    record: ['pages/record.html', 'pages/record.js'],
    create: ['create/:code', 'pages/create.html', 'pages/create.js'],
    into: ['pages/into.html', 'pages/into.js'],
    score: ['pages/score.html', 'pages/score.js'],
    vip: ['pages/vip.html', 'pages/vip.js'],
    settle: ['pages/settle.html', 'pages/settle.js'],
  })
})();