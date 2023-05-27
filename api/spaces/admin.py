from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin

from spaces.models import Space, Widget

@admin.register(Space)
class SpaceAdmin(ModelAdmin):
    """
    Space admin
    """

@admin.register(Widget)
class WidgetAdmin(ModelAdmin):
    """
    Widget admin
    """
