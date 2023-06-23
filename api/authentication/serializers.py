from django.db.models import Q
from rest_framework import serializers
from .models import User
from spaces.choices import SpaceAccess
from spaces.models import Space
from spaces.seralizers import SpaceSerializer

class UserSerializer(serializers.ModelSerializer):
    spaces = serializers.SerializerMethodField()

    def get_spaces(self, obj):
        all_spaces = Space.objects.filter(
            Q(owner=obj) |
            (
                Q(bookmarked_by=obj)
                & Q(access=SpaceAccess.PUBLIC)
            )
        )

        return SpaceSerializer(all_spaces, many=True, context=self.context).data

    class Meta:
        model = User
        fields = [
            "uid",
            "username",
            "email",
            "spaces",
            "default_space",
        ]
