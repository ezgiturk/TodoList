from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings


# This code is triggered whenever a new user has been created and saved to the database
from rest_framework_jwt.serializers import User


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Note(models.Model):
    user = models.ForeignKey(User,  on_delete=models.CASCADE, related_name='note')
    note = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    is_deleted = models.BooleanField(default=False, blank=True)
    deadline = models.DateTimeField(blank=True, null=True)
    done = models.BooleanField(default=False, blank=True)

    def __int__(self):
        return self.note
