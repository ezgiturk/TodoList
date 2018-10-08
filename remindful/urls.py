from django.conf.urls import url
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from remindful import views

urlpatterns = {
    path('', views.NoteList.as_view()),
    path('done/', views.NoteListDone.as_view()),
    url(r'^(?P<pk>[0-9]+)$', views.EditNote.as_view()),

}

urlpatterns = format_suffix_patterns(urlpatterns)
