/*jshint sub:true*/
/*jshint asi:true*/

(function () {

	'use strict';

    angular.module("UtilService",[]).service("utilService",["$http","$q","toastr","blockUI", 
                function($http, $q, toastr, blockUI){

        var service = {};
        var baseURL = 'http://ec2-13-126-99-152.ap-south-1.compute.amazonaws.com:8090/';

        service.idGenerate = function() {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1);
            };
            return S4();
        }

        service.generateNumber = function() {
            var num1 = Math.floor((Math.random() * 999999999) + 1);
            var num2 = Math.floor((Math.random() * 999999999) + 1);
            return num1 + num2;
        }

        service.callGetRequest = function (url){

            var differd = $q.defer();
            service.contentLoader(true);

            $http({
                method : "GET",
                url : baseURL + url
            }).then(function(response){

                service.contentLoader(false);
                differd.resolve(response);

            },function(error){
                service.contentLoader(false);
                service.alert("Internal Error", "error");
            });
            return differd.promise;
        };

        service.callPostRequest = function (url ,data){

            var differd = $q.defer();
            service.contentLoader(true);

            $http({
                method : "POST",
                url : baseURL + url,
                data : data
            }).then(function(response){

                service.contentLoader(false);
                differd.resolve(response);

            },function(error){
                
                service.contentLoader(false);
                service.alert("Internal Error", "error");
            });
            return differd.promise;
        };
        
        service.alert = function (message,statusMSG){

            if(statusMSG == 'success'){
                toastr.success(message,"",{timeOut: '3000'});
            }else if(statusMSG == 'warning'){
                toastr.warning(message,"",{timeOut: '3000'});
            }else if(statusMSG == 'error'){
                toastr.error(message,"",{timeOut: '3000'});
            }else{
                toastr.info(message,"",{timeOut: '3000'});
            }
        }

        service.contentLoader = function (option) {

            if(option == true){
                blockUI.start();
            }
            else{
                blockUI.stop();
            }
        }

        return service;

    }]);

})();