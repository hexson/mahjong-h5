(function(){
  'use strict';
  
  angular.module('app')
  .controller('orderCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    var lan = {
      ROOM_NOT_EXIST: '房间已经失效'
    };
    vm.rmb = u.sstorage('rmb') || 10;
    vm.coin = u.sstorage('coin') || 1000;
    vm.wxpay = function(){
      if (vm.disp){
        return false;
      }
      u.post('http://pay.nbyphy.com/gateway/h5Recharge', {
        totalAmount: vm.rmb
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
                  u.toastr("支付成功,即将返回充值列表");
                  vm.disp = true;
                  $timeout(function(){
                    $state.go('main.recharge');
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
  }]);
})();