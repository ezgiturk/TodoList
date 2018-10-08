from rest_framework import serializers
from remindful.models import Note
from django.contrib.auth.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email')


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')


class NoteSerializer(serializers.ModelSerializer):
    deadline = serializers.DateTimeField(required=False)

    class Meta:
        model = Note
        fields = ('note', 'id', 'done', 'deadline')


class NoteDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = ('note', 'created_date', 'is_deleted', 'deadline', 'done')