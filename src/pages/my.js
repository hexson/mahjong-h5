(function(){
  'use strict';
  
  angular.module('app')
  .controller('myCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    var lan = {
      ROOM_NOT_EXIST: '房间已经失效'
    };
    vm.active = 1;
    vm.tabev = function(active){
      vm.active = active;
      switch (active){
        case 1:
          break;
        case 2:
          vm.getroom();
          break;
      }
    }
    vm.showView = 'mine';
    vm.FTYPE = ['掉线问题','扣币问题','充值问题','游戏建议','违法举报','意见反馈'];
    vm.fdback = {
      game: '嵊州麻将',
      ftype: '掉线问题'
    };
    vm.showViewFn = function(view){
      vm.showView = view;
      vm.fdback = {
        game: '嵊州麻将',
        ftype: '掉线问题'
      };
    }
    vm.feedback = function(){
      var fd = vm.fdback;
      if (!fd.mobile){
        return u.toastr('请填写手机号码');
      }
      if (!/^1(3|4|5|7|8|9)\d{9}$/.test(fd.mobile)){
        return u.toastr('请填写正确的手机号码');
      }
      if (!fd.content){
        return u.toastr('请填写反馈内容');
      }
      u.post('account/feedback', vm.fdback)
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          u.toastr('成功提交反馈');
          vm.showViewFn('mine');
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.logout = function(){
      $.cookie('token', null);
      window.location.href = 'http://api.nbyphy.com/api/passport/wxlogin';
    }
    vm.getroom = function(){
      u.post('account/myRoom')
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.myroom = res.data;
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.intogame = function(v){
      location = 'http://game.nbyphy.com/' + v.game + '?room=' + v.room + '&token=' + $.cookie('token');
    }
    u.post('account/notice', {
      tag: 'UserAgreement'
    })
    .then(function(res){
      var code = res.code;
      if (code == 'SUCCESS'){
        vm.ument = res.data.content;
        return;
      }
      u.toastr(lan[code]);
    })
  }]);
})();