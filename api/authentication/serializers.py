from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer
from spaces.seralizers import SpaceSerializer

class UserSerializer(UserDetailsSerializer):
    spaces = SpaceSerializer(many=True, read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ("spaces",)
