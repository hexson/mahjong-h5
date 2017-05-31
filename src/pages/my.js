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
    vm.getVip = function(){
      u.post('account/vipinfo')
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.vipinfo = res.data;
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.getVip();
    vm.saveVip = function(){
      var my = vm.vipinfo;
      if (!my.fullName){
        return u.toastr('请填写姓名');
      }
      if (!my.mobile){
        return u.toastr('请填写手机号码');
      }
      if (!/^1(3|4|5|7|8|9)\d{9}$/.test(my.mobile)){
        return u.toastr('请填写正确的手机号码');
      }
      if (!my.zfb){
        return u.toastr('请填写支付宝账号');
      }
      if (!my.bank){
        return u.toastr('请填写银行卡号');
      }
      if (!/^[1-9]\d{9,}$/.test(my.bank)){
        return u.toastr('请填写正确的银行卡号');
      }
      if (!my.card){
        return u.toastr('请填写开户行');
      }
      u.post('account/editvipinfo', vm.vipinfo)
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          u.toastr('保存成功');
          return;
        }
        u.toastr(lan[code]);
      })
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
  }]);
})();