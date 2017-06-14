(function(){
  'use strict';

  angular.module('app')
  .factory('utils', ['$http', 'api', function($http, api){
    return {
      post: function(url, data){
        // data = angular.extend(data || {}, { token: this.storage('token') });
        data = data || {};
        var that = this, http;
        if (url != 'token/get') url = url.indexOf('http') >= 0 ? url : api+url;
        if (url != 'token/get' && !this.storage('TokenKey')){
          return $http.post(api+'token/get').then(function(res){
            if (res.code === 'SUCCESS'){
              that.storage('TokenKey', res.data.TokenKey);
              that.storage('TokenValue', res.data.TokenValue);
              http = $http.post(url, data);
              http.catch(function(err){
                console.log(err);
              });
              return http;
            }
          })
        }
        http = $http.post(url, data);
        http.catch(function(err){
          console.log(err);
        });
        return http;
      },
      storage: function(key, value){
        var w = window;
        if (value == undefined){
          return w.localStorage.getItem(key);
        }else {
          return w.localStorage.setItem(key, value);
        }
      },
      clearStorage: function(){
        window.localStorage.clear();
      },
      toastr: function(str, timeout){
        var id = 'toastr_' + new Date().getTime().toString(16) + Math.random().toString().substr(3, 6);
        var html = '<div id="' + id + '" class="toastr"><span>' + str + '</span></div>';
        $('body').append(html);
        setTimeout(function(){
          $('#' + id).fadeOut();
          setTimeout(function(){
            $('#' + id).remove();
          }, 500);
        }, timeout || 2000);
      },
      each: function(data, callback){
        var i, l;
        if (data instanceof Array){
          for (i = 0, l = data.length; i < l; i++){
            callback.call(data, data[i], i, data);
          }
        }else {
          for (i in data){
            callback.call(data, data[i], i);
          }
        }
      },
      then: function(data){
        if (data.code.indexOf('SUCCESS') >= 0){
          
        }
      }
    }
  }]);
})();