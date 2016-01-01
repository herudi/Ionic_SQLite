# Ionic Featuring SQLite
```
ionic start ionicSQLite blank
cd ionicSQLite
ionic platform add android
ionic platform add ios
cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin.git
```
Just copy this project to ionicSQLite/www 
add ng-cordova from bower
```
bower install ngCordova
```
and look like this on index.html
```html
<script src="lib/ionic/ng-cordova.min.js"></script>
<script src="cordova.js"></script>
```
enjoy....
