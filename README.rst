====================
MarkItUp for OpenERP
====================


Description
===========

This OpenERP 7.0 module defines a ``markitup`` FormField widget. Currently
configured to edit/display ReSTructured Text, but could be easily modified to
manage any other markup langage.

MarkItUp_ is a jQuery plugin allowing to turn any textarea into a markup editor.

.. _MarkItUp: http://markitup.jaysalvat.com


In this current early form, ``web_markitup`` is replicating anru's `rsted`_
capabilities in target OpenERP textarea : allowing dynamic preview of
ReSTructured text (follow this link to see `an online demo of rsted`_).

.. _rsted: https://github.com/anru/rsted
.. _an online demo of rsted: http://rst.ninjs.org/


Usage
=====

Modify the XML view definition to add attribute ``widget`` set to
``markitup`` on any text field. ie::

    <form>
        ...
        <field name="myfield" widget="markitup">
        ...
    </form>


