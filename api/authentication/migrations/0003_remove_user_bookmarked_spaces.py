# Generated by Django 4.2.1 on 2023-05-27 18:54

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("authentication", "0002_user_bookmarked_spaces"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="bookmarked_spaces",
        ),
    ]