# -*- coding: utf-8 -*-


from .rst2html import rst2html
from openerp.http import Controller, route


class Home(Controller):

    @route(['/web_markitup/rst2html/'], type='json', auth="public")
    def rst2html(self, source, theme=None, opts=None):
        return rst2html(source, theme, opts) if source else ""
