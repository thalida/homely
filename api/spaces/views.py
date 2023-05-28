from django.forms import model_to_dict
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from spaces.choices import SpaceAccess

from spaces.models import Space, Widget
from spaces.seralizers import SpaceWithWidgetsSerializer, WidgetSerializer

class SpaceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows spaces to be viewed or edited.
    """
    queryset = Space.objects.all()
    serializer_class = SpaceWithWidgetsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_homepage",]

    def get_queryset(self):
        user = self.request.user

        if user.is_anonymous:
            return super().get_queryset().filter(access=SpaceAccess.PUBLIC)

        return super().get_queryset().filter(
            Q(owner=self.request.user) |
            Q(access=SpaceAccess.PUBLIC)
        )

    def create(self, request, *args, **kwargs):
        user = request.user

        if user.is_anonymous:
            raise PermissionDenied("You do not have permission to create spaces.")

        request.data["owner"] = request.user.uid
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        user = request.user

        if user.is_anonymous:
            raise PermissionDenied("You do not have permission to update this space.")

        instance = self.get_object()
        is_space_owner = request.user == instance.owner

        if not is_space_owner:
            raise PermissionDenied("You do not have permission to update this space.")

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = request.user

        if user.is_anonymous:
            raise PermissionDenied("You do not have permission to delete this space.")

        instance = self.get_object()
        is_space_owner = request.user == instance.owner

        if not is_space_owner:
            raise PermissionDenied("You do not have permission to delete this space.")

        return super().destroy(request, *args, **kwargs)


    @action(detail=True, methods=["post"], url_path="toggle-bookmark")
    def toggle_bookmark(self, request, pk=None):
        user = request.user

        if user.is_anonymous:
            raise PermissionDenied("You do not have permission to bookmark this space.")

        space = self.get_object()

        if user in space.bookmarked_by.all():
            space.bookmarked_by.remove(user)

        else:
            space.bookmarked_by.add(user)

        serializer = self.get_serializer(space)

        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="clone")
    def clone(self, request, pk=None):
        user = request.user

        if user.is_anonymous:
            raise PermissionDenied("You do not have permission to clone this space.")

        space = self.get_object()
        space_widgets = space.widgets.all()
        cloned_space = Space.objects.create(
            owner=user,
            name=f"{space.name} (clone)",
            description=space.description,
            access=SpaceAccess.PRIVATE,
            is_homepage=False,
            cloned_from=space,
        )

        for widget in space_widgets:
            cloned_widget = widget
            cloned_widget.space = cloned_space
            cloned_widget.uid = None
            cloned_widget.created_at = None
            cloned_widget.updated_at = None
            cloned_widget.save()


        serializer = self.get_serializer(cloned_space)

        return Response(serializer.data)


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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["space",]

    def get_queryset(self):
        user = self.request.user

        if user.is_anonymous:
            return super().get_queryset().filter(space__access=SpaceAccess.PUBLIC)

        return super().get_queryset().filter(
            Q(space__owner=self.request.user) |
            Q(space__access=SpaceAccess.PUBLIC)
        )

    def create(self, request, *args, **kwargs):
        user = request.user

        if user.is_anonymous:
            raise PermissionDenied("You do not have permission to create widgets for this space.")

        space = Space.objects.get(pk=request.data["space"])
        is_space_owner = request.user == space.owner

        if not is_space_owner:
            raise PermissionDenied("You do not have permission to create widgets for this space.")

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        user = request.user

        if user.is_anonymous:
            raise PermissionDenied("You do not have permission to update this widget.")

        instance = self.get_object()
        is_space_owner = request.user == instance.space.owner

        if not is_space_owner:
            raise PermissionDenied("You do not have permission to update this widget.")

        return super().update(request, *args, **kwargs)


    def destroy(self, request, *args, **kwargs):
        user = request.user

        if user.is_anonymous:
            raise PermissionDenied("You do not have permission to delete this widget.")

        instance = self.get_object()
        is_space_owner = request.user == instance.space.owner

        if not is_space_owner:
            raise PermissionDenied("You do not have permission to delete this widget.")

        return super().destroy(request, *args, **kwargs)
