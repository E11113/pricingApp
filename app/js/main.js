/*jshint sub:true*/
/*jshint asi:true*/

(function () {

	'use strict';

	var myApp = angular.module('pos', [
		'ngAnimate',
		'ngAria',
		'ngMessages',
		'ngMaterial',
		'material.svgAssetsCache',
		'toastr',
		'blockUI',
		'datatables',
		'UtilService'
	]);

	myApp.config(['toastrConfig', 'blockUIConfig',
		function (toastrConfig, blockUIConfig) {


			angular.extend(toastrConfig, {
				autoDismiss: true,
				containerId: 'toast-container',
				maxOpened: 0,
				newestOnTop: true,
				positionClass: 'toast-bottom-right',
				preventDuplicates: false,
				preventOpenDuplicates: true,
				target: 'body'
			});

			blockUIConfig.autoInjectBodyBlock = true;
			blockUIConfig.autoBlock = true;
			blockUIConfig.message = 'Please wait...';

		}]);

	myApp.controller('MainCtrl', ["$scope", "utilService","DTOptionsBuilder",
		function ($scope, utilService, DTOptionsBuilder) {

			$scope.products = [];
			$scope.priceList = [];
			$scope.form = {};
			getProducts();

			function getProducts() {

				utilService.callGetRequest('product/getAll')
					.then(function (response) {

						$scope.products = response.data;

					}, function (error) { }
					);
			}

			$scope.changeProduct = function (selectedProduct) {


				utilService.callGetRequest('price/calculateFirst50UnitsBy/' + selectedProduct.id)
					.then(function (response) {

						$scope.priceList = [];
						$scope.priceList = response.data;

					}, function (error) {
						$scope.priceList = [];
					});
			}

			$scope.calculate = function (pricingProduct, carttons, units) {

				if(!units){ units = 0};
				if(!carttons){ carttons = 0};

				utilService.callGetRequest('price/calculateBy/' + pricingProduct.id + '/' + (carttons * pricingProduct.unitsPerCarton + units))
					.then(function (response) {

						$scope.price = response.data.price;

					}, function (error) {
					});
			}

			$scope.clear = function () {

				$scope.form = {};
				$scope.price = undefined;
			}

			$scope.dtInstance = {};

			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withDisplayLength(50)
				.withOption('dom', 't')
				.withOption('columnDefs', [
					{
						targets: 1,
						responsivePriority: 0,
						filterable: false,
						sortable: false
					},
					{
						targets: 2,
						responsivePriority: 0,
						filterable: false,
						sortable: false
					}
				]);

		}]);

}());



