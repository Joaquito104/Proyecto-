from django.contrib.auth.models import User
from django.db import models

class Registro(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="registros")
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

class PerfilUsuario(models.Model):
    ROL_CHOICES = [
        ('CORREDOR', 'Corredor de inversión'),
        ('ANALISTA', 'Analista tributario'),
        ('AUDITOR', 'Auditor interno'),
        ('TI', 'Administrador TI'),
    ]

    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil")
    rol = models.CharField(max_length=20, choices=ROL_CHOICES)

    def __str__(self):
        return f"{self.usuario.username} ({self.rol})"
