
from Products.CMFCore.utils import getToolByName
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
        portal_url = getToolByName(props, 'portal_url')
        portal = portal_url.getPortalObject()
        wordlist_path = props.getProperty('wordlist_path', '')
        if wordlist_path:
            if not wordlist_path.startswith('/'):
                raise RuntimeError, 'wordlist_path must be an absolute path starting with /'
            wordlist_url = '/' + portal.absolute_url() + wordlist_path
            wordlist_save_path = '/plone_hyphenator_save_wordlist'
            wordlist_save_url = '/' + portal.absolute_url() + wordlist_save_path
        else:
            wordlist_url = ''
            wordlist_save_url = ''
        config = {
            'selector': props.getProperty('selector', '#content-core'),
            'wordlist_path': wordlist_path,
            'wordlist_url': wordlist_url,
            'wordlist_save_url': wordlist_save_url
        }
    else:
        config = {
            'selector': '#content-core',
            'wordlist_path': '',
            'wordlist_url': '',
            'wordlist_save_url': '',
        }
    # Further properties are provided from here as constants. They can
    # be modified from here.
    config['languages'] = (
        ('en', 'English'),
        ('de', 'Deutsch'),
    )
    return config
