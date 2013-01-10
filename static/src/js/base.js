/*global: openerp */

openerp.web_markitup = function (oe) {

    var QWeb = oe.web.qweb,
    _t  = oe.web._t,
    _lt = oe.web._lt;

    oe.web.form.widgets.add('markitup', 'openerp.web_markitup.FieldTextMarkitup');
    oe.web.form.widgets.add('pre_html', 'openerp.web_markitup.FieldTextPreHtml');
    oe.web.form.widgets.add('rst2html_readonly', 'openerp.web_markitup.FieldTextRst2HtmlReadOnly');

    oe.web_markitup.FieldTextPreHtml = oe.web.form.FieldTextHtml.extend({
        render_value: function() {
            if (! this.get("effective_readonly")) {
                return this._super.apply(this, arguments);
            } else {
                this.$el.html("<pre>" + this.get('value') + "</pre>");
            }
        },
    });

    oe.web_markitup.FieldTextRst2HtmlReadOnly = oe.web.form.FieldTextHtml.extend({
        template: 'FieldTextRst2HtmlReadOnly',

        _set_preview_html: function(html) {
            this.$el.html(html);
        },

        render_value: function() {
            var self = this;
            if (! this.get("effective_readonly")) {
                return this._super.apply(this, arguments);
            } else {
                // XXXvlab: put a loading symbol
                this.rpc('/web_markitup/rst2html', {
                    'source': this.get('value'),
                    'theme': 'nature',
                }).then(function(html_content) {
                    self._set_preview_html(html_content);
                });
            }
        },
    });

    oe.web_markitup.FieldTextMarkitup = oe.web.form.AbstractField.extend(oe.web.form.ReinitializeFieldMixin, {
        template: 'FieldMarkItUp',
        display_name: _lt('Markitup'),
        widget_class: 'oe_form_field_markitup',
        events: {
            'change input': 'store_dom_value',
        },

        init: function (field_manager, node) {
            this._super(field_manager, node);
            this.$txt = false;
        },

        _get_raw_value: function() {
            if (this.$txt === false)
                return '';
            return this.$txt.val();
        },

        initialize_content: function() {
            this.$txt = this.$el.find('textarea[name="' + this.name + '"]');
            this.setupFocus(this.$txt);
        },

        store_dom_value: function () {
            if (!this.get('effective_readonly')
                && this._get_raw_value() !== ''
                && this.is_syntax_valid()) {
                this.internal_set_value(
                    this.parse_value(
                        this._get_raw_value()));
            }
        },

        commit_value: function () {
            this.store_dom_value();
            return this._super();
        },

        render_value: function() {
            var show_value = this.format_value(this.get('value'), '');
            if (!this.get("effective_readonly")) {
                this.$txt.val(show_value);
                this.$txt.markItUp(mySettings);
            } else {
                // XXXvlab: does nothing
                //this.$(".oe_form_char_content").text('<pre>' + show_value + '</pre>');
            }
        },

        is_syntax_valid: function() {
            if (!this.get("effective_readonly") && this._get_raw_value().length > 0) {
                try {
                    this.parse_value(this._get_raw_value(), '');
                    return true;
                } catch(e) {
                    return false;
                }
            }
            return true;
        },

        parse_value: function(val, def) {
            return oe.web.parse_value(val, this, def);
        },

        format_value: function(val, def) {
            return oe.web.format_value(val, this, def);
        },

        is_false: function() {
            return this.get('value') === '' || this._super();
        },

        // XXXvlab: how to test ?
        focus: function() {
            this.$('textarea:first')[0].focus();
        },

        set_dimensions: function (height, width) {
            this._super(height, width);
            this.$('textareat').css({
                height: height,
                width: width
            });
        }
    });
};
