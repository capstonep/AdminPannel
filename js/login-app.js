// app.js
var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider

        // LOGIN STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginController'

        })

        // MAIN PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('main', {
            url: '/main',
            templateUrl: 'templates/main.html',
            controller: 'mainController'
        })
        .state('main.addFlyers', {
            url: '/add-flyers',
            templateUrl: 'templates/flyers/addFlyer.html',
            controller: 'addFlyerController'
        })
        .state('main.viewFlyers', {
            url: '/view-flyers',
            templateUrl: 'templates/flyers/viewFlyer.html',
            controller: 'viewFlyerController'
        })
        .state('main.editFlyers', {
            url: '/edit-flyers',
            templateUrl: 'templates/flyers/editFlyer.html',
            controller: 'editFlyerController'
        })
        .state('main.admin', {
            url: '/admin',
            templateUrl: 'templates/admin.html',
            controller: 'adminController'
        })
        .state('main.orders', {
            url: '/orders',
            templateUrl: 'templates/orders/orders.html',
            controller: 'ordersController'
        })
        .state('main.preOrders', {
            url: '/previous-orders',
            templateUrl: 'templates/orders/preOrders.html',
            controller: 'preordersController'
        })

        .state('main.dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html',
            controller: 'dashboardController'
        })



        .state('main.clients', {
            url: '/clients',
            templateUrl: 'templates/clients.html',
            controller: 'clientsController'
        })

        .state('main.updateStock', {
            url: '/update-stock',
            templateUrl: 'templates/updateStock.html',
            controller: 'updateStockController'
        })

        .state('main.addStock', {
            url: '/add-stock',
            templateUrl: 'templates/addStock.html',
            controller: 'addStockController'
        })

        .state('main.viewStock', {
            url: '/view-stock',
            templateUrl: 'templates/viewStock.html',
            controller: 'viewStockController'
        })
        .state('main.viewStock.snacks', {
            url: '/snacks',
            templateUrl: 'templates/stock-products/snacks.html',
            controller: 'snacksController'
        })
        .state('main.viewStock.bakery', {
            url: '/bakery',
            templateUrl: 'templates/stock-products/bakery.html',
            controller: 'bakeryController'
        })
        .state('main.viewStock.cleansers', {
            url: '/cleansers',
            templateUrl: 'templates/stock-products/cleansers.html',
            controller: 'cleansersController'
        })
        .state('main.viewStock.dairy', {
            url: '/dairy',
            templateUrl: 'templates/stock-products/dairy.html',
            controller: 'dairyController'
        })
        .state('main.viewStock.frozen', {
            url: '/frozen',
            templateUrl: 'templates/stock-products/frozen-foods.html',
            controller: 'frozenController'
        })
        .state('main.viewStock.fruits', {
            url: '/fruits',
            templateUrl: 'templates/stock-products/fruits.html',
            controller: 'fruitsController'
        })
        .state('main.viewStock.paper', {
            url: '/paper',
            templateUrl: 'templates/stock-products/paper-goods.html',
            controller: 'paperController'
        })
        .state('main.viewStock.personal', {
            url: '/personal',
            templateUrl: 'templates/stock-products/personal-care.html',
            controller: 'personalController'
        })
        .state('main.viewStock.sweets', {
            url: '/sweets',
            templateUrl: 'templates/stock-products/sweets.html',
            controller: 'sweetsController'
        })
        .state('main.viewStock.vegetables', {
            url: '/vegetables',
            templateUrl: 'templates/stock-products/vegetables.html',
            controller: 'vegetablesController'
        }).state('main.viewStock.grocery', {
            url: '/grocery',
            templateUrl: 'templates/stock-products/grocery.html',
            controller: 'groceryController'
        });

});

