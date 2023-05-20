from rest_framework import serializers
from spaces.choices import WidgetType
from spaces.models import Space, Widget


class WidgetSerializer(serializers.ModelSerializer):
    widget_type = serializers.ChoiceField(choices=WidgetType.choices)

    class Meta:
        model = Widget
        fields = "__all__"


class SpaceSerializer(serializers.ModelSerializer):
    widgets = WidgetSerializer(many=True, read_only=True)

    class Meta:
        model = Space
        fields = "__all__"
