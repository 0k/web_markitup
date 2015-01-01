====================
MarkItUp for OpenERP
====================


Description
===========

This OpenERP 8.0+ module defines a ``markitup`` widget for form
fields. Currently configured to edit/display ReSTructured Text, but could be
easily modified to manage any other markup langage.

MarkItUp_ is a jQuery plugin allowing to turn any textarea into a markup editor.

.. _MarkItUp: http://markitup.jaysalvat.com


In this current early form, ``web_markitup`` is replicating anru's `rsted`_
capabilities in target OpenERP textarea : allowing dynamic preview of
ReSTructured text (follow this link to see `an online demo of rsted`_).

.. _rsted: https://github.com/anru/rsted
.. _an online demo of rsted: http://rst.ninjs.org/


Requirements
============

Works on OpenERP v8.0+ with Linux system.

The ReST to HTML conversion is done thanks to ``docutils`` python package.

You'll need to install python package ``pygments`` for code block syntax-highlighting.


Installation
============

Don't forget to first run ``./autogen.sh`` which will compute ChangeLog and set
the version of the module. Then, install as any other OpenERP module.


Usage
=====

Modify the XML view definition to add attribute ``widget`` set to
``markitup`` on any text field. ie::

    <form>
        ...
        <field name="myfield" widget="markitup">
        ...
    </form>


Note that 2 other miscellaneous widgets are available:

 - ``pre_html`` is a general purpose widget that displays HTML in a ``<pre>``
   tag. This is usefull if you which to display your field's content with
   actual spacing preserved.

 - ``rst2html_readonly`` is a widget that will show the HTML computed version
   of a field containing RST. It is meant to be used only in readonly modes.

