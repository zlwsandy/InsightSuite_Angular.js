(function () {
    'use strict';

    /* @ngInject */
    function LodashFactory() {

        // Return so that it can be injected into other aspects of the AngularJS application.
        /*jshint undef:false */
        return (_);
    }

    angular
        .module('fi.common')
        .service('_', LodashFactory);
}());
