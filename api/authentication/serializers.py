from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer

class UserSerializer(UserDetailsSerializer):
    spaces = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ("spaces",)
