from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from social_django.models import Association, Nonce, UserSocialAuth
from social_django.admin import AssociationOption, NonceOption, UserSocialAuthOption
from oauth2_provider.models import (
    get_application_model,
    get_access_token_model,
    get_grant_model,
    get_refresh_token_model,
    get_id_token_model,
)
from oauth2_provider.admin import AccessTokenAdmin as BaseAccessTokenAdmin, ApplicationAdmin as BaseApplicationAdmin, GrantAdmin as BaseGrantAdmin, RefreshTokenAdmin as BaseRefreshTokenAdmin, IDTokenAdmin as BaseIDTokenAdmin
from unfold.admin import ModelAdmin
from unfold.decorators import display
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from authentication.models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm

    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "show_groups",
    )

    @display(description=_("Groups"), ordering="groups")
    def show_groups(self, obj):
        return ", ".join([group.name for group in obj.groups.all()])


admin.site.unregister(Group)
@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass


admin.site.unregister(Association)
@admin.register(Association)
class AssociationAdmin(AssociationOption, ModelAdmin):
    pass


admin.site.unregister(Nonce)
@admin.register(Nonce)
class NonceAdmin(NonceOption, ModelAdmin):
    pass


admin.site.unregister(UserSocialAuth)
@admin.register(UserSocialAuth)
class UserSocialAuthAdmin(UserSocialAuthOption, ModelAdmin):
    pass


admin.site.unregister(get_access_token_model())
@admin.register(get_access_token_model())
class AccessTokenAdmin(BaseAccessTokenAdmin, ModelAdmin):
    pass


admin.site.unregister(get_application_model())
@admin.register(get_application_model())
class ApplicationAdmin(BaseApplicationAdmin, ModelAdmin):
    pass


admin.site.unregister(get_grant_model())
@admin.register(get_grant_model())
class GrantAdmin(BaseGrantAdmin, ModelAdmin):
    pass


admin.site.unregister(get_refresh_token_model())
@admin.register(get_refresh_token_model())
class RefreshTokenAdmin(BaseRefreshTokenAdmin, ModelAdmin):
    pass


admin.site.unregister(get_id_token_model())
@admin.register(get_id_token_model())
class IDTokenAdmin(BaseIDTokenAdmin, ModelAdmin):
    pass
