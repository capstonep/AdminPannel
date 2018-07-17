angular.module('routerApp').controller('ordersController', ['$scope', '$state', '$http', '$interval', function ($scope, $state, $http, $interval) {
    $scope.renderOrderData = function () {

        $http({
            method: "GET",
            url: "https://api.mlab.com/api/1/databases/booked-orders/collections?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
        }).then(function mySuccess(response) {

            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i] != "system.indexes") {
                    $http({
                        method: "GET",
                        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + response.data[i] + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
                    }).then(function mySuccess(response) {
                        $("#orders").html("");
                        for (var j = 0; j < response.data.length; j++) {
                            if (response.data[j].orderStatus == "new") {
                                var html = '<tr class="button-glow">';
                            } else {
                                var html = '<tr>';
                            }
                            html += '<td class="id">' + response.data[j]._id.$oid + '</td>';
                            html += '<td>Jan 1,2015<br> 12:35 PM</td>';
                            html += '<td class="cnt_name">' + response.data[j].contact_name + '</td>';
                            html += '<td class="user_name">' + response.data[j].username + '</td>';
                            html += '<td class="address">' + response.data[j].housenumber + ' ';
                            html += '' + response.data[j].streetName + ' ';
                            html += '' + response.data[j].city + ' ';
                            html += '' + response.data[j].zip + '</td>';
                            html += '<td><button onclick="showList(this)" type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#orderItems"><span class="fa fa-copy"></span> Items</button></td>';

                            html += '<td>$' + response.data[j].orderItems[response.data[j].orderItems.length - 4] + '</td>';
                            html += '<td class="pointsEarned">' + response.data[j].orderItems[response.data[j].orderItems.length - 1] + '</td>';
                            html += '<td>' + response.data[j].paymentMode + '</td>';
                            html += '<td>Delivery</td>';
                            html += '<td class="order_status">' + response.data[j].orderStatus + '</td>';
                            if (response.data[j].orderStatus == "new") {
                                html += '<td class="confirmBtn"><button type="button" class="btn btn-success btn-sm" onclick="confirmOrder(this)"><span class="fa fa-arrow-circle-o-right">';
                                html += '</span> Confirm</button></td>';
                            } else if (response.data[j].orderStatus == "confirmed") {
                                html += '<td class="departBtn"><button type="button" class="btn btn-warning btn-sm" onclick="departOrder(this)"><span class="fa fa-arrow-circle-o-right">';
                                html += '</span> Depart</button></td>';
                            } else if (response.data[j].orderStatus == "depart") {
                                html += '<td class="deliveredBtn"><button type="button" class="btn btn-info btn-sm" onclick="deliveredOrder(this)"><span class="fa fa-arrow-circle-o-right">';
                                html += '</span> Delivered</button></td>';
                            } else if (response.data[j].orderStatus == "delivered") {
                                html += '<td>';
                                html += '</td>';
                            }


                            html += '<td><button onclick="deleteOrder(this)" type="button" class="btn btn-danger btn-sm"><span class="fa fa-trash"></span> Delete</button></td>';
                            html += '</tr> ';
                            $("#orders").append(html);


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
    $scope.renderOrderData();
    $interval(function () {
        $scope.renderOrderData();
    }, 3000);


}]);

function showList(e) {
    $(e).parent().parent().removeClass("button-glow");
    var id = $(e).parent().parent().find(".id").text();
    var user_name = $(e).parent().parent().find(".user_name").text();
    $("#orderedItems").html("");
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + user_name + "/" + id + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            for (var i = 0; i < data.orderItems.length; i++) {
                var html = "<tr><td>" + data.orderItems[i] + "</td>";
                html += "<td>" + data.orderItems[i + 1] + "</td>";
                html += "<td>$" + data.orderItems[i + 2] + "</td></tr>";
                $("#orderedItems").append(html);
                i++;
                i++;

            }
        }
    });
}

function confirmOrder(e) {
    $(e).parent().parent().removeClass("button-glow");
    var id = $(e).parent().parent().find(".id").text();
    var user_name = $(e).parent().parent().find(".user_name").text();

    $.ajax({
        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + user_name + "/" + id + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        data: JSON.stringify({
            "$set": {
                "orderStatus": "confirmed"
            }
        }),
        type: "PUT",
        contentType: "application/json",
        success: function (data) {

        }
    });
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/client/collections/" + user_name + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            if (data[0].deliveryInfo == true) {
                var fcm_token = data[0].fcm_token;
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
                            "body": "Order Confirmed",
                            "title": "Order Details"
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
        }
    });


}

function departOrder(e) {
    $(e).parent().parent().removeClass("button-glow");
    var id = $(e).parent().parent().find(".id").text();
    var user_name = $(e).parent().parent().find(".user_name").text();

    $.ajax({
        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + user_name + "/" + id + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        data: JSON.stringify({
            "$set": {
                "orderStatus": "depart"
            }
        }),
        type: "PUT",
        contentType: "application/json",
        success: function (data) {

        }
    });
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/client/collections/" + user_name + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            if (data[0].deliveryInfo == true) {
                var fcm_token = data[0].fcm_token;
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
                            "body": "Order Departed",
                            "title": "Order Details"
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

        }
    });


}

function deliveredOrder(e) {
    $(e).parent().parent().removeClass("button-glow");
    var id = $(e).parent().parent().find(".id").text();
    var user_name = $(e).parent().parent().find(".user_name").text();
    var card_points = $(e).parent().parent().find(".pointsEarned").text();

    $.ajax({
        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + user_name + "/" + id + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        data: JSON.stringify({
            "$set": {
                "orderStatus": "delivered"
            }
        }),
        type: "PUT",
        contentType: "application/json",
        success: function (data) {}
    });
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/client/collections/" + user_name + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            if (data[0].cardPoints == "") {
                data[0].cardPoints = 0;
            }
            var points = parseInt(data[0].cardPoints) + parseInt(card_points);
            $.ajax({
                url: "https://api.mlab.com/api/1/databases/client/collections/" + user_name + "/" + data[0]._id.$oid + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                data: JSON.stringify({
                    "$set": {
                        "cardPoints": points
                    }
                }),
                type: "PUT",
                contentType: "application/json",
                success: function (data) {
                    if (data[0].cardInfo == true) {
                        var fcm_token = data[0].fcm_token;
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
                                    "body": "Card Points Added",
                                    "title": "Card Points"
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
                }
            });
        }
    });
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/client/collections/" + user_name + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            if (data[0].deliveryInfo == true) {
                var fcm_token = data[0].fcm_token;
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
                            "body": "Order Delivered",
                            "title": "Order Details"
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

        }
    });



}

function deleteOrder(e) {
    $(e).parent().parent().removeClass("button-glow");
    var id = $(e).parent().parent().find(".id").text();
    var user_name = $(e).parent().parent().find(".user_name").text();

    $.ajax({
        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + user_name + "/" + id + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "DELETE",
        async: true,
        timeout: 300000,
        success: function (data) {},
        error: function (xhr, status, err) {}
    });
}
angular.module('routerApp').controller('preordersController', ['$scope', '$state', '$http', function ($scope, $state, $http) {

}]);
