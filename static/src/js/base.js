/*global: openerp,window,QWeb,_,mySettings,$ */


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
        }
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
                    'theme': 'nature'
                }).then(function(html_content) {
                    self._set_preview_html(html_content);
                });
            }
        }
    });

    oe.web_markitup.FieldTextMarkitup = oe.web.form.AbstractField.extend(
        oe.web.form.ReinitializeFieldMixin, {

        template: 'FieldMarkItUp',
        display_name: _lt('Markitup'),
        widget_class: 'oe_form_field_markitup',
        events: {
            'change input': 'store_dom_value'
        },

        init: function (field_manager, node) {
            this._super(field_manager, node);
            this.$txt = false;

            this.old_value = null;
        },

        destroy_content: function () {
            // console.log("MY DESTROY CONTENT");
            if (this.$el.data('splitter'))
                this.$el.splitter('destroy');
        },

        initialize_content: function() {
            // Gets called at each redraw of widget
            //  - switching between read-only mode and edit mode
            //  - BUT NOT when switching to next object.
            var self = this;
            this.$txt = this.$el.find('textarea[name="' + this.name + '"]');
            this.$preview_pane = this.$el.find('.oe_preview_pane');
            this.$preview = this.$el.find('div.oe_form_field_markitup_preview');
            this.setupFocus(this.$txt);
            if (!this.get('effective_readonly')) {
                this.$txt.scroll(function() {self.sync_scroll_position();});
                this.$txt.bind('change keyup', function() {
                    self._gen_preview_html();
                });
                this.$txt.markItUp(
                    $.extend(mySettings, {
                        resizeHandle: false,
                    }));
                this.init_splitter();
            }
            this.old_value = null; // will trigger a redraw
        },

        init_splitter: function () {
            // console.log("INIT NEW SPLITTER");
            return this.$el.splitter({
                type: "v",
                dock: "rightDock",
                minRight: 250,
                dockSpeed: 200,
                resizeToWidth: true,
            });
        },

        _get_raw_value: function() {
            if (this.$txt === false)
                return '';
            return this.$txt.val();
        },

        _set_preview_html: function(html) {
            this.$preview.html(html);
        },

        _gen_preview_html: function() {
            if (this.$preview_pane.css('display') == "none")
                return;
            // XXXvlab: put a loading symbol
            var self = this;
            var value = this._get_raw_value();
            if (_.isEqual(value, this.old_value)) return;
            this.old_value = value;
            // Triggers store_dom_value and dirty state.
            // ``internal`` is required to stop rerendering which
            // would reset textarea view position to top.
            this.internal_set_value(value);
            this.rpc('/web_markitup/rst2html', {
                'source': value
            }).then(function(html_content) {
                self._set_preview_html(html_content);
                self.sync_scroll_position();
            });
        },

        store_dom_value: function () {
            if (!this.get('effective_readonly') &&
                this._get_raw_value() !== '' &&
                this.is_syntax_valid()) {
                // We use internal_set_value because we were called by
                // ``.commit_value()`` which is called by a ``.set_value()``
                // itself called because of a ``onchange`` event
                this.internal_set_value(
                    this.parse_value(
                        this._get_raw_value()));
            }
        },

        commit_value: function () {
            this.store_dom_value();
            return this._super();
        },

        sync_scroll_position: function () {

            var editorScrollRange = (this.$txt[0].scrollHeight - this.$txt.innerHeight());
            var previewScrollRange = (this.$preview_pane[0].scrollHeight -
                                      this.$preview_pane.innerHeight());

            // Find how far along the editor is (0 means it is scrolled to the top, 1
            // means it is at the bottom).
            var scrollFactor = this.$txt.scrollTop() / editorScrollRange;

            // Set the scroll position of the preview pane to match.  jQuery will
            // gracefully handle out-of-bounds values.
            this.$preview_pane.scrollTop(scrollFactor * previewScrollRange);
        },

        render_value: function() {
            // Gets called at each redraw/save of widget
            //  - switching between read-only mode and edit mode
            //  - when switching to next object.

            var show_value = this.format_value(this.get('value'), '');
            var self = this;
            if (!this.get("effective_readonly")) {
                this.$txt.val(show_value);
                self._gen_preview_html();
                this.$el.trigger('resize');
            } else {
                // avoids loading markitup...
                this.$txt.val(show_value);
                self._gen_preview_html();
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
