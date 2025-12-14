from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User

from .models import Registro, Auditoria, Calificacion


# -------------------------------
# UTILIDAD: obtener rol
# -------------------------------
def obtener_rol(user):
    if not user:
        return "DESCONOCIDO"
    if user.is_superuser:
        return "ADMIN"
    perfil = getattr(user, "perfil", None)
    return perfil.rol if perfil else "SIN_ROL"


# ===============================
# REGISTRO — CREATE / UPDATE
# ===============================
@receiver(post_save, sender=Registro)
def auditar_registro_save(sender, instance, created, **kwargs):
    Auditoria.objects.create(
        usuario=instance.usuario,
        rol=obtener_rol(instance.usuario),
        accion="CREATE" if created else "UPDATE",
        modelo="Registro",
        objeto_id=instance.id,
        descripcion=(
            f"Registro creado: {instance.titulo}"
            if created
            else f"Registro modificado: {instance.titulo}"
        ),
    )


# ===============================
# REGISTRO — DELETE
# ===============================
@receiver(post_delete, sender=Registro)
def auditar_registro_delete(sender, instance, **kwargs):
    Auditoria.objects.create(
        usuario=instance.usuario,
        rol=obtener_rol(instance.usuario),
        accion="DELETE",
        modelo="Registro",
        objeto_id=instance.id,
        descripcion=f"Registro eliminado: {instance.titulo}",
    )


# ===============================
# CALIFICACIÓN — CREATE / UPDATE
# ===============================
# Guardar estado anterior en thread local
import threading
_calificacion_state = threading.local()

@receiver(post_save, sender=Calificacion)
def auditar_calificacion_save(sender, instance, created, **kwargs):
    """
    Auditar creación y cambios de estado en Calificacion
    """
    usuario = instance.creado_por

    if created:
        Auditoria.objects.create(
            usuario=usuario,
            rol=obtener_rol(usuario),
            accion="CREATE",
            modelo="Calificacion",
            objeto_id=instance.id,
            descripcion=f"Calificación creada ({instance.estado}) para registro ID {instance.registro.id}",
        )
    else:
        # Detectar cambio de estado
        estado_anterior = getattr(_calificacion_state, f'estado_{instance.id}', None)
        if estado_anterior and estado_anterior != instance.estado:
            Auditoria.objects.create(
                usuario=usuario,
                rol=obtener_rol(usuario),
                accion="ESTADO_CAMBIO",
                modelo="Calificacion",
                objeto_id=instance.id,
                descripcion=f"Calificación cambió de {estado_anterior} a {instance.estado}",
                metadatos={
                    "estado_anterior": estado_anterior,
                    "estado_nuevo": instance.estado
                }
            )


# Signal pre_save para capturar estado anterior
from django.db.models.signals import pre_save

@receiver(pre_save, sender=Calificacion)
def capturar_estado_anterior(sender, instance, **kwargs):
    """Capturar estado anterior antes de guardar"""
    if instance.pk:  # Solo si ya existe
        try:
            anterior = Calificacion.objects.get(pk=instance.pk)
            setattr(_calificacion_state, f'estado_{instance.id}', anterior.estado)
        except Calificacion.DoesNotExist:
            pass

