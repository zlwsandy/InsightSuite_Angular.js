'use strict';

describe('textbox-editable directive', function () {
    var $rootScope,
        $compile,
        element;

    // the module that the directive is in
    beforeEach(module('fi.common'));

    // the module that the directive's template is in
    beforeEach(module('components/utils/textboxEditable.directive.html'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(inject(function($compile, $rootScope) {
        // setup test variables for scope
        $rootScope.model = { value: null, editableIndex: 0, index: 0 };
        // create instance of the directive
        element = angular.element(
            '<div textbox-editable ng-model="model.value" editable-index="model.editableIndex" index="model.index" id="itemName-{{item.itemId}}" class="insight-setup-items-name">{{item.name}}</div>'
        );
        // compile the directive
        $compile(element)($rootScope);
    }));

    it('should set the value on the isolate scope', function () {
        var value = 'unique name',
            isoScope;

        $rootScope.model.value = value;
        $rootScope.model.editableIndex = 0;
        $rootScope.model.index = 0;

        // update html with new scope values
        $rootScope.$digest();

        // get isolate scope for the directive
        isoScope = element.isolateScope();

        // make assertions
        expect(isoScope.value).toEqual(value);
        expect(isoScope.editableIndex).toEqual($rootScope.model.editableIndex);
        expect(isoScope.index).toEqual($rootScope.model.index);
    });
});
