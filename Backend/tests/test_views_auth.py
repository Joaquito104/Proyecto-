import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from src.models import VerificacionEmail, PerfilUsuario
import secrets

@pytest.mark.django_db
def test_registrar_usuario_endpoint(monkeypatch):
    client = APIClient()
    data = {
        'username': 'epi_user',
        'email': 'epi@example.test',
        'password': '',  # Colocar aquí la contraseña de test
        'rol': 'CORREDOR'
    }
    # POST to simple registro endpoint
    resp = client.post('/api/registro/', data, format='json')
    assert resp.status_code in (200, 201)
    # usuario creado
    assert User.objects.filter(username='epi_user').exists()

@pytest.mark.django_db
def test_registro_completo_crea_verificacion(monkeypatch):
    client = APIClient()
    # evitar enviar email real
    monkeypatch.setattr('src.utils_registro.enviar_email_verificacion', lambda u, e, t: True)

    data = {
        'username': 'full_user',
        'first_name': 'Full',
        'last_name': 'User',
        'email': 'full@example.test',
        'password': '',  # Colocar aquí la contraseña de test
        'password_confirm': '',  # Colocar aquí la contraseña de test
        'pais': 'CHILE',
        'telefono': '912345678',
        'rol': 'ANALISTA'
    }
    resp = client.post('/api/registro-completo/', data, format='json')
    assert resp.status_code == 201
    user = User.objects.get(username='full_user')
    assert user.is_active is False
    # Verificacion creada
    assert hasattr(user, 'verificacion_email')
    assert user.verificacion_email.email_a_verificar == 'full@example.test'

@pytest.mark.django_db
def test_verificar_email_activa_usuario():
    client = APIClient()
    # crear user y verificacion
    user = User.objects.create_user(username='to_verify', email='v@example.test', password='', is_active=False)  # Colocar aquí la contraseña de test
    # crear perfil asociado requerido por la vista de verificación
    PerfilUsuario.objects.create(usuario=user, rol='ANALISTA')
    token = VerificacionEmail.generar_token()
    ver = VerificacionEmail.objects.create(usuario=user, token=token, email_a_verificar='v@example.test')

    resp = client.post('/api/verificar-email/', {'token': token}, format='json')
    assert resp.status_code == 200
    user.refresh_from_db()
    ver.refresh_from_db()
    assert user.is_active is True
    assert ver.verificado is True
