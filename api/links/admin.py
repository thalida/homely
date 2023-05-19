from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin

from links.models import Link


@admin.register(Link)
class LinkAdmin(ModelAdmin):
    """
    Link admin
    """
