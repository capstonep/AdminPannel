angular.module('routerApp').controller('mainController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $http({
        method: "GET",
        url: "https://api.mlab.com/api/1/databases/admin_credentials/collections/admin_credentials?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
    }).then(function mySuccess(response) {
        $scope.admin_name = response.data[0].admin_name;
        $scope.admin_status = response.data[0].admin_status;
        $scope.admin_img = response.data[0].admin_img;
    }, function myError(response) {
        $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
    });
    $("body").addClass("blankBack");
    $state.go('main.dashboard');
    $scope.clientPage = function () {
        $state.go('main.clients');
    }
    $scope.logout = function () {
        $state.go('login');
        $("body").removeClass("blankBack");
        $http({
            method: "PUT",
            url: "https://api.mlab.com/api/1/databases/admin_credentials/collections/admin_credentials/5b16bcae1f6e4f35aea508bd?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
            data: JSON.stringify({
                "$set": {
                    "admin_status": "Offline"
                }
            })
        }).then(function mySuccess(response) {}, function myError(response) {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        });
    }
}]);
angular.module('routerApp').controller('adminController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $http({
        method: "GET",
        url: "https://api.mlab.com/api/1/databases/admin_credentials/collections/admin_credentials?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
    }).then(function mySuccess(response) {
        $scope.login_id = response.data[0].login_id;
        $scope.login_pass = response.data[0].login_pass;
        $scope.admin_name = response.data[0].admin_name;
        $scope.login_contact = response.data[0].login_contact;
        $scope.admin_img = response.data[0].admin_img;
    }, function myError(response) {
        $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
    });

    $scope.update_admin = function () {
        if ($scope.login_id != "" &&
            $scope.login_pass != "" &&
            $scope.admin_name != "" &&
            $scope.login_contact != "" &&
            $scope.login_id != undefined &&
            $scope.login_pass != undefined &&
            $scope.admin_name != undefined &&
            $scope.login_contact != undefined &&
            $scope.login_id != null &&
            $scope.login_pass != null &&
            $scope.admin_name != null &&
            $scope.login_contact != null) {
            var img = $("#list img").attr("src");
            if (img == undefined || img == null || img == "") {
                var img = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";
            }
            $http({
                method: "PUT",
                url: "https://api.mlab.com/api/1/databases/admin_credentials/collections/admin_credentials/5b16bcae1f6e4f35aea508bd?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                data: JSON.stringify({
                    "$set": {
                        "login_id": $scope.login_id,
                        "login_pass": $scope.login_pass,
                        "admin_name": $scope.admin_name,
                        "admin_img": img,
                        "login_contact": $scope.login_contact,
                        "admin_status": "Online"
                    }
                })
            }).then(function mySuccess(response) {
                $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Success - Product Data is Updated !!").delay(1000).fadeOut();
            }, function myError(response) {
                $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
            });
        } else {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        }
    }

}]);
angular.module('routerApp').controller('dashboardController', ['$scope', '$state', function ($scope, $state) {
    $scope.clientPage = function () {
        $state.go('main.clients');
    }
    $scope.flyerPage = function () {
        $state.go('main.viewFlyers');
    }
}]);
