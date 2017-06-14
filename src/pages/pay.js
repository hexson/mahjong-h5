(function(){
  'use strict';
  
  angular.module('app')
  .controller('payCtrl', ['$scope', '$state', '$interval', '$timeout', '$rootScope', 'utils', function(vm, $state, $interval, $timeout, root, u){
    var lan = {
      USER_ROOM_CREATE_MORE: '同时只可以创建3个以内的房间'
    };
    // onBridgeReady();
    function onBridgeReady(conf){
      u.post('http://pay.nbyphy.com/gateway/h5Recharge', {
        totalAmount: 0.1,
        diamondAmount: 100
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
                  alert("支付成功");
                }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                  alert("用户取消支付!");
                }else{
                  alert("支付失败!\n err_code:" + res.err_code + "\n err_desc:" + res.err_desc + "\n err_msg:" + res.err_msg);
                }
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            }
          )
        }else {
          alert('接口请求错误');
        }
      })
    }
    if (typeof WeixinJSBridge == "undefined"){
      if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    }else{
      onBridgeReady();
    }
  }]);
})();