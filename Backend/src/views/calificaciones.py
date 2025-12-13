from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from src.permissions import TieneRol
from src.models import Calificacion, Registro


class CalificacionView(APIView):
    permission_classes = [IsAuthenticated, TieneRol]
    roles_permitidos = ["ANALISTA"]

    def post(self, request):
        registro_id = request.data.get("registro_id")
        comentario = request.data.get("comentario", "")

        if not registro_id:
            return Response(
                {"detail": "registro_id es obligatorio"},
                status=400
            )

        try:
            registro = Registro.objects.get(id=registro_id)
        except Registro.DoesNotExist:
            return Response(
                {"detail": "Registro no existe"},
                status=404
            )

        # 🔥 CLAVE: siempre se crea como PENDIENTE
        calificacion = Calificacion.objects.create(
            registro=registro,
            creado_por=request.user,
            comentario=comentario,
            estado="PENDIENTE"
        )

        return Response({
            "detail": "Calificación creada y enviada a validación",
            "id": calificacion.id,
            "estado": calificacion.estado,
            "registro_id": registro.id
        }, status=201)
