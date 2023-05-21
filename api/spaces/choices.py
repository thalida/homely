from django.db import models

class WidgetType(models.IntegerChoices):
    TEXT = 1, "Text"
    LINK = 10, "Link"
    IMAGE = 20, "Image"
    DATETIME = 30, "DateTime"
    WEAHTER = 40, "Weather"