routerApp.controller('loginController', function ($scope, $state, $http) {

    $scope.login = function () {
        $http({
            method: "GET",
            url: "https://api.mlab.com/api/1/databases/admin_credentials/collections/admin_credentials?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
        }).then(function mySuccess(response) {
            console.log(response.data[0].login_id)
            if ($scope.username == response.data[0].login_id && $scope.password == response.data[0].login_pass) {
                $state.go('main');
                $http({
                    method: "PUT",
                    url: "https://api.mlab.com/api/1/databases/admin_credentials/collections/admin_credentials/5b16bcae1f6e4f35aea508bd?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                    data: JSON.stringify({
                        "$set": {
                            "admin_status": "Online"
                        }
                    })
                }).then(function mySuccess(response) {}, function myError(response) {
                    $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
                });
                $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Accessing Services from Onkar Food !!").delay(1000).fadeOut();
                $http({
                    method: "GET",
                    url: "https://api.mlab.com/api/1/databases/admin_credentials/collections/admin_credentials?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
                }).then(function mySuccess(response) {
                    $scope.admin_name = response.data[0].admin_name;
                    console.log($scope.admin_name)
                }, function myError(response) {
                    $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
                });

            } else {
                //alert("Invalid Credentials");
                $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Invalid Username or Password !!").delay(1000).fadeOut();
            }
        }, function myError(response) {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        });
    }

    $scope.recoverPassword = function () {
        $(".loginBox").animate({
            right: '25%'
        });
        $(".newPasswordBox").animate({
            right: '25%'
        });
        $(".recoverBox").animate({
            left: '25%'
        });
    }
    $scope.cancelRecovery = function () {
        $(".loginBox").animate({
            right: '0px'
        });
        $(".newPasswordBox").animate({
            right: '0px'
        });
        $(".recoverBox").animate({
            left: '0px'
        });
    }
    $scope.cancelRecoveryFromNewPass = function () {
        $(".loginBox").animate({
            right: '0px'
        });
        $(".newPasswordBox").animate({
            left: '0px'
        });
        $(".recoverBox").animate({
            right: '0px'
        });
    }
    $scope.sendCode = function () {
        var username = $("#rec_username").val();
        var reg_phone = $("#reg_phone").val();
        $.ajax({
            url: "https://api.mlab.com/api/1/databases/admin_credentials/collections/admin_credentials?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                if (username == data[0].login_id && reg_phone == data[0].login_contact) {
                    $('#secretCode').modal('show');
                    $("#toast").fadeIn().text("Code has been sent !!").delay(1000).fadeOut();
                    $scope.cancelRecovery();
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", "https://platform.clickatell.com/messages/http/send?apiKey=rQEU1qMtTx-33ghHQJtZRQ==&to=1" + reg_phone + "&content=Code - 5522", true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            console.log('success')
                        }
                    };
                    xhr.send();
                } else {
                    //alert("Invalid Credentials");
                    $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Invalid Data !!").delay(1000).fadeOut();
                }
            }
        });
        $("#sec_code").focus();
    }
    $scope.submitSecretCode = function () {
        var sec_code = $("#sec_code").val();
        if (sec_code == "5522") {
            $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Secret Code is OK !!").delay(1000).fadeOut();
            $(".loginBox").animate({
                right: '25%'
            });
            $(".newPasswordBox").animate({
                left: '25%'
            });
            $(".recoverBox").animate({
                right: '25%'
            });
        } else {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Secret Code is Invalid !!").delay(1000).fadeOut();
        }
    }
    $scope.submitNewPass = function () {
        var new_password = $("#new_password").val();
        var confirm_pass = $("#confirm_new_password").val();
        if (new_password == confirm_pass) {
            $.ajax({
                url: "https://api.mlab.com/api/1/databases/admin_credentials/collections/admin_credentials/5b16bcae1f6e4f35aea508bd?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                data: JSON.stringify({
                    "$set": {
                        "login_pass": new_password
                    }
                }),
                type: "PUT",
                contentType: "application/json",
                success: function (data) {
                    $scope.cancelRecoveryFromNewPass();
                    $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Password is Updated !!").delay(1000).fadeOut();
                }
            });
        } else {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Password don't Match !!").delay(1000).fadeOut();
        }
    }
});
