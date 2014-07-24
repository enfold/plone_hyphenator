
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

In site_properties/hyphenator_properties you must set up the component.

`selector` is a css selector, this selects the region in which you want to hyphenate. I set this by
default to #content-core so I could test it. You want to change this to a selector that selects the portals.

`wordlist_path` if specified, must be an absolute path within the portal. This must give back a json text
which will be the exception wordlist to be used. So for simplicity, you can create a File in the portal
with the name "wordlist" and specify "/wordlist" (note the leading slash) as the wordlst_path.

Example:
```
        ["hyphen-this-only-like-this", "neverhyphenthisone"]
```

It only wired in to german language. Hyphenator does detect the page language, but we only load patterns
and wordlist for german, (de), so for an english language page the current result will be inconsistent.
Please test with German pages for the moment!
