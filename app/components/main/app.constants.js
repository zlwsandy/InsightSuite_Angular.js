/* @ngInject */
angular
    .module('fi.constants')
    .constant('FiConstants', {
        'MAX_IMAGE_SIZE': 10000000,
        'MAX_IMAGE_SLOTS': 5,
        'NO_IMAGE_PATH': 'images/noimages-item.png',
        'NO_IMAGE_STATUS': 'NO_IMAGE',
        'VIEW_TYPE' : {
            'LIST' : 'list',
            'GRID' : 'grid',
            'PRINT' : 'print'
        },
        'GAME_TYPE' : {
            'WWTP' : 'WWYP',
            'STYLE_OPT' : 'THREE_PREFERENCE'
        },
        'MENU_OPTIONS' : {
            'PRINT_OPTION_VALUE' : 'print',
            'EXPORT_FLEXPLM_OPTION_VALUE' : 'exportflexplm',
            'HIDE_OPTION_VALUE' : 'hide',
            'SHOW_OPTION_VALUE' : 'show',
            'RERUN_OPTION_VALUE' : 'rerun',
            'DOWNLOAD_COMMENTS_OPTION_VALUE' : 'downloadcomments'
        }
    });
