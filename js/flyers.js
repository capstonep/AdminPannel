angular.module('routerApp').controller('addFlyerController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $("#enteringSpace .box").each(function () {
        var index = $(this).index();
        $(this).find(".firstSelect").attr("id", "category" + index);
        $(this).find(".secondSelect").attr("id", "product" + index);
        $(this).find(".priceField").attr("id", "price" + index);
    });
    $scope.addDivInFlyer = function () {
        var html = '<div class="col-sm-3 box">';
        html += '               <p>Select Category</p>';
        html += '              <select class="firstSelect" onchange="getProductData(this)">';
        html += '<option>Categories</option>';
        html += '            </select>';
        html += '            <p>Select Product</p>';
        html += '            <select class="secondSelect" onchange="getProductPrice(this)">';
        html += '<option>Options</option>';
        html += '            </select>';
        html += '            <p>Enter New Price</p>';
        html += '            <input type="text" placeholder="New Price.." class="priceField">';
        html += '            <img class="imgField">';
        html += '        </div>';
        $("#enteringSpace").append(html);
        $("#enteringSpace .box").each(function () {
            var index = $(this).index();
            $(this).find(".firstSelect").attr("id", "category" + index);
            $(this).find(".secondSelect").attr("id", "product" + index);
            $(this).find(".priceField").attr("id", "price" + index);
            $(this).find(".imgField").attr("id", "image" + index);
        });
        var index = $("#enteringSpace .box").last().index();
        getCategoryData(index);
    }
    getCategoryData(0);

    $scope.uploadFlyer = function () {
        if ($scope.flyer_name == undefined || $scope.flyer_name == "" || $scope.flyer_name == null) {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Please Enter Flyer Name !!").delay(1000).fadeOut();
        } else {
            var flyerName = $scope.flyer_name;
            var flyerName = flyerName.replace(/\s+/g, '-');
            $("#enteringSpace .box").each(function () {
                $scope.flyerEntries = $(this).length
            });
            if ($scope.flyerEntries == undefined || $scope.flyerEntries == null || $scope.flyerEntries == "") {
                $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Please Enter some Data in Flyer    !!").delay(1000).fadeOut();
            } else {
                if ($scope.flyer_heading == undefined || $scope.flyer_heading == "" || $scope.flyer_heading == null) {
                    $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Please Enter Flyer Heading !!").delay(1000).fadeOut();
                } else {
                    $("#enteringSpace .box").each(function () {
                        var loppValue = $(this).index();
                        var selectedCat = $("#category" + $(this).index()).val();
                        var selectedProd = $("#product" + $(this).index()).val();
                        var selectedPrice = $("#price" + $(this).index()).val();
                        var prodImage = $("#image" + $(this).index()).attr("src");
                        var d = new Date();

                        var month = new Array();
                        month[0] = "January";
                        month[1] = "February";
                        month[2] = "March";
                        month[3] = "April";
                        month[4] = "May";
                        month[5] = "June";
                        month[6] = "July";
                        month[7] = "August";
                        month[8] = "September";
                        month[9] = "October";
                        month[10] = "November";
                        month[11] = "December";
                        var flyerGenerationDate = d.getFullYear() + "/" + month[d.getMonth()] + "/" + d.getDate();
                        if (selectedCat == "Select Category" || selectedProd == "Options" || selectedPrice == null || selectedPrice == undefined || selectedPrice == "") {
                            console.log("error")
                            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Wrong Entry in Flyer !!").delay(1000).fadeOut();
                        } else {
                            $http({
                                method: "POST",
                                url: "https://api.mlab.com/api/1/databases/flyers-data/collections/" + flyerName + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                                data: JSON.stringify({
                                    "flyer_heading": $scope.flyer_heading,
                                    "flyer_name": flyerName,
                                    "selected_Cat": selectedCat,
                                    "selected_Prod": selectedProd,
                                    "selected_Price": selectedPrice,
                                    "prod_image": prodImage,
                                    "flyer_status": "active",
                                    "flyer_generation_date": flyerGenerationDate
                                })
                            }).then(function mySuccess(response) {
                                if (response.status == "200") {
                                    $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Flyer Entry Created    !!").delay(1000).fadeOut();
                                    $("#btnSave").prop('disabled', true);
                                    $("#btnSave").find("i").removeClass("fa-unlock").addClass("fa-lock");

                                    $http({
                                        method: "GET",
                                        url: "https://api.mlab.com/api/1/databases/client/collections?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
                                    }).then(function mySuccess(response) {
                                        for (var i = 0; i < response.data.length; i++) {
                                            if (response.data[i] != "system.indexes") {
                                                $http({
                                                    method: "GET",
                                                    url: "https://api.mlab.com/api/1/databases/client/collections/" + response.data[i] + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
                                                }).then(function mySuccess(response) {
                                                    if (response.data[0].flyerInfo == true) {
                                                        var fcm_token = response.data[0].fcm_token;
                                                        $.ajax({
                                                            type: 'POST',
                                                            url: "https://fcm.googleapis.com/fcm/send",
                                                            headers: {
                                                                Authorization: 'key=' + 'AAAAuqXMpUk:APA91bENMXbUtbOzkEp2_9K_-xmMWOTGp4b_9krWa9GeJGU_uSxlUD3YJfO8NPxwdZ5lSNqhApujliAvJuJIDPGJrCr-1zooPcmToVKrJ-FoDNhnXE4zz2dXIZf4UICRv41ZTi9U-ZEOYait0u_iSNiPDMJTLjoUvg'
                                                            },
                                                            contentType: 'application/json',
                                                            dataType: 'json',
                                                            data: JSON.stringify({
                                                                "to": fcm_token,
                                                                "collapse_key": "type_a",
                                                                "data": {
                                                                    "body": "New Flyer in Market !!",
                                                                    "title": "New Flyer"
                                                                }

                                                            }),
                                                            success: function (response) {
                                                                console.log(response);
                                                            },
                                                            error: function (xhr, status, error) {
                                                                console.log(xhr.error);
                                                            }
                                                        });
                                                    }

                                                }, function myError(response) {
                                                    $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
                                                });
                                            }

                                        }

                                    }, function myError(response) {
                                        $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
                                    });

                                }
                            }, function myError(response) {
                                $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
                            });
                        }
                    });
                }

            }
        }
    }
}]);


