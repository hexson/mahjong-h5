(function(){
  'use strict';
  
  angular.module('app')
  .controller('joinvipCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    var lan = {
      ROOM_NOT_EXIST: '房间已经失效'
    };
    vm.agr = true;
    vm.agrfn = function(){
      vm.agr = !vm.agr;
    }
    vm.joinvip = function(){
      if (!vm.agr){
        u.toastr('请同意服务条款');
      }else {
        u.post('http://pay.nbyphy.com/gateway/h5Recharge', {
          totalAmount: 480
        })
        .then(function(res){
          if (res.code == 'SUCCESS'){
            var conf = res.data;
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', //以下数据需替换为请求融支付得到的调起支付所需数据wxjsapiStr,注意分割符号和标点符号必须一致
              {
                "appId": conf.appId,
                "timeStamp": conf.timeStamp,
                "signType": "MD5",
                "package": conf.package,
                "nonceStr": conf.nonceStr,
                "paySign": conf.paySign
              },
              function(res){
                WeixinJSBridge.log(res.err_msg);
                  if(res.err_msg == "get_brand_wcpay_request:ok") {
                    u.toastr("支付成功,即将返回会员中心");
                    vm.userinfo();
                    $timeout(function(){
                      $state.go('main.vip');
                    }, 2000);
                  }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                    u.toastr("您取消了支付!");
                  }else{
                    alert("支付失败!\n err_code:" + res.err_code + "\n err_desc:" + res.err_desc + "\n err_msg:" + res.err_msg);
                  }
                  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              }
            )
          }else if (res.code=='NOLOGINED'){
            u.toastr('账户未登录');
          }else{
            u.toastr('接口请求错误');
          }
        })
      }
    }
    vm.get = function(){
      u.post('account/notice', {tag: 'notice'})
      .then(function(res){
        var code = res.code;
        if (code == 'SUCCESS'){
          vm.notice = res.data.content;
          return;
        }
        u.toastr(lan[code]);
      })
    }
    vm.get();
  }]);
})();