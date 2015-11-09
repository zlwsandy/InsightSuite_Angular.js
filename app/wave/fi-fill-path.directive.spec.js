'use strict';

describe('Directive: fillPath', function () {
    beforeEach(module('fi.wave'));

    var element, scope, changeInputValue;

    beforeEach(inject(function ($rootScope, $compile) {
        element = angular.element(' <div fi-fill-path>' +
            '<md-input-container flex class="md-primary">' +
            '<input ng-model="create.name" ng-minlength="1" ng-maxlength="150" ng-required="true">' +
            '</md-input-container> <div class="input-has-value">' +
            'http://gp.test.com/.../' +
            '<input type="text" ng-required="true" class="wave-url-path">.html</div>' +
            '<span class="wave-span-hidden">invisible</span> </div>');

        scope = $rootScope;

        $compile(element)(scope);
        scope.$digest();

        changeInputValue = function (elem, value) {
            elem.val(value);
            elem.triggerHandler('keyup');
        };
    }));

    it("can have spaces in wave name", function () {
        var inputs = element.find('input');
        var waveName = angular.element(inputs[0]);
        changeInputValue(waveName, 'Test Wave');
        expect(waveName.val()).toBe('Test Wave');
    });

    it("should not have spaces in wave path and should be lowercase", function () {
        var inputs = element.find('input');
        var waveName = angular.element(inputs[0]);
        var wavePath = angular.element(inputs[1]);
        changeInputValue(waveName, 'Test Wave');
        changeInputValue(wavePath, 'Test Wave');
        expect(wavePath.val()).toBe('testwave');
    });

    it("should not have special characters in wave path", function () {
        var inputs = element.find('input');
        var wavePath = angular.element(inputs[1]);
        changeInputValue(wavePath, ':   /   #   ?   &   @   %   +    ;   =   $, < > ~ ^ `    [   ]   {   }   |   "');
        expect(wavePath.val()).toBe('');
    });
    
});
