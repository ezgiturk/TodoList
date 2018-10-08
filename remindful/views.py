import datetime

from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pip._internal import req
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.compat import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework import status, permissions, parsers

from remindful.serializers import NoteSerializer, NoteDetailSerializer
from .models import Note
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},
                    status=HTTP_200_OK)


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
        })


class NoteList(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NoteSerializer

    def get(self, request, *args, **kwargs):
        notes = Note.objects.filter(Q(user=self.request.user) & Q(is_deleted=False) & Q(done=False))
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if serializer.is_valid():
            Note.objects.create(
                user=request.user,
                note=request.data['note'],
                deadline=request.data['deadline'] if 'deadline' in request.data else None
            )
            return Response(data, status=200)
        return Response(data, status=400)


class EditNote(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NoteSerializer

    def put(self, request, *args, **kwargs):
        pk = kwargs['pk']
        note = Note.objects.get(pk=pk)
        if not note.done:
            note.done = True
        else:
            note.done = False
        note.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, **kwargs):
        pk = kwargs['pk']

        note = Note.objects.get(pk=pk)
        note.is_deleted = True
        note.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NoteListDone(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NoteSerializer

    def get(self, request, **kwargs):
        notes = Note.objects.filter(Q(user=self.request.user) & Q(is_deleted=False) & Q(done=True))
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)


class NoteDetail(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, **kwargs):
        try:
            print(request.user)
            pk = kwargs['pk']
            print(pk)
            note = Note.objects.get(pk=pk)
            note_serializer = NoteDetailSerializer(note, many=False)
            print("AAAA")
            return Response(note_serializer.data, status=200)

        except Note.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, **kwargs):
        pk = kwargs['pk']

        serializer = NoteDetailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if serializer.is_valid():
            note = Note.objects.get(pk=pk)
            note.note = data.get('note'),
            note.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        try:
            pk = kwargs['pk']
            print(pk)
            note = Note.objects.get(pk=pk)
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Note.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
