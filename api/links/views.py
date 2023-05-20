from rest_framework import permissions
from rest_framework import generics, mixins, viewsets
from rest_framework.response import Response

from links.models import Link
from links.serializers import LinkSerializer
from links.utils import fetch_metadata, format_url


class LinkViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    API endpoint that allows links to be viewed or edited.
    """
    queryset = Link.objects.all()
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def create(self, request, *args, **kwargs):
        url = format_url(request.data["url"])
        try :
            instance = Link.objects.get(url=url)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Link.DoesNotExist:
            metadata = fetch_metadata(url)
            request.data["url"] = url
            request.data["metadata"] = metadata
            return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        return super().perform_create(serializer)
