# Generated by Django 4.2.1 on 2023-05-21 20:41

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("spaces", "0005_alter_widget_card_style"),
    ]

    operations = [
        migrations.AlterField(
            model_name="widget",
            name="widget_type",
            field=models.IntegerField(
                choices=[
                    (1, "Text"),
                    (10, "Link"),
                    (20, "Image"),
                    (30, "DateTime"),
                    (40, "Weather"),
                ]
            ),
        ),
    ]
