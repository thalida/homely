from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer

class UserViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(self.request.user)
        print(vars(self.request.user))
        return User.objects.filter(uid=self.request.user.uid)

    @action(detail=False, methods=["get"], url_path="me")
    def retrieve_me(self, request, *args, **kwargs):
        self.kwargs["pk"] = request.user.uid
        return self.retrieve(request, *args, **kwargs)

    @action(detail=False, methods=["put"], url_name="me")
    def update_me(self, request):
        return self.update(request, pk=request.user.uid)
