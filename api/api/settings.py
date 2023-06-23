"""
Django settings for api project.

Generated by "django-admin startproject" using Django 4.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
from pathlib import Path
import dj_database_url
from django.templatetags.static import static
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

# Build paths inside the project like this: BASE_DIR / "subdir".
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-*s@cf%hhyx-ksf)sj5gp!@ua7wwz=2a&3f7l2wfpmnu#ak3cm3"

# SECURITY WARNING: don"t run with debug turned on in production!
DEBUG = "RENDER" not in os.environ

SITE_ID = 1

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGIN_REGEXES = []
ALLOWED_HOSTS = []

RENDER_EXTERNAL_HOSTNAME = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

if DEBUG:
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    ALLOWED_HOSTS += [
        "localhost",
        "127.0.0.1",
        ".onrender.com",
    ]

    CORS_ALLOWED_ORIGIN_REGEXES += [
        r"^http(s)?://localhost:3000$",
        r"^http(s)?://127.0.0.1:3000$",
    ]


# Application definition

INSTALLED_APPS = [
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",

    "drf_spectacular",
    "django_filters",
    "rest_framework",


    "oauth2_provider",
    "social_django",
    "drf_social_oauth2",

    # "rest_framework.authtoken",
    # "dj_rest_auth",
    # "dj_rest_auth.registration",
    # "allauth",
    # "allauth.account",
    # "allauth.socialaccount",
    # "allauth.socialaccount.providers.google",

    "authentication.apps.AuthenticationConfig",
    "common.apps.CommonConfig",
    "links.apps.LinksConfig",
    "spaces.apps.SpacesConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",

                # `allauth` needs this from django
                # "django.template.context_processors.request",
                "social_django.context_processors.backends",
                "social_django.context_processors.login_redirect",
            ],
        },
    },
]

WSGI_APPLICATION = "api.wsgi.application"

SPECTACULAR_SETTINGS = {
    "TITLE": "Homely API",
    "DESCRIPTION": "Your homepage",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    # OTHER SETTINGS
}

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": dj_database_url.config(
        default="postgresql://postgres:postgres@localhost:5432/postgres",
        conn_max_age=600,
    )
}


# REST Framework

REST_FRAMEWORK = {
    # YOUR SETTINGS
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        # "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
        "rest_framework.authentication.BasicAuthentication",
        "oauth2_provider.contrib.rest_framework.OAuth2Authentication",  # django-oauth-toolkit >= 1.0.0
        "drf_social_oauth2.authentication.SocialAuthentication",
    ],
}

# User & Authentication

AUTH_USER_MODEL = "authentication.User"

SIMPLE_JWT = {
    "USER_ID_FIELD": "uid"
}

AUTHENTICATION_BACKENDS = (
    "social_core.backends.google.GoogleOAuth2",
    "drf_social_oauth2.backends.DjangoOAuth2",
    "django.contrib.auth.backends.ModelBackend",
    # "allauth.account.auth_backends.AuthenticationBackend",
)

ACTIVATE_JWT = True

SOCIAL_AUTH_JSONFIELD_ENABLED = True

# Google configuration
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get("GOOGLE_OAUTH2_CLIENT_ID")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get("GOOGLE_OAUTH2_SECRET")

# Define SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE to get extra permissions from Google.
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")
if not DEBUG:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

UNFOLD = {
    "SITE_TITLE": "Homely",
    "SITE_HEADER": "Homely",
    "SITE_URL": "/",
    # "SITE_ICON": lambda request: static("logo.svg"),
    # "DASHBOARD_CALLBACK": "sample_app.dashboard_callback",
    "LOGIN": {
        "image": lambda r: static("common/images/pexels-pixabay-316149.jpg"),
        "redirect_after": lambda r: reverse_lazy("admin:index"),
    },
    "STYLES": [
        # lambda request: static("common/css/styles.css"),
    ],
    "SCRIPTS": [],
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": _("Navigation"),
                "separator": False,
                "items": [
                    {
                        "title": _("Dashboard"),
                        "icon": "dashboard",  # Supported icon set: https://fonts.google.com/icons
                        "link": reverse_lazy("admin:index"),
                    },
                    {
                        "title": _("Spaces"),
                        "icon": "collections_bookmark",
                        "link": reverse_lazy("admin:spaces_space_changelist"),
                    },
                    {
                        "title": _("Links"),
                        "icon": "link",
                        "link": reverse_lazy("admin:links_link_changelist"),
                    },
                    {
                        "title": _("Users"),
                        "icon": "group",
                        "link": reverse_lazy("admin:authentication_user_changelist"),
                    },
                ],
            },
        ],
    },
    "TABS": [
        {
            "models": [
                "authentication.user",
                "auth.group",
                "social_django.usersocialauth",
            ],
            "items": [
                {
                    "title": _("All Users"),
                    "link": reverse_lazy("admin:authentication_user_changelist"),
                },
                {
                    "title": _("All Groups"),
                    "link": reverse_lazy("admin:auth_group_changelist"),
                },
                {
                    "title": _("All Social Accounts"),
                    "link": reverse_lazy(
                        "admin:social_django_usersocialauth_changelist"
                    ),
                },
            ],
        },
        {
            "models": [
                "spaces.space",
                "spaces.widget",
            ],
            "items": [
                {
                    "title": _("My Spaces"),
                    "link": reverse_lazy("admin:spaces_space_changelist"),
                },
                {
                    "title": _("My Widgets"),
                    "link": reverse_lazy("admin:spaces_widget_changelist"),
                },
            ],
        },
    ],
}
