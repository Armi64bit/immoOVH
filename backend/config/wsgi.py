import os

from django.conf import settings
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()

# Serve uploaded files (/media/) in production via WhiteNoise.
# Static files (/static/) are served by the WhiteNoise middleware already.
# Files live on a persistent Railway volume, not app disk.
if settings.MEDIA_ROOT.exists():
    application = WhiteNoise(application)
    application.add_files(settings.MEDIA_ROOT, prefix="media/")