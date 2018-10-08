from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path
# from rest_framework import routers
# router = routers.DefaultRouter()
# router.register(r'notes', views.NoteList)
from rest_framework.authtoken import views

from remindful.views import CustomAuthToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('notes/', include('remindful.urls')),

    # url(r'^notes/(?P<pk>\d+)/$', include('remindful.urls')),
    # url(r'^api-token-auth/', CustomAuthToken.as_view())

    path('api/login', CustomAuthToken.as_view()),
    path('api-auth/', include('rest_framework.urls')),
    url(r'^api-token-auth/', views.obtain_auth_token)
]
