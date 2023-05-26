from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions
from rest_framework import viewsets, mixins
from rest_framework.exceptions import PermissionDenied

from spaces.models import Space, Widget
from spaces.seralizers import SpaceWithWidgetsSerializer, WidgetSerializer

class SpaceViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    API endpoint that allows spaces to be viewed or edited.
    """
    queryset = Space.objects.all()
    serializer_class = SpaceWithWidgetsSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def get_queryset(self):
        return super().get_queryset().filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        request.data["owner"] = request.user.uid
        return super().create(request, *args, **kwargs)


class WidgetViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    API endpoint that allows widgets to be viewed or edited.
    """
    queryset = Widget.objects.all()
    serializer_class = WidgetSerializer
    permission_classes = [permissions.IsAuthenticated,]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["space",]

    def get_queryset(self):
        return super().get_queryset().filter(space__owner=self.request.user)

    def perform_create(self, serializer):
        is_space_owner = self.request.user == serializer.validated_data["space"].owner

        if not is_space_owner:
            raise PermissionDenied("You do not have permission to create widgets for this space.")

        serializer.save()
