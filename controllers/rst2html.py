# -*- coding: utf-8 -*-

import os
import sys
from os.path import join as J
#import codecs

from docutils.core import publish_string

#utf8codec = codecs.lookup('utf-8')

# see http://docutils.sourceforge.net/docs/user/config.html
default_rst_opts = {
    # 'doctype_declaration': False, 
    # 'xml_declaration': False,
    # 'title': False,
    # 'no_doc_title': False,
    'no_toc_backlink': True,
    'no_generator': True,
    'no_footnote_backlink': True,
    'no_source_link': True,
    'tab_width': 4,
    'initial_header_level': 2,  ## Title is header level 1.
    'file_insertion_enabled': False,
    'raw_enabled': False,
    'stylesheet_path': None,
    'traceback': True,
    'halt_level': 5,
}

##
##
##
def rst2html(rst, theme=None, opts=None):
    r"""Render rst string and returns the HTML rendered string

    Quite straitghtforward at first view:

        >>> rst = '=====\nTitle\n=====\n\ntest\n====\ntext'
        >>> print rst2html(rst).strip() # doctest: +ELLIPSIS
        <h1...>Title</h1>
        <h2...>test</h2>
        <p>text</p>

    Notice how this is HTML part that must be included in a complete
    HTML document.

    """
    rst_opts = default_rst_opts.copy()
    if opts:
        rst_opts.update(opts)
    rst_opts['template'] = '../themes/template.txt'

    stylesheets = ['basic.css']
    if theme:
        stylesheets.append('%s/%s.css' % (theme, theme))

    rst_opts['stylesheet'] = ','.join([J('../themes/', p)
                                       for p in stylesheets])

    out = publish_string(rst, writer_name='html', settings_overrides=rst_opts)

    return out


