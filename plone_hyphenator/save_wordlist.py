
import json
import re
from Products.Five import BrowserView
from Products.CMFCore.utils import getToolByName
from zExceptions import Unauthorized
from OFS.Image import File

from .config import get_config
from os.path import splitext

def save_wordlist(context, request):
    config = get_config(context)
    lang = request.form.get('lang')
    content_json = request.form.get('content')
    wordlist_path = config['wordlist_path']
    # replace {{LANG}} with the current language.
    wordlist_path = re.sub(r'{{LANG}}', lang.lower(), wordlist_path)
    # must remove leading /, it breaks traversal. In any
    # case, we traverse from the portal root.
    assert wordlist_path.startswith('/')
    wordlist_path = wordlist_path[1:]
    portal_url = getToolByName(context, 'portal_url')
    portal = portal_url.getPortalObject()
    try:
        file_content = portal.unrestrictedTraverse(wordlist_path)
    except KeyError:
        split_path = wordlist_path.rsplit('/', 1)
        if len(split_path) > 1:
            folder_path, name = split_path
            try:
                folder = portal.unrestrictedTraverse(folder_path)
            except KeyError:
                raise RuntimeError, 'Cannot save wordlist, because folder does not exists [%s]' % (folder_path, )
        else:
            folder = portal
            name = split_path[0]
        try:
            # (This mime type will make the content editable through ZMI. Can be changed later as desired.)
            file_content = folder[name] = File(name, '', '[]', 'text/x-unknown-content-type', '')
        except Unauthorized:
            raise RuntimeError, 'Cannot save wordlist, no permission to create object in folder [%s]' % (path, )
    # No need to clean the list, as the client has done it already.
    file_content.data = content_json

class SaveWordlistView(BrowserView):
    """
    """
    def __call__(self):
        return save_wordlist(self.context, self.request)
