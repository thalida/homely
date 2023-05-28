from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from unfold.admin import ModelAdmin

from spaces.models import Space, Widget

@admin.register(Space)
class SpaceAdmin(ModelAdmin):
    """
    Space admin
    """

    list_display = [
        "uid",
        "name",
        "owner",
        "access",
        "created_at",
        "updated_at",
    ]


@admin.register(Widget)
class WidgetAdmin(ModelAdmin):
    """
    Widget admin
    """

    list_display = [
        "uid",
        "space",
        "widget_type",
        "created_at",
        "updated_at",
    ]
