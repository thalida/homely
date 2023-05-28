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


class ClonedSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = [
            "uid",
            "owner",
            "name",
        ]


class SpaceSerializer(serializers.ModelSerializer):
    cloned_from = ClonedSpaceSerializer(read_only=True)
    is_bookmarked = serializers.SerializerMethodField()
    num_bookmarks = serializers.SerializerMethodField()
    num_clones = serializers.SerializerMethodField()

    # get if the current user has bookmakred this space
    def get_is_bookmarked(self, obj):
        request = self.context.get("request")
        user = request.user
        if user.is_anonymous:
            return False

        return user.bookmarked_spaces.filter(uid=obj.uid).exists()

    # get the number of bookmarks for this space
    def get_num_bookmarks(self, obj):
        return obj.bookmarked_by.count()

    # get the number of clones for this space
    def get_num_clones(self, obj):
        return obj.clones.count()


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
            "num_bookmarks",
            "num_clones",
            "cloned_from",
        ]



class SpaceWithWidgetsSerializer(SpaceSerializer):
    widgets = WidgetSerializer(many=True, read_only=True)

    class Meta(SpaceSerializer.Meta):
        fields = SpaceSerializer.Meta.fields + ["widgets",]
