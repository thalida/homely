# Generated by Django 4.2.1 on 2023-05-28 00:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("spaces", "0011_space_bookmarked_by"),
    ]

    operations = [
        migrations.AddField(
            model_name="space",
            name="description",
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name="space",
            name="owner",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="owned_spaces",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
