(function () {
    'use strict';

    var icons = {
        checkmark: 'M9 16.17l-4.17-4.17-1.42 1.41 5.59 5.59 12-12-1.41-1.41z',
        playarrow: 'M8 5v14l11-7z',
        star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
        circle: 'M12,2C6.5,2,2,6.5,2,12c0,5.5,4.5,10,10,10c5.5,0,10-4.5,10-10C22,6.5,17.5,2,12,2z'
    };

    function svgIconLink(scope, element, attrs) {

        /**
        * the viewBox dimensions have been set based on the MD icon sizes and our insight & item image aspect ratios so
        * the icons will (should) scale for any sizes passed to img-crop as long as they maintain aspect ratio
        */
        function buildSvg(width, height, icon, cssClass) {
            return '<svg width="' + width + '" height="' + height + '" viewBox="-100 -2 125 125" class="' + cssClass + '">' + '<path d="' + icons[icon] + '"/>' + '</svg>';
        }

        function renderSvg() {
            element.html(buildSvg(attrs.svgWidth, attrs.svgHeight, attrs.icon, attrs.cssClass));
        }

        renderSvg();

    }

    /* @ngInject */
    function fiSvgIcon() {
        return {
            restrict: 'E',
            link: svgIconLink
        };
    }

    angular
        .module('fi.common')
        .directive('fiSvgIcon', fiSvgIcon);

})();
