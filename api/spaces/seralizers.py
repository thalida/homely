from rest_framework import serializers
from links.serializers import LinkSerializer
from spaces.choices import WidgetType
from spaces.models import Space, Widget


class WidgetSerializer(serializers.ModelSerializer):
    widget_type = serializers.ChoiceField(choices=WidgetType.choices)
    original_link = LinkSerializer(source="link", read_only=True)

    class Meta:
        model = Widget
        fields = "__all__"


class SpaceSerializer(serializers.ModelSerializer):
    is_bookmarked = serializers.SerializerMethodField()

    # get if the current user has bookmakred this space
    def get_is_bookmarked(self, obj):
        request = self.context.get("request")
        user = request.user
        if user.is_anonymous:
            return False

        return user.bookmarked_spaces.filter(uid=obj.uid).exists()


    class Meta:
        model = Space
        fields = [
            "uid",
            "created_at",
            "updated_at",
            "owner",
            "name",
            "access",
            "is_bookmarked",
        ]



class SpaceWithWidgetsSerializer(SpaceSerializer):
    widgets = WidgetSerializer(many=True, read_only=True)

    class Meta(SpaceSerializer.Meta):
        fields = SpaceSerializer.Meta.fields + ["widgets",]
