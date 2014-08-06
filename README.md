
# plone_hyphenator #

Support for hyphenation by using language specific patterns and word exceptions.

Uses Google's Hyphenator.js.


## Installation ##

The package can be installed in the same way as Plone packages are usually installed.


### Buildout example ###

There is an example buildout configuration in the package that can be alternately used to install the package.
You can also use the buildout as a starting point for your own site setup. However, using the provided
configuration is not required, the package can just be installed as an egg.

## Configuration ##

In `site_properties/hyphenator_properties` you must set up the behavior of the component.

`selector` is a css selector, this selects the region in which you want to hyphenate. I set this by
default to `#content-core` so I could test it. You want to change this to a selector that selects the portlets
(or, whatever regions you want to hyphenate).

`wordlist_path`: if specified, it must be an absolute path within the portal. This must map to a Zope File
in the database. This can be created from the ZMI. The string LANG is replaced by the actual language.

Example: If this is set to `/LANG/hyphen.json`, it will use `/en/hyphen.json` `/de/hyphen.json` for
English and German hyphenation word list.

The content of this file must be valid JSON:
```
    ["hyphen-this-only-like-this", "neverhyphenthisone"]
```

## UI for managing hyphenations ##

From the site actions, clicking on the 'Hyphenations' menu item, will bring up a popup. This will
show the current exception word list for the current language.

Here words can be added, modified, or removed. Each word must stand in a separate line and have dashes (-)
marking the allowed points for hyphenating the word. If a word is in this list, the hyphenation
rules will be overridden and only the specified hyphenation will be used. (As an egde case, a word
without dashes will never by hyphenated.)

By pressing Save, the updated list will be saved out to the wordlist file. The page will be reloaded
with the updated hyphenation (in case we modified the list for the current language).

It is also possible to modify hyphenation exceptions for other language by selecting then
via the language selector.
