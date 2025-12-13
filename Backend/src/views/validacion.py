from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from src.models import Calificacion, Auditoria
from src.permissions import TieneRol


# =========================
# UTILIDAD — OBTENER ROL
# =========================
def obtener_rol(user):
    if not user:
        return "DESCONOCIDO"
    if user.is_superuser:
        return "ADMIN"
    perfil = getattr(user, "perfil", None)
    return perfil.rol if perfil else "SIN_ROL"


# =========================================================
# BANDEJA DE VALIDACIÓN
# (AUDITOR / TI) — LISTAR PENDIENTES
# =========================================================
class BandejaValidacionView(APIView):
    permission_classes = [IsAuthenticated, TieneRol]
    roles_permitidos = ["AUDITOR", "TI"]

    def get(self, request):
        estado = request.query_params.get("estado", "PENDIENTE")

        calificaciones = (
            Calificacion.objects
            .select_related("registro", "creado_por")
            .filter(estado=estado)
            .order_by("-fecha_creacion")
        )

        data = [
            {
                "id": c.id,
                "estado": c.estado,
                "comentario": c.comentario,
                "fecha_creacion": c.fecha_creacion,
                "fecha_actualizacion": c.fecha_actualizacion,
                "registro": {
                    "id": c.registro.id,
                    "titulo": c.registro.titulo,
                    "usuario": c.registro.usuario.username,
                },
                "creado_por": c.creado_por.username if c.creado_por else None,
            }
            for c in calificaciones
        ]

        return Response(data)


# =========================================================
# VALIDAR / OBSERVAR / RECHAZAR
# (AUDITOR / TI)
# =========================================================
class ValidarCalificacionView(APIView):
    permission_classes = [IsAuthenticated, TieneRol]
    roles_permitidos = ["AUDITOR", "TI"]

    def patch(self, request, calificacion_id):
        calificacion = get_object_or_404(Calificacion, id=calificacion_id)

        nuevo_estado = request.data.get("estado")
        comentario = request.data.get("comentario", "")

        if nuevo_estado not in ["VALIDADA", "OBSERVADA", "RECHAZADA"]:
            return Response(
                {"detail": "Estado inválido. Usa VALIDADA / OBSERVADA / RECHAZADA."},
                status=400
            )

        if calificacion.estado != "PENDIENTE":
            return Response(
                {"detail": f"Solo se puede validar desde PENDIENTE (actual: {calificacion.estado})."},
                status=400
            )

        if nuevo_estado in ["OBSERVADA", "RECHAZADA"] and not comentario.strip():
            return Response(
                {"detail": "Comentario obligatorio si OBSERVADA o RECHAZADA."},
                status=400
            )

        calificacion.estado = nuevo_estado
        calificacion.comentario = comentario
        calificacion.save()

        # Auditoría explícita del validador
        Auditoria.objects.create(
            usuario=request.user,
            rol=obtener_rol(request.user),
            accion="UPDATE",
            modelo="Calificacion",
            objeto_id=calificacion.id,
            descripcion=f"Validación: estado => {nuevo_estado} | registro_id={calificacion.registro.id}"
        )

        return Response({
            "detail": "Calificación actualizada",
            "id": calificacion.id,
            "estado": calificacion.estado
        })


# =========================================================
# ENVIAR A VALIDACIÓN
# (ANALISTA / TI)
# BORRADOR → PENDIENTE
# =========================================================
class EnviarValidacionView(APIView):
    permission_classes = [IsAuthenticated, TieneRol]
    roles_permitidos = ["ANALISTA", "TI"]

    def patch(self, request, calificacion_id):
        calificacion = get_object_or_404(Calificacion, id=calificacion_id)

        perfil = getattr(request.user, "perfil", None)
        rol = getattr(perfil, "rol", None)

        if rol != "TI" and calificacion.creado_por != request.user:
            raise PermissionDenied("Solo el creador puede enviar su calificación.")

        if calificacion.estado != "BORRADOR":
            return Response(
                {"detail": f"Solo se puede enviar desde BORRADOR (actual: {calificacion.estado})."},
                status=400
            )

        calificacion.estado = "PENDIENTE"
        calificacion.save()

        Auditoria.objects.create(
            usuario=request.user,
            rol=obtener_rol(request.user),
            accion="UPDATE",
            modelo="Calificacion",
            objeto_id=calificacion.id,
            descripcion=f"Envío a validación: BORRADOR → PENDIENTE | registro_id={calificacion.registro.id}"
        )

        return Response({
            "detail": "Enviado a validación",
            "id": calificacion.id,
            "estado": calificacion.estado
        })
