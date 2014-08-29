
# Patches of Hyphenator.js #


1. Added: 2014-08-29 by Balazs Ree <ree@greenfinity.hu>

Patching `getLang()` to ignore `lang="null"` set anywhere in the document. This
caused the `Language "null" is not yet supported` popup.
In the site when this occured, it was caused by the Google + button. While
obviously an error, ignoring it from here makes perfect sense as it does not
take away any functionality.
