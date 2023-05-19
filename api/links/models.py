import uuid
from django.db import models

class Link(models.Model):
    """
    Link model

    Fields:
        uid (UUIDField): Unique identifier for the link
        created_at (DateTimeField): Date and time when the link was created
        updated_at (DateTimeField): Date and time when the link was last updated
        created_by (ForeignKey): User who created the link
        url (URLField): URL of the link
        metadata (JSONField): Open Graph Metadata of the link
    """
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        "authentication.User",
        on_delete=models.CASCADE,
        related_name="links",
    )

    url = models.URLField(max_length=2000)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.url}"

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["url"], name="unique_link")
        ]
