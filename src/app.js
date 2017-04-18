(function(){
  'use strict';
  '__VERSION__';

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
      debug: true
    });
    $urlRouterProvider.otherwise('/loading');
    $urlRouterProvider.when('/main', '/main/index');
    $locationProvider.hashPrefix('');
    $stateProvider
    .state('main', {
      url: '/main',
      views: {
        '': {
          template: '<ui-view></ui-view><ui-view name="@footer"></ui-view>'
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
    $httpProvider.interceptors.push(['$rootScope', function($rootScope){
      return {
        request: function(req){
          var md = req.url.match(/[a-zA-Z0-9-]+\.html/)[0].replace('.html', '').match(/[a-zA-Z0-9]+/)[0];
          if (md !== 'frame' && md !== 'plugin' && routes[md]) $rootScope.openTransition = md;
          else $rootScope.openTransition = false;
          $rootScope.footerIsShow = false;
          return req;
        },
        response: function(res){
          $rootScope.footerIsShow = !!$rootScope.openTransition;
          return res;
        }
      }
    }]);
  }])
  .run(['$rootScope', function($rootScope){
    function log(){
      console.log.apply(console, arguments);
    }
    log('%c 2017 @Hexson', 'color:red;');
    document.querySelector('body').addEventListener('touchmove', function(e) {
      e.preventDefault();
    });
  }]);
})();