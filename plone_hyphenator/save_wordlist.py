
import json
from Products.Five import BrowserView
from Products.CMFCore.utils import getToolByName

from .config import get_config
from os.path import splitext

def save_wordlist(context, request):
    config = get_config()
    lang = request.form.get('lang')
    content_json = request.form.get('content')
    wordlist_path = config['wordlist_path']
    # must remove leading /, it breaks traversal. In any
    # case, we traverse from the portal root.
    assert wordlist_path.startswith('/')
    split = splitext(wordlist_path[1:])
    path = '%s_%s%s' % (split[0], lang, split[1])
    portal_url = getToolByName(context, 'portal_url')
    portal = portal_url.getPortalObject()
    file_content = portal.restrictedTraverse(path)
    # No need to clean the list, as the client has done it already.
    file_content.data = content_json

class SaveWordlistView(BrowserView):
    """
    """
    def __call__(self):
        return save_wordlist(self.context, self.request)
