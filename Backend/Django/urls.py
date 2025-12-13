from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# =========================
# VIEWSETS
# =========================
from src.views.registros import RegistroViewSet

# =========================
# VISTAS API
# =========================
from src.views.auth import mi_perfil
from src.views.certificados import CargaCertificadosView
from src.views.calificaciones import CalificacionView
from src.views.auditoria import AuditoriaView
from src.views.reglas_negocio import ReglasNegocioView, ReglaNegocioDetailView
from src.views.usuarios import UsuariosView, UsuarioDetailView

# VALIDACIÓN
from src.views.validacion import (
    BandejaValidacionView,
    ValidarCalificacionView,
    EnviarValidacionView,
)

# =========================
# ROUTER
# =========================
router = DefaultRouter()
router.register(r"registros", RegistroViewSet, basename="registros")

urlpatterns = [
    path("admin/", admin.site.urls),

    # ---------- AUTH ----------
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/perfil/", mi_perfil, name="mi_perfil"),

    # ---------- MÓDULOS ----------
    path("api/certificados/", CargaCertificadosView.as_view()),
    path("api/calificaciones/", CalificacionView.as_view()),
    path("api/calificaciones/<int:calificacion_id>/enviar/", EnviarValidacionView.as_view()),

    # VALIDACIÓN
    path("api/validacion/", BandejaValidacionView.as_view()),
    path("api/validacion/<int:calificacion_id>/", ValidarCalificacionView.as_view()),

    # AUDITORÍA
    path("api/auditoria/", AuditoriaView.as_view()),

    # REGLAS
    path("api/reglas-negocio/", ReglasNegocioView.as_view()),
    path("api/reglas-negocio/<int:pk>/", ReglaNegocioDetailView.as_view()),

    # USUARIOS
    path("api/usuarios/", UsuariosView.as_view()),
    path("api/usuarios/<int:pk>/", UsuarioDetailView.as_view()),

    # VIEWSETS
    path("api/", include(router.urls)),
]
