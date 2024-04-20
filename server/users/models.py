from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import random

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, first_name='', surname='', **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(
            username=username, email=email, first_name=first_name, surname=surname, **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, first_name='', surname='', **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password, first_name, surname, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLES = (
        ('admin', 'ADMIN'),
        ('user', 'USER')
    )

    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    surname = models.CharField(max_length=30, blank=True)
    role = models.CharField(max_length=10, choices=ROLES, default='user')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    profile_image = models.IntegerField(default=random.randint(1, 10))  # Assuming profile image is still needed
    keywords = models.TextField(blank=True, help_text="Enter keywords describing the user, separated by commas.")

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        related_query_name='customuser',
        blank=True,
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        related_query_name='customuser',
        blank=True,
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username
