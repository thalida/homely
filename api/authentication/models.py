import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(blank=False, max_length=254, verbose_name="email address")

    default_space = models.ForeignKey(
        "spaces.Space",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="default_users",
    )

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
