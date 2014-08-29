
from Products.CMFCore.utils import getToolByName
from zope.component import queryUtility
from Products.CMFCore.interfaces import IPropertiesTool


def get_properties():
    ptool = queryUtility(IPropertiesTool)
    if ptool is not None:
        return getattr(ptool, 'hyphenator_properties', None)

def get_config(context):
    """Get the configuration

    Data comes from the plone site properties.
    """
    props = get_properties()
    if props is not None:
        portal_url = getToolByName(context, 'portal_url')
        wordlist_path = props.getProperty('wordlist_path', '')
        if wordlist_path:
            if not wordlist_path.startswith('/'):
                raise RuntimeError, 'wordlist_path must be an absolute path starting with /'
            wordlist_url = portal_url() + wordlist_path
            wordlist_save_path = '/plone_hyphenator_save_wordlist'
            wordlist_save_url = portal_url() + wordlist_save_path
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
    config.update(service_switches())
    for lang in config.

def service_switches():
    # --
    # Service switches
    #
    # Further properties are provided from here as constants. They can
    # be modified from here.
    # --

    # languages displayed in the language menu of the overlay
    config = {}
    config['languages'] = [
        dict(name='en', title='English (Universal)'),
        dict(name='en-gb', title='English (British)'),
        dict(name='en-us', title='English (American)'),
        dict(name='de', title='Deutsch'),
    )
    # Disable switch for individual languages
    config['disable_languages'] = []
    # config['disable_languages'] = ['de']
    config['disable_all_languages'] = False
    # config['disable_all_languages'] = True

    return config
