import uuid
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from authentication.models import User
from spaces.choices import SpaceAccess, WidgetType


class Space(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_spaces",
    )
    name = models.CharField(max_length=100)
    access = models.IntegerField(choices=SpaceAccess.choices, default=SpaceAccess.PRIVATE)
    is_homepage = models.BooleanField(default=False)
    bookmarked_by = models.ManyToManyField(
        User,
        related_name="bookmarked_spaces",
        blank=True
    )


class Widget(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    space = models.ForeignKey(
        Space,
        on_delete=models.CASCADE,
        related_name="widgets",
    )
    widget_type = models.IntegerField(choices=WidgetType.choices)
    layout = models.JSONField()
    content = models.JSONField()
    card_style = models.JSONField(default=dict)
    link = models.ForeignKey(
        "links.Link",
        on_delete=models.DO_NOTHING,
        blank=True,
        null=True,
        related_name="widgets",
    )



@receiver(post_save, sender=User)
def create_user_space(sender, instance, created, **kwargs):
    if not created:
        return

    Space.objects.create(owner=instance, name="My Default Space")
