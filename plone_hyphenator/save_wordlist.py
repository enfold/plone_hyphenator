
from Products.Five import BrowserView


def save_wordlist(context, request):
    print 'in save_wordlist'


class SaveWordlistView(BrowserView):
    """
    """
    def __call__(self):
        return save_wordlist(self.context, self.request)
