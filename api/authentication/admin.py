from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from oauth2_provider.models import (
    get_application_model,
    get_access_token_model,
    get_grant_model,
    get_refresh_token_model,
    get_id_token_model,
)
from oauth2_provider.admin import AccessTokenAdmin as BaseAccessTokenAdmin, ApplicationAdmin as BaseApplicationAdmin, GrantAdmin as BaseGrantAdmin, RefreshTokenAdmin as BaseRefreshTokenAdmin, IDTokenAdmin as BaseIDTokenAdmin

# from allauth.socialaccount.admin import SocialAppAdmin as BaseSocialAppAdmin, SocialTokenAdmin as BaseSocialTokenAdmin, SocialAccountAdmin as BaseSocialAccountAdmin
# from allauth.socialaccount.models import SocialApp, SocialToken, SocialAccount
from unfold.admin import ModelAdmin
from unfold.decorators import display
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

from authentication.models import User

admin.site.unregister(Group)
admin.site.unregister(get_application_model())
admin.site.unregister(get_access_token_model())
admin.site.unregister(get_grant_model())
admin.site.unregister(get_refresh_token_model())
admin.site.unregister(get_id_token_model())

# admin.site.unregister(SocialApp)
# admin.site.unregister(SocialToken)
# admin.site.unregister(SocialAccount)


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


@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass


class AccessTokenAdmin(BaseAccessTokenAdmin, ModelAdmin):
    pass

class ApplicationAdmin(BaseApplicationAdmin, ModelAdmin):
    pass

class GrantAdmin(BaseGrantAdmin, ModelAdmin):
    pass

class RefreshTokenAdmin(BaseRefreshTokenAdmin, ModelAdmin):
    pass

class IDTokenAdmin(BaseIDTokenAdmin, ModelAdmin):
    pass

admin.site.register(get_application_model(), ApplicationAdmin)
admin.site.register(get_access_token_model(), AccessTokenAdmin)
admin.site.register(get_grant_model(), GrantAdmin)
admin.site.register(get_refresh_token_model(), RefreshTokenAdmin)
admin.site.register(get_id_token_model(), IDTokenAdmin)

# @admin.register(SocialApp)
# class SocialAppAdmin(BaseSocialAppAdmin, ModelAdmin):
#     pass


# @admin.register(SocialToken)
# class SocialTokenAdmin(BaseSocialTokenAdmin, ModelAdmin):
#     pass

# @admin.register(SocialAccount)
# class SocialAccountAdmin(BaseSocialAccountAdmin, ModelAdmin):
# pass