function getCategoryData(id) {
    $("#category" + id).html("");
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/stock-database/collections?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            var firstOption = "<option>Select Category</option>";
            $("#category" + id).append(firstOption);
            for (var i = 0; i < data.length; i++) {
                if (data[i] != "system.indexes") {
                    var html = "<option value='" + data[i] + "'>" + data[i] + "</option>";
                    $("#category" + id).append(html);
                }
            }
        }
    });
}




function getProductData(e) {
    var id = $(e).attr("id").replace(/^\D+/g, '');
    $("#product" + id).html("");
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + e.value + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            var firstOption = "<option>Select Product</option>";
            $("#product" + id).append(firstOption);
            for (var i = 0; i < data.length; i++) {
                var html = "<option value='" + data[i].product_name + "'>" + data[i].product_name + "</option>";
                $("#product" + id).append(html);
            }
        }
    });

}

function getProductPrice(e) {
    var prodid = $(e).attr("id").replace(/^\D+/g, '');
    var categoryVal = $("#category" + prodid).val();
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + categoryVal + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].product_name == e.value) {
                    $("#price" + prodid).val(data[i].product_price);
                    if (data[i].product_image == undefined || data[i].product_image == "" || data[i].product_image == null) {
                        $("#image" + prodid).attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png");
                    } else {
                        $("#image" + prodid).attr("src", data[i].product_image);
                    }

                }
            }
        }
    });
}


angular.module('routerApp').controller('viewFlyerController', ['$scope', '$state', '$http', function ($scope, $state, $http) {

    $http({
        method: "GET",
        url: "https://api.mlab.com/api/1/databases/flyers-data/collections/?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        contentType: "application/json"
    }).then(function mySuccess(response) {
        $scope.flyersData = response.data;
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i] != "system.indexes") {
                $http({
                    method: "GET",
                    url: "https://api.mlab.com/api/1/databases/flyers-data/collections/" + response.data[i] + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                    contentType: "application/json"
                }).then(function mySuccess(response) {
                    console.log(response.data[0].flyer_status)
                    if (response.data[0].flyer_status == "inactive") {
                        $("#statusOf" + response.data[i].flyer_name).addClass("fadeDiv");
                    }
                }, function myError(response) {
                    $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
                });
            }
        }

    }, function myError(response) {
        $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
    });



    $scope.showFlyerData = function (flyerName) {
        $http({
            method: "GET",
            url: "https://api.mlab.com/api/1/databases/flyers-data/collections/" + flyerName + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
            contentType: "application/json"
        }).then(function mySuccess(response) {
            $scope.viewbleFlyerData = response.data;
            $scope.flyerHeading = response.data[0].flyer_heading;
            $scope.flyerUniqueCode = response.data[0]._id.$oid;
            $scope.flyerName = response.data[0].flyer_name;
            $scope.flyerStatus = response.data[0].flyer_status;
            $scope.flyerCreationDate = response.data[0].flyer_generation_date;
            if ($scope.flyerStatus == "inactive") {
                $scope.dButton = true;
                $scope.dButton1 = false;
            } else if ($scope.flyerStatus == "active") {
                $scope.dButton = false;
                $scope.dButton1 = true;
            }
        }, function myError(response) {
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
        });
    }
    $scope.deleteFlyer = function () {
        $.ajax({
            url: "https://api.mlab.com/api/1/databases/flyers-data/collections/" + $scope.flyerName + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
            data: JSON.stringify({
                "$set": {
                    "flyer_status": "inactive",
                }
            }),
            type: "PUT",
            contentType: "application/json",
            success: function (data) {
                $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Flyer Successfully In-Active !!").delay(1000).fadeOut();
                $('#showFlyer').modal('hide');
                $state.go('main.dashboard');
            }
        });

    }
    $scope.regainFlyer = function () {
        $.ajax({
            url: "https://api.mlab.com/api/1/databases/flyers-data/collections/" + $scope.flyerName + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
            data: JSON.stringify({
                "$set": {
                    "flyer_status": "active",
                }
            }),
            type: "PUT",
            contentType: "application/json",
            success: function (data) {
                $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Flyer Successfully Active !!").delay(1000).fadeOut();
                $('#showFlyer').modal('hide');
                $state.go('main.dashboard');
            }
        });
    }

}]);


angular.module('routerApp').controller('editFlyerController', ['$scope', '$state', '$http', function ($scope, $state, $http) {}]);
