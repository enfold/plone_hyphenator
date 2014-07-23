
# Copyright (c) 2014 Enfold Systems, Inc. All rights reserved.

from Products.CMFCore.utils import getToolByName
from plone.app.layout.viewlets import common as base

from .config import get_config
from .auth import get_auth_token


class HyphenatorViewlet(base.ViewletBase):
    """
    """

    def update(self):
        super(HyphenatorViewlet, self).update()
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
