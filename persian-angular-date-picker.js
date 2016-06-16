angular.module('bizbank.angular', []).directive('persianAngularDatePicker', ['$timeout', function ($timeout) {
    var _dayName = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    var _dayName2 = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    var _monthName = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    var offset = function (elem) {
        var docElem, win, rect, doc;
        if (!elem) return;

        rect = elem.getBoundingClientRect();

        // Make sure element is not hidden (display: none) or disconnected
        if (rect.width || rect.height || elem.getClientRects().length) {
            doc = elem.ownerDocument;
            win = window
            docElem = doc.documentElement;

            return {
                top: rect.top + win.pageYOffset - docElem.clientTop,
                left: rect.left + win.pageXOffset - docElem.clientLeft
            };
        }
    }
    function isLeapYear(year) {
        return (((((year - 474) % 2820) + 512) * 682) % 2816) < 682;
    }
    function getMonthDays(date) {
        var dateArray = date.split('/');
        if (dateArray[1] < 7)
            return 31;
        if (dateArray[1] < 12)
            return 30;
        return isLeapYear(dateArray[0]) ? 30 : 29;
    }
    return {
        restrict: 'E',
        require: 'ngModel',
        priority: 1,
        transclude: false,
        scope: {
            ngModel: "=",
            ngMoment: "=?",
            dateChange: "&"
        },
        link: function (scope, element, attrs, ngModel) {
            console.log('link')
            scope.dayName = _dayName;
            scope.picker = {
                visible: false,
                left: 0,
                right: 0,
                width: 337,
                table: []
            }
            var now = moment();
            scope.years = [];
            scope.selectedYear;
            var j = 0, m = 0;
            for (var i = -60; i < 20; i++) {
                var year = moment().add(i, 'jYear').format('jYYYY');
                scope.years.push({ id: j++, year: year });
            }

            scope.months = [];
            scope.selectedMonth;
            for (var i = 0; i < _monthName.length; i++) {
                scope.months.push({ id: m++, month: _monthName[i] });
            }
            scope.selectedDay;

            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (modelValue) {
                scope.date = (!modelValue) ? now.format('jYYYY/jMM/jDD') : modelValue;
                scope.updateTable = function () {
                    scope.picker.table = [
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0]];
                    var dateParts = scope.date.split('/');
                    var year = (dateParts[0]);
                    var month = (dateParts[1]);
                    var day = (dateParts[2]);
                    var momentDate = moment(scope.date, 'jYYYY/jMM/jDD');
                    var firstDay = year + '/' + month + '/01'
                    var momentFirstDay = moment(firstDay, 'jYYYY/jMM/jDD');
                    var daysOfMonth = parseInt(getMonthDays(firstDay));

                    var startDay = _dayName2[momentFirstDay.weekday()];
                    var startDayIndex = _dayName.indexOf(startDay);
                    var row = 0;
                    var col = startDayIndex;
                    for (var i = 0; i < daysOfMonth; i++) {
                        if ((scope.picker.table[row]))
                            (scope.picker.table[row])[col] = i + 1;
                        col++;
                        if (col > 6) {
                            col = 0;
                            row++;
                        }
                    }
                }
                scope.gotoToday = function () {
                    var year = now.format('jYYYY');
                    var month = now.format('jM');;
                    var day = now.format('jD');;
                    scope.updateDate(year, month, day)
                };

                scope.updateDate = function (year, month, day) {
                    if (scope.date) {
                        if (scope.date.length == 10) {
                            var dateParts = scope.date.split('/');
                            year = year ? year : (dateParts[0]);
                            month = month ? (month < 10 ? "0" + month : month) : (dateParts[1]);
                            day = day ? (day < 10 ? "0" + day : day) : (dateParts[2]);
                        }
                        if (scope.date.length == 8) {
                            year = year ? year : scope.date.substr(0, 4);
                            month = month ? month : scope.date.substr(4, 2);
                            day = day ? day : scope.date.substr(6, 2);
                        }

                        scope.date = year + '/' + month + '/' + day;
                        for (var i = 0; i < scope.years.length; i++)
                            scope.selectedYear = (scope.years[i].year == parseInt(year)) ? scope.years[i] : scope.selectedYear;
                        scope.selectedMonth = scope.months[parseInt(month) - 1];
                        scope.selectedDay = day;
                        scope.updateTable();

                        ngModel.$setViewValue(scope.date);
                        //log(ngModel);
                        ngModel.$render();
                    }
                };
                scope.updateDate(null, null, null);
                scope.updateTable();
                if (scope.dateChange) scope.dateChange();
                scope.ngMoment = moment(scope.ngModel, "jYYYY/jMM/jDD");
            });

            scope.showPicker = true;
            scope.toggle = function (show, e) {
                scope.showPicker = !scope.showPicker;
                if (show) {
                    scope.picker.visible = true;
                    var box = angular.element(e.target)[0];
                    var picker = angular.element(e.target.nextSibling);
                    var offsetBox = offset(box);
                    scope.picker.left = offsetBox.left + box.clientWidth - scope.picker.width + 4;
                    scope.picker.top = offsetBox.top + box.clientHeight + 4;
                }
            }
            scope.mask = function (e) {
                //log(e);
                //log(scope.date)
                return false;
                var v = scope.date;
                if (v.match(/^\d{4}$/) !== null) {
                    scope.date = v + '/';
                } else if (v.match(/^\d{4}\/\d{2}$/) !== null) {
                    scope.date = v + '/';
                }
            };

            var htmlTag = angular.element(document.getElementsByTagName('html')[0]);
            var txtBox = angular.element(element.find("input")[0]);
            var datePicker = angular.element(element.find("div")[1]);

            scope.show = function () {
                var box = txtBox[0];
                var picker = datePicker;
                picker.removeClass("ng-hide");
                var offsetBox = offset(txtBox[0]);
                var left = offsetBox.left + box.clientWidth - datePicker[0].clientWidth + 4;
                var top = offsetBox.top + box.clientHeight + 4;
                datePicker.css({ 'left': left.toString() + "px", 'top': top.toString() + "px" });
            }
            scope.hide = function () {
                angular.element(document.querySelectorAll(".date-picker")).addClass("ng-hide")
            }

            txtBox.on('click', function (e) {
                scope.hide();
                scope.show();
                e.preventDefault();
                e.stopPropagation();
            });
            datePicker.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            htmlTag.on('click', function (e) {
                scope.hide();
                return false;
            });
        },
        templateUrl: '/persian-angular-date-picker.html'
    }
}]);

