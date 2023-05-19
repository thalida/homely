from rest_framework import permissions
from rest_framework import generics
from rest_framework.response import Response

from links.models import Link
from links.serializers import LinkSerializer
from links.utils import fetch_metadata


class LinkGetCreateView(generics.RetrieveAPIView):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticated,]
    lookup_field = "url"
    lookup_url_kwarg = "url"

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()

        except Link.DoesNotExist:
            link = Link.objects.create(url=kwargs["url"])
            link.created_by = request.user
            link.metadata = fetch_metadata(kwargs["url"])
            link.save()
            instance = link

        serializer = self.get_serializer(instance)

        return Response(serializer.data)
