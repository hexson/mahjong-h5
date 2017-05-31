(function(){
  'use strict';

  angular.module('app', [
    'ui.router',
    'oc.lazyLoad',
    'ngFileUpload',
    // 'ngDialog',
    // 'toastr',
    'config'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$ocLazyLoadProvider', '$httpProvider', '$compileProvider', 'statics', 'routes', function($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider, $httpProvider, $compileProvider, statics, routes){
    $ocLazyLoadProvider.config({
      // debug: true
    });
    $urlRouterProvider.otherwise('/loading');
    $urlRouterProvider.when('/main', '/main/index');
    $locationProvider.hashPrefix('');
    $stateProvider
    .state('main', {
      url: '/main',
      views: {
        '': {
          // template: '<ui-view></ui-view><ui-view name="@footer"></ui-view>'
          template: '<ui-view></ui-view>'
        },
        // '@header': {
        //   templateUrl: 'components/header.html'
        // },
        '@footer': {
          templateUrl: 'components/footer.html'
        }
      },
      resolve: {
        loadMyFile: ['$ocLazyLoad', function($ocLazyLoad){
          return $ocLazyLoad.load({
            files: [
              // 'components/header.js',
              'components/footer.js'
            ]
          });
        }]
      }
    })
    .state('loading', stateConf('loading'))
    .state('main.index', stateConf('index'))
    .state('main.recharge', stateConf('recharge'))
    .state('main.my', stateConf('my'))
    .state('main.discove', stateConf('discove'))
    .state('main.record', stateConf('record'))
    .state('main.create', stateConf('create'))
    .state('main.into', stateConf('into'))
    .state('main.score', stateConf('score'))
    .state('main.vip', stateConf('vip'))
    .state('main.settle', stateConf('settle'))
    ;
    /* state config:start */
    function stateConf(route, htmlfile, jsfiles){
      var r = routes[route];
      var l = r.length;
      if (r && r instanceof Array){
        jsfiles = jsfiles || r[l - 1];
        htmlfile = htmlfile || r[l - 2];
        route = r[l - 3] || route;
      }
      return {
        url: '/' + route,
        templateUrl: statics.path + htmlfile,
        resolve: {
          loadMyFile: ['$ocLazyLoad', function($ocLazyLoad){
            return $ocLazyLoad.load({
              files: (typeof jsfiles === 'string' ? [statics.path + jsfiles] : (jsfiles || []))
            });
          }]
        }
      };
    };
    /* state config:end */
    var parmas = {};
    var storage = window.localStorage;
    var str = location.search.substring(1).split('&');
    for (var i = 0; i < str.length; i++){
      var arr = str[i].split('=');
      parmas[arr[0]] = arr[1];
    }
    storage.setItem('token', parmas.token);
    $httpProvider.defaults.transformRequest = function(obj){
      var str = [];
      for(var p in obj){
        str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
      }
      return str.join("&");
    };
    $httpProvider.defaults.headers.post={
      'Content-Type':'application/x-www-form-urlencoded'
    }
    $httpProvider.interceptors.push(['$rootScope', function($rootScope){
      return {
        request: function(req){
          if (req.url.indexOf('token/get') < 0){
            req.headers = angular.extend(req.headers, {
              'Token': storage.getItem('token'),
              'Token-Key': window.localStorage.getItem('TokenKey'),
              'Token-Value': window.localStorage.getItem('TokenValue')
            });
          }
          return req;
        },
        response: function(res){
          if (typeof res.data === 'object') return res.data;
          return res;
        }
      }
    }]);
  }])
  .run(['$rootScope', 'utils', function(vm, u){
    function log(){
      console.log.apply(console, arguments);
    }
    log('%c 2017 有朋互娱@__VERSION__', 'color:red;');
    // document.querySelector('body').addEventListener('touchmove', function(e) {
    //   e.preventDefault();
    // });
    // 计算场景的宽度
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (document.body && document.body.clientWidth && document.body.clientHeight){
      width = document.body.clientWidth;
      height = document.body.clientHeight;
    }
    vm.indexWidth = width;
    if (width >= height){
      vm.indexWidth = height / 1280 * 720;
      vm.style = 'width:' + vm.indexWidth + 'px';
    }
    u.post('account/userinfo')
    .then(function(res){
      vm.info = res.data;
    });
    u.post('gateway/games')
    .then(function(res){
      vm.list = res.data;
    });
    u.post('gateway/RoomTimeConfig')
    .then(function(res){
      vm.timeList = res.data;
    });
  }]);
})();