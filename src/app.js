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
    $urlRouterProvider.otherwise('/main/loading');
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
    .state('main.loading', stateConf('loading'))
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
    .state('main.pay', stateConf('pay'))
    .state('main.joinvip', stateConf('joinvip'))
    .state('main.order', stateConf('order'))
    .state('main.feedback', stateConf('feedback'))
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
    var str = location.href.substr(location.href.indexOf('?')+1).split('&');
    for (var i = 0; i < str.length; i++){
      var arr = str[i].split('=');
      parmas[arr[0]] = arr[1];
    }
    if (parmas.token) storage.setItem('token', parmas.token);
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
    // var bgm = document.getElementById('bgm');
    // bgm.load();
    vm.played = true;
    // var html = '<audio id="bgm" autoplay="autoplay" loop="loop" style="display: none;"><source src="mp3/background_music.ogg" type="audio/ogg"><source src="mp3/background_music.mp3" type="audio/mpeg"></audio>';
    // $('body').append(html);
    vm.userinfo = function(fn){
      u.post('account/userinfo')
      .then(function(res){
        vm.info = res.data;
        fn && fn();
      });
    }
    vm.userinfo();
    vm.audioplayer = function(id, file, loop){
      var audioplayer = document.getElementById(id);
      if(audioplayer!=null){
        document.body.removeChild(audioplayer);
      }
      if(typeof(file)!='undefined'){
        if(navigator.userAgent.indexOf("MSIE")>0){// IE
          var player = document.createElement('bgsound');
          player.id = id;
          player.src = file['mp3'];
          player.setAttribute('autostart', 'true');
          if(loop){
            player.setAttribute('loop', 'infinite');
          }
          document.body.appendChild(player);
        }else{ // Other FF Chome Safari Opera
          var player = document.createElement('audio');
          player.id = id;
          player.setAttribute('autoplay','autoplay');
          if(loop){
            player.setAttribute('loop','loop');
          }
          document.body.appendChild(player);
            
          var mp3 = document.createElement('source');
          mp3.src = file['mp3'];
          mp3.type= 'audio/mpeg';
          player.appendChild(mp3);
            
          var ogg = document.createElement('source');
          ogg.src = file['ogg'];
          ogg.type= 'audio/ogg';
          player.appendChild(ogg);
        }
        document.addEventListener("WeixinJSBridgeReady", function () {
          document.getElementById(id).play();
        }, false);
      }
    }
    vm.sharecover = false;
    u.post('gateway/games')
    .then(function(res){
      vm.list = res.data;
    });
    u.post('gateway/RoomTimeConfig')
    .then(function(res){
      vm.timeList = res.data;
    });
    u.post('passport/signPackage', {
      url: location.href
    })
    .then(function(res){
      u.post('account/shareContent')
      .then(function(data){
        u.post('account/userinfo')
        .then(function(d){
          var imgUrl = d.data.avatar || data.data.game_shaoxing_hall_share_icon;
          var desc = '有朋互娱' + '\n' + d.data.nickName + '分享微信棋牌神器，邀你一起约局，' + data.data.game_shaoxing_hall_share_word;
          console.log('imgUrl: ', imgUrl);
          console.log('desc: ', desc);
          wx.config({
            // debug: true,
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage'
            ]
          });
          // wx config ready
          wx.ready(function(){
            wx.onMenuShareTimeline({
              title: data.data.game_shaoxing_hall_share_word || data.data.game_shaoxing_hall_share_title, // 分享标题
              link: 'http://api.nbyphy.com/api/passport/wxlogin?fromOpenId='+d.data.openId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: imgUrl, // 分享图标
              success: function(){ 
                // 用户确认分享后执行的回调函数
                // alert('用户确认分享');
                u.toastr('分享成功');
                vm.sharecover = false;
                u.post('account/shareCallback')
                .then(function(shareCallback){
                  if (shareCallback.code == 'SUCCESS'){
                    u.post('account/userinfo')
                    .then(function(userinfo){
                      vm.info = userinfo.data;
                    });
                  }
                });
              },
              cancel: function(){ 
                // 用户取消分享后执行的回调函数
                u.toastr('取消分享');
              }
            });
            wx.onMenuShareAppMessage({
              title: data.data.game_shaoxing_hall_share_title || '绍兴游戏大厅', // 分享标题
              desc: desc, // 分享描述
              link: 'http://api.nbyphy.com/api/passport/wxlogin?fromOpenId='+d.data.openId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              // imgUrl: data.data.game_shaoxing_hall_share_icon, // 分享图标
              imgUrl: imgUrl, // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () { 
                // 用户确认分享后执行的回调函数
                u.toastr('分享成功');
                vm.sharecover = false;
                u.post('account/shareCallback')
                .then(function(shareCallback){
                  if (shareCallback.code == 'SUCCESS'){
                    u.post('account/userinfo')
                    .then(function(userinfo){
                      vm.info = userinfo.data;
                    });
                  }
                });
              },
              cancel: function () { 
                // 用户取消分享后执行的回调函数
                u.toastr('取消分享');
              }
            });
          });
          // wx config error
          // wx.error(function(res){
          //   alert(res);
          // });
        });
      });
    });
  }]);
})();