(function () {
    var db;
    var app = angular.module('starter', ['ionic', 'ngCordova', 'jett.ionic.filter.bar']);
    app.run(function ($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            db = $cordovaSQLite.openDB("friend.db");
            $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS person (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,addr TEXT,tlp TEXT)');
        });
    });
    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'templates/home.html',
                    controller: 'homeCtrl'
                });
        $urlRouterProvider.otherwise('/home');
    });
    app.controller('homeCtrl', function ($ionicLoading,$scope, $cordovaSQLite, $ionicModal, $ionicFilterBar, $timeout, $ionicPopup) {
        $scope.post = {};
        $scope.put = {};
        var filterBarInstance;
        $ionicLoading.show({
            template: 'Loading...'
        });
        $timeout(function () {
            $ionicLoading.hide();
            getList();
        }, 3000);
        $scope.add = function () {
            var data = [];
            angular.forEach($scope.post, function (element) {
                data.push(element);
            });
            var query = "INSERT INTO person(name,addr,tlp) VALUES (?,?,?)";
            $cordovaSQLite.execute(db, query, data).then(function () {
                $ionicPopup.alert({
                    title: "Information",
                    template: "Saving data success",
                    okText: 'Ok',
                    okType: 'button-positive'
                });
                $scope.post = {};
                getList();
            }, function (err) {
                console.log(err.message);
            });
        };
        $scope.edit = function () {
            var query = "update person set name = ?,addr=?,tlp=? where id=?";
            $cordovaSQLite.execute(db, query, [
                $scope.put.name,
                $scope.put.addr,
                $scope.put.tlp,
                $scope.put.id
            ]).then(function () {
                $ionicPopup.alert({
                    title: "Information",
                    template: "Update data success",
                    okText: 'Ok',
                    okType: 'button-positive'
                });
                getList();
            }, function (err) {
                console.log(err.message);
            });
        };
        
        function getList() {
            $cordovaSQLite.execute(db, 'SELECT * FROM person').then(function (res) {
                $scope.datas = [];
                for (var i = 0; i < res.rows.length; i++) {
                    $scope.datas.push(res.rows.item(i));
                }
            }, function (err) {
                console.log(err.message);
            });
        };
        $ionicModal.fromTemplateUrl('templates/add.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalAdd = modal;
        });
        $ionicModal.fromTemplateUrl('templates/edit.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalEdit = modal;
        });
        $scope.closeEdit = function () {
            $scope.modalEdit.hide();
        };
        $scope.closeAdd = function () {
            $scope.modalAdd.hide();
        };
        $scope.goAdd = function () {
            $scope.modalAdd.show();
        };
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.datas,
                update: function (filteredItems) {
                    $scope.datas = filteredItems;
                }
            });
        };
        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }
            $timeout(function () {
                getList();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
        $scope.click = function (data) {
            $ionicPopup.show({
                title: 'Confirm',
                template: "what is your choice ?",
                buttons: [
                    {
                        text: 'Delete',
                        type: 'button-assertive',
                        onTap: function () {
                            var query = "delete from person where id = ?";
                            $cordovaSQLite.execute(db, query, [data.id]).then(function () {
                                $ionicPopup.alert({
                                    title: "Information",
                                    template: "Delete data success",
                                    okText: 'Ok',
                                    okType: 'button-positive'
                                });
                                getList();
                            }, function (err) {
                                console.log(err.message);
                            });
                        }
                    },
                    {
                        text: 'Edit',
                        type: 'button-positive',
                        onTap: function () {
                            $scope.put = data;
                            $scope.modalEdit.show();
                        }
                    }
                ]
            });
        };
    });

})();