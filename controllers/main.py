# -*- coding: utf-8 -*-


from .rst2html import rst2html
from web.http import Controller, jsonrequest


class Home(Controller):
    _cp_path = '/web_markitup'

    @jsonrequest
    def rst2html(self, req, source, theme=None, opts=None):
        return rst2html(source, theme, opts) if source else ""
