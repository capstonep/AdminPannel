angular.module('routerApp').controller('clientsController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
    $http({
        method: "GET",
        url: "https://api.mlab.com/api/1/databases/client/collections?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
    }).then(function mySuccess(response) {
        $scope.clients = response.data;
        for (var i = 0; i < response.data.length; i++) {
            $http({
                method: "GET",
                url: "https://api.mlab.com/api/1/databases/client/collections/" + response.data[i] + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
            }).then(function mySuccess(response) {
                console.log(response.data[0].user_status)
                if (response.data[0]._id != undefined && response.data[0].user_status == "active") {
                    var html = '<div class="card"><i class="fa fa fa-trash deleteUser" onclick="deleteUser(\'' + response.data[0]._id.$oid + '\',\'' + response.data[0].username + '\')"></i>';
                    html += '<img class="card-img-top" src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/512/user-male-icon.png" alt="Card image" style="width:80px">';
                    html += '<div class="card-body">';
                    html += '    <h4 class="card-title">' + response.data[0].firstname + '</h4>';
                    html += '    <hr>';
                    html += '    <h5><i class="fa fa-yelp"></i> Status - <span>' + response.data[0].user_status + '<span></h5>';
                    html += '    <hr>';
                    html += '    <h5><i class="fa fa-phone"></i> Contact - <span>' + response.data[0].contact + '<span></h5><hr>';
                    html += '    <h5><i class="fa fa-child"></i> Username - <span>' + response.data[0].username + '<span></h5><hr>';
                    if (response.data[0].cardPoints == undefined) {
                        html += '    <h5><i class="fa fa-credit-card"></i> Card Points - <span>0<span></h5>';
                    } else {
                        html += '    <h5><i class="fa fa-credit-card"></i> Card Points - <span>' + response.data[0].cardPoints + '<span></h5>';
                    }

                    html += '</div>';
                    html += '</div>';
                    $("#client" + response.data[0].username).append(html);
                } else if (response.data[0]._id != undefined && response.data[0].user_status == "inactive") {
                    var html = '<div class="card inactiveDiv"><i class="fa fa-thumbs-o-up activeUser" onclick="activeUser(\'' + response.data[0]._id.$oid + '\',\'' + response.data[0].username + '\')"></i>';
                    html += '<img class="card-img-top" src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/512/user-male-icon.png" alt="Card image" style="width:80px">';
                    html += '<div class="card-body">';
                    html += '    <h4 class="card-title">' + response.data[0].username + '</h4>';
                    html += '    <hr>';
                    html += '    <h5><i class="fa fa-yelp"></i> Status - <span>' + response.data[0].user_status + '<span></h5>';
                    html += '    <hr>';
                    html += '    <h5><i class="fa fa-phone"></i> Contact - <span>' + response.data[0].contact + '<span></h5><hr>';
                    html += '    <h5><i class="fa fa-child"></i> Username - <span>' + response.data[0].username + '<span></h5><hr>';
                    if (response.data[0].cardPoints == undefined) {
                        html += '    <h5><i class="fa fa-credit-card"></i> Card Points - <span>0<span></h5>';
                    } else {
                        html += '    <h5><i class="fa fa-credit-card"></i> Card Points - <span>' + response.data[0].cardPoints + '<span></h5>';
                    }

                    html += '</div>';
                    html += '</div>';
                    $("#client" + response.data[0].username).append(html);
                }

            }, function myError(response) {
                $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
            });
        }

    }, function myError(response) {
        $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Error !!").delay(1000).fadeOut();
    });

    $scope.findClient = function () {
        $(".card .card-body h4").each(function () {
            if ($(this).text().search(new RegExp($scope.clientInfo, "i")) < 0) {
                $(this).parent().parent().parent().parent().fadeOut();
            } else {
                $(this).parent().parent().parent().parent().fadeIn();
            }
        });

    }



}]);

function deleteUser(id, name) {
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/client/collections/" + name + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        data: JSON.stringify({
            "$set": {
                "user_status": "inactive",
            }
        }),
        type: "PUT",
        contentType: "application/json",
        success: function (data) {
            //$state.go('main.dashboard');
            location.href = "/index.html#/main/dashboard";
            $(".alert").removeAttr('class').addClass('alert alert-danger').fadeIn().text("Successfully Delete the User !!").delay(1000).fadeOut();
        }
    });
}

function activeUser(id, name) {
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/client/collections/" + name + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        data: JSON.stringify({
            "$set": {
                "user_status": "active",
            }
        }),
        type: "PUT",
        contentType: "application/json",
        success: function (data) {
            //$state.go('main.dashboard');
            location.href = "/index.html#/main/dashboard";
            $(".alert").removeAttr('class').addClass('alert alert-success').fadeIn().text("Successfully Active the User !!").delay(1000).fadeOut();
        }
    });
}
