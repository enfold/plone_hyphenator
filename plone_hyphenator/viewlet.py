
# Copyright (c) 2014 Enfold Systems, Inc. All rights reserved.

from Products.CMFCore.utils import getToolByName
from plone.app.layout.viewlets import common as base
from zope.component import queryUtility
from Products.CMFCore.interfaces import IPropertiesTool


def get_properties():
    ptool = queryUtility(IPropertiesTool)
    if ptool is not None:
        return getattr(ptool, 'hyphenator_properties', None)

def get_config():
    """Get the configuration

    Data comes from the plone site properties.
    """
    props = get_properties()
    if props is not None:
        wordlist_path = props.getProperty('wordlist_path', '')
        if wordlist_path:
            if not wordlist_path.startswith('/'):
                raise RuntimeError, 'wordlist_path must be an absolute path starting with /'
            portal_url = getToolByName(props, 'portal_url')
            portal = portal_url.getPortalObject()
            wordlist_url = '/' + portal.absolute_url() + wordlist_path
        else:
            wordlist_url = ''
        config = {
            'selector': props.getProperty('selector', '#content-core'),
            'wordlist_url': wordlist_url,
        }
    else:
        config = {
            'selector': '#content-core',
            'wordlist_url': '',
        }
    return config

class HyphenatorViewlet(base.ViewletBase):
    """
    """

    def update(self):
        super(HyphenatorViewlet, self).update()
        self.config = get_config()
        # Is the product installed?
        # We need to check it, as this information is not obvious based on
        # the configuration alone.
        # The importance of this check is to avoid the viewlet being
        # rendered before the product is installed with quickinstaller
        # in a newly created portal.
        qi = getToolByName(self.context, 'portal_quickinstaller')
        self.is_installed = qi.isProductInstalled('plone_hyphenator')

    def render(self):
        if self.is_installed:
            return super(HyphenatorViewlet, self).render()
        else:
            return ''
