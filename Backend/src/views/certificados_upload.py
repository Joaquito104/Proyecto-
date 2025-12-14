"""
Vista para subida y gestión de certificados digitales
Soporta: PDF, CSV (carga masiva)
Validación de tamaño, formato y permisos
"""
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from src.permissions import TieneRol
from src.models import Certificado, Registro, Auditoria

# Configuración
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME_TYPES = {
    'application/pdf': ['.pdf'],
    'text/csv': ['.csv'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
}


class CertificadoUploadView(APIView):
    """
    Subida de certificados (PDF/CSV)
    POST: Subir certificado
    """
    permission_classes = [IsAuthenticated, TieneRol]
    roles_permitidos = ["CORREDOR", "ANALISTA", "TI"]

    def post(self, request):
        """
        Subir certificado individual (PDF)
        Body (multipart/form-data):
            - archivo: File
            - tipo: AFP|APV|ISAPRE|FONASA|OTRO
            - registro_id: int
            - metadatos: JSON (opcional)
        """
        archivo = request.FILES.get('archivo')
        tipo = request.data.get('tipo')
        registro_id = request.data.get('registro_id')
        metadatos = request.data.get('metadatos', {})

        # Validaciones
        if not archivo:
            return Response(
                {"detail": "No se adjuntó ningún archivo"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not tipo or tipo not in dict(Certificado.TIPO_CHOICES):
            return Response(
                {"detail": "Tipo de certificado inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not registro_id:
            return Response(
                {"detail": "registro_id es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar registro existe
        try:
            registro = Registro.objects.get(id=registro_id)
        except Registro.DoesNotExist:
            return Response(
                {"detail": "El registro especificado no existe"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validar permisos: corredor solo puede subir a sus registros
        if request.user.perfil.rol == "CORREDOR" and registro.usuario != request.user:
            return Response(
                {"detail": "No tienes permiso para subir certificados a este registro"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Validar tamaño
        if archivo.size > MAX_FILE_SIZE:
            return Response(
                {"detail": f"El archivo excede el tamaño máximo permitido ({MAX_FILE_SIZE // (1024*1024)} MB)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar formato
        file_extension = os.path.splitext(archivo.name)[1].lower()
        mime_type = archivo.content_type

        if mime_type not in ALLOWED_MIME_TYPES:
            return Response(
                {"detail": f"Tipo de archivo no permitido. Formatos aceptados: PDF, CSV, Excel"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if file_extension not in ALLOWED_MIME_TYPES.get(mime_type, []):
            return Response(
                {"detail": "La extensión del archivo no coincide con su tipo MIME"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear certificado
        try:
            certificado = Certificado.objects.create(
                registro=registro,
                cargado_por=request.user,
                tipo=tipo,
                archivo=archivo,
                nombre_archivo=archivo.name,
                tamanio_bytes=archivo.size,
                mime_type=mime_type,
                metadatos=metadatos,
                estado="CARGADO"
            )

            # Auditar
            Auditoria.objects.create(
                usuario=request.user,
                rol=request.user.perfil.rol,
                accion="CREATE",
                modelo="Certificado",
                objeto_id=certificado.id,
                descripcion=f"Certificado {tipo} subido: {archivo.name}",
                ip_address=self.get_client_ip(request),
                metadatos={
                    "registro_id": registro_id,
                    "tipo": tipo,
                    "tamanio_kb": archivo.size // 1024
                }
            )

            return Response({
                "id": certificado.id,
                "tipo": certificado.tipo,
                "nombre_archivo": certificado.nombre_archivo,
                "tamanio_kb": certificado.tamanio_bytes // 1024,
                "fecha_carga": certificado.fecha_carga,
                "estado": certificado.estado,
                "registro_id": registro.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"detail": f"Error al guardar el certificado: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_client_ip(self, request):
        """Obtener IP del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class CertificadoListView(APIView):
    """
    Listar certificados
    GET: Listar certificados filtrados
    """
    permission_classes = [IsAuthenticated, TieneRol]
    roles_permitidos = ["CORREDOR", "ANALISTA", "AUDITOR", "TI"]

    def get(self, request):
        """
        Listar certificados con filtros opcionales
        Query params:
            - registro_id: int
            - tipo: AFP|APV|ISAPRE|FONASA|OTRO
            - estado: CARGADO|VALIDADO|RECHAZADO
        """
        certificados = Certificado.objects.select_related(
            'registro', 'cargado_por', 'validado_por'
        ).all()

        # Filtrar por usuario si es corredor
        if request.user.perfil.rol == "CORREDOR":
            certificados = certificados.filter(cargado_por=request.user)

        # Filtros opcionales
        registro_id = request.query_params.get('registro_id')
        if registro_id:
            certificados = certificados.filter(registro_id=registro_id)

        tipo = request.query_params.get('tipo')
        if tipo:
            certificados = certificados.filter(tipo=tipo)

        estado_param = request.query_params.get('estado')
        if estado_param:
            certificados = certificados.filter(estado=estado_param)

        # Serializar
        data = []
        for cert in certificados:
            data.append({
                "id": cert.id,
                "tipo": cert.tipo,
                "tipo_display": cert.get_tipo_display(),
                "nombre_archivo": cert.nombre_archivo,
                "tamanio_kb": cert.tamanio_bytes // 1024,
                "estado": cert.estado,
                "fecha_carga": cert.fecha_carga,
                "cargado_por": cert.cargado_por.username if cert.cargado_por else None,
                "registro_id": cert.registro.id,
                "registro_titulo": cert.registro.titulo,
                "archivo_url": cert.archivo.url if cert.archivo else None,
                "observaciones": cert.observaciones
            })

        return Response({
            "total": len(data),
            "certificados": data
        })


class CertificadoDetailView(APIView):
    """
    Detalle, validación o rechazo de certificado
    GET: Ver detalle
    PATCH: Validar o rechazar
    DELETE: Eliminar
    """
    permission_classes = [IsAuthenticated, TieneRol]
    roles_permitidos = ["CORREDOR", "ANALISTA", "AUDITOR", "TI"]

    def get(self, request, certificado_id):
        """Ver detalle completo de un certificado"""
        try:
            certificado = Certificado.objects.select_related(
                'registro', 'cargado_por', 'validado_por', 'calificacion'
            ).get(id=certificado_id)
        except Certificado.DoesNotExist:
            return Response(
                {"detail": "Certificado no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Verificar permisos
        if request.user.perfil.rol == "CORREDOR" and certificado.cargado_por != request.user:
            return Response(
                {"detail": "No tienes permiso para ver este certificado"},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response({
            "id": certificado.id,
            "tipo": certificado.tipo,
            "tipo_display": certificado.get_tipo_display(),
            "nombre_archivo": certificado.nombre_archivo,
            "tamanio_kb": certificado.tamanio_bytes // 1024,
            "mime_type": certificado.mime_type,
            "estado": certificado.estado,
            "fecha_carga": certificado.fecha_carga,
            "fecha_validacion": certificado.fecha_validacion,
            "cargado_por": certificado.cargado_por.username if certificado.cargado_por else None,
            "validado_por": certificado.validado_por.username if certificado.validado_por else None,
            "registro_id": certificado.registro.id,
            "registro_titulo": certificado.registro.titulo,
            "calificacion_id": certificado.calificacion.id if certificado.calificacion else None,
            "archivo_url": certificado.archivo.url if certificado.archivo else None,
            "metadatos": certificado.metadatos,
            "observaciones": certificado.observaciones
        })

    def patch(self, request, certificado_id):
        """
        Validar o rechazar certificado (solo ANALISTA/AUDITOR/TI)
        Body:
            - estado: VALIDADO | RECHAZADO
            - observaciones: string (opcional)
        """
        if request.user.perfil.rol not in ["ANALISTA", "AUDITOR", "TI"]:
            return Response(
                {"detail": "No tienes permiso para validar certificados"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            certificado = Certificado.objects.get(id=certificado_id)
        except Certificado.DoesNotExist:
            return Response(
                {"detail": "Certificado no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        nuevo_estado = request.data.get('estado')
        observaciones = request.data.get('observaciones', '')

        if nuevo_estado not in ["VALIDADO", "RECHAZADO"]:
            return Response(
                {"detail": "Estado inválido. Use VALIDADO o RECHAZADO"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Actualizar
        from django.utils import timezone
        certificado.estado = nuevo_estado
        certificado.fecha_validacion = timezone.now()
        certificado.validado_por = request.user
        certificado.observaciones = observaciones
        certificado.save()

        # Auditar
        Auditoria.objects.create(
            usuario=request.user,
            rol=request.user.perfil.rol,
            accion="UPDATE",
            modelo="Certificado",
            objeto_id=certificado.id,
            descripcion=f"Certificado {nuevo_estado}: {certificado.nombre_archivo}",
            metadatos={
                "estado_anterior": "CARGADO",
                "estado_nuevo": nuevo_estado,
                "observaciones": observaciones
            }
        )

        return Response({
            "id": certificado.id,
            "estado": certificado.estado,
            "fecha_validacion": certificado.fecha_validacion,
            "validado_por": request.user.username,
            "observaciones": certificado.observaciones
        })

    def delete(self, request, certificado_id):
        """Eliminar certificado (solo quien lo subió o TI)"""
        try:
            certificado = Certificado.objects.get(id=certificado_id)
        except Certificado.DoesNotExist:
            return Response(
                {"detail": "Certificado no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Solo el creador o TI pueden eliminar
        if certificado.cargado_por != request.user and request.user.perfil.rol != "TI":
            return Response(
                {"detail": "No tienes permiso para eliminar este certificado"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Auditar antes de eliminar
        Auditoria.objects.create(
            usuario=request.user,
            rol=request.user.perfil.rol,
            accion="DELETE",
            modelo="Certificado",
            objeto_id=certificado.id,
            descripcion=f"Certificado eliminado: {certificado.nombre_archivo}",
            metadatos={
                "tipo": certificado.tipo,
                "registro_id": certificado.registro.id
            }
        )

        # Eliminar archivo físico
        if certificado.archivo:
            try:
                os.remove(certificado.archivo.path)
            except Exception:
                pass

        certificado.delete()

        return Response(
            {"detail": "Certificado eliminado correctamente"},
            status=status.HTTP_204_NO_CONTENT
        )
