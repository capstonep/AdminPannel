angular.module('routerApp').controller('viewStockController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $scope.getStockData = function (category) {
        $http({
            method: "GET",
            url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + category + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
        }).then(function mySuccess(response) {
            $scope.stockData = response.data;
        }, function myError(response) {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        });
    }
    $scope.getStockData('snacks');
}]);
angular.module('routerApp').controller('addStockController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $scope.add_product = function () {
        if ($scope.p_name != "" &&
            $scope.p_price != "" &&
            $scope.p_cat != "" &&
            $scope.p_name != undefined &&
            $scope.p_price != undefined &&
            $scope.p_cat != undefined &&
            $scope.p_name != null &&
            $scope.p_price != null &&
            $scope.p_cat != null) {
            $http({
                method: "POST",
                url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + $scope.p_cat + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                data: JSON.stringify({
                    "product_name": $scope.p_name,
                    "product_des": $scope.p_des,
                    "product_image": $scope.p_image,
                    "product_price": $scope.p_price,
                    "product_cat": $scope.p_cat,
                    "product_weight": $scope.p_weight,
                    "product_brand": $scope.p_brand,
                })
            }).then(function mySuccess(response) {
                $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("New Product Entered !!").delay(1000).fadeOut();
                $scope.p_name = "";
                $scope.p_des = "";
                $scope.p_image = "";
                $scope.p_price = "";
                $scope.p_cat = "";
                $scope.p_weight = "";
                $scope.p_brand = "";
            }, function myError(response) {
                $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
            });
        } else {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Enter Required Data !!").delay(1000).fadeOut();
        }
    }
}]);
angular.module('routerApp').controller('updateStockController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $scope.getProductList = function () {
        $http({
            method: "GET",
            url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + $scope.p_cat + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
        }).then(function mySuccess(response) {
            $scope.stockData = response.data;
            $scope.p_name = "";
            $scope.p_des = "";
            $scope.p_image = "";
            $scope.p_price = "";
            $scope.p_weight = "";
            $scope.p_brand = "";
        }, function myError(response) {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        });
    }
    $scope.getThisItemData = function (id) {
        $http({
            method: "GET",
            url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + $scope.p_cat + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
        }).then(function mySuccess(response) {
            for (var i = 0; i < response.data.length; i++) {
                if (id == response.data[i]._id.$oid) {
                    $scope.p_name = response.data[i].product_name;
                    $scope.p_des = response.data[i].product_des;
                    $scope.p_image = response.data[i].product_image;
                    $scope.p_price = response.data[i].product_price;
                    $scope.p_weight = response.data[i].product_weight;
                    $scope.p_brand = response.data[i].product_brand;
                    $scope.p_id = response.data[i]._id.$oid;
                }
            }
        }, function myError(response) {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        });
    }
    $scope.update_product = function () {
        if ($scope.p_name != "" &&
            $scope.p_price != "" &&
            $scope.p_name != undefined &&
            $scope.p_price != undefined &&
            $scope.p_name != null &&
            $scope.p_price != null) {
            $http({
                method: "PUT",
                url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + $scope.p_cat + "/" + $scope.p_id + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                data: JSON.stringify({
                    "product_name": $scope.p_name,
                    "product_des": $scope.p_des,
                    "product_image": $scope.p_image,
                    "product_price": $scope.p_price,
                    "product_weight": $scope.p_weight,
                    "product_brand": $scope.p_brand,
                })
            }).then(function mySuccess(response) {
                $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Success - Product Data is Updated !!").delay(1000).fadeOut();
                $scope.p_name = "";
                $scope.p_des = "";
                $scope.p_image = "";
                $scope.p_price = "";
                $scope.p_weight = "";
                $scope.p_brand = "";
                $state.go('main.updateStock');
            }, function myError(response) {
                $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
            });
        } else {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        }
    }
    $scope.delete_product = function () {
        $http({
            method: "DELETE",
            url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + $scope.p_cat + "/" + $scope.p_id + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
            async: true,
            timeout: 300000
        }).then(function mySuccess(response) {
            $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Success - Product Data is Deleted !!").delay(1000).fadeOut();
            $scope.p_name = "";
            $scope.p_des = "";
            $scope.p_image = "";
            $scope.p_price = "";
            $scope.p_weight = "";
            $scope.p_brand = "";
            $state.go('main.updateStock');
        }, function myError(response) {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        });
    }
}]);
angular.module('routerApp').controller('groceryController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('snacksController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('bakeryController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('cleansersController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('frozenController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('fruitsController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('paperController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('personalController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('sweetsController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('vegetablesController', ['$scope', '$state', function ($scope, $state) {

}]);
angular.module('routerApp').controller('dairyController', ['$scope', '$state', function ($scope, $state) {

}]);
