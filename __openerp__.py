# -*- coding: utf-8 -*-

{
    "name": 'web_markitup',
    "version": "0.1",
    "depends": ['web'],
    "author": "Valentin LAB <valentin.lab@0k.io>",
    "installable": True,
    "active": False,
    "js": ["static/src/js/*.js",
           "static/lib/js/splitter/splitter.js",
           "static/lib/js/markit/sets/rest/set.js",
           "static/lib/js/markit/jquery.markitup.js", ],
    "css": ["static/lib/js/markit/sets/rest/style.css",
            "static/lib/js/markit/skins/markitup/style.css",
            "static/src/css/ReST/basic.css",          ## basic Rest HTML css
            "static/src/css/ReST/nature/nature.css",  ## nature theme
            "static/src/css/*.css",
            ],
    "qweb": ["static/src/xml/*.xml",
             ],
}
