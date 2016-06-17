# Persian Angular Date Picker تاریخ شمسی انگولار

## Requirments
- angular 1.x - https://angularjs.org
- momentjs - http://momentjs.com/
- moment-jalali - https://github.com/jalaali/moment-jalaali

## Installation
Open index.html file in project for demo.
- Add angular.js
- Add moment.js and moment-jalali.js
- Add persian-angular-date-picker.css
- Add persian-angular-date-picker.js
- Update your app defination:
        var app = angular.module('date-picker-demo', ['bizbank.angular']);
- Use the directive:
        &lt;persian-angular-date-picker ng-model="model" date-change="change()" &gt;&lt;/persian-angular-date-picker&gt;

ng-model: required

date-change: optional

Thanks to @AkbarTaghipour
