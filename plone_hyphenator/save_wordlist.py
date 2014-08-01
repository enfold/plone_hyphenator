
import json
from Products.Five import BrowserView

from .config import get_config
from os.path import splitext

def save_wordlist(context, request):
    config = get_config()
    lang = request.form.get('lang')
    content = json.loads(request.form.get('content'))
    split = splitext(config['wordlist_path'])
    path = '%s-%s%s' % (split[0], lang, split[1])
    print 'in save_wordlist', path, len(content)


class SaveWordlistView(BrowserView):
    """
    """
    def __call__(self):
        return save_wordlist(self.context, self.request)
