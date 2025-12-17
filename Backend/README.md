# Backend — Instrucciones rápidas para notificaciones por correo y CI

Este documento explica cómo generar una App Password de Google, probar el script local de notificaciones y configurar los Secrets en GitHub Actions.

IMPORTANTE: no subas contraseñas ni App Passwords al repositorio. Usa `Secrets` en GitHub.

## 1) Generar App Password (contraseña de aplicación)
1. Accede a tu cuenta Google: https://myaccount.google.com/security
2. Asegúrate de tener la Verificación en 2 pasos activada.
3. En "Acceso a Google" → "Contraseñas de aplicaciones" crea una nueva contraseña:
   - App: `Correo` (o `Otro` con nombre `CI-Backend`)
   - Dispositivo: el que prefieras
   - Pulsa "Generar" y copia la contraseña de 16 caracteres (la UI puede mostrarla agrupada con espacios).
4. Usa la contraseña SIN ESPACIOS (ej: `fqqoaqrfzsseemf`) en las variables de entorno.

## 2) Probar el envío localmente
En Windows PowerShell (ejecuta **localmente**; NO commitear valores):

```powershell
cd C:\Users\<TuUsuario>\Directorios\Desktop\Proyecto\Ev3-Pi\Backend
.\ven\Scripts\activate
# Exporta variables en tu sesión local (reemplaza los placeholders)
$env:GMAIL_SMTP_USERNAME="<tu_email@ejemplo.com>"
$env:GMAIL_SMTP_PASSWORD="<GMAIL_APP_PASSWORD_16_CHARS>"
$env:NOTIFY_EMAIL_TO="<destino@ejemplo.com>"
$env:NOTIFY_EMAIL_FROM="<from@ejemplo.com>"
python scripts/send_test_email.py
# luego limpiar variables de la sesión
Remove-Item Env:GMAIL_SMTP_PASSWORD
Remove-Item Env:NOTIFY_EMAIL_TO
Remove-Item Env:NOTIFY_EMAIL_FROM
Remove-Item Env:GMAIL_SMTP_USERNAME
```

En Git Bash / WSL (ejecuta localmente; NO commitear valores):

```bash
cd /c/Users/<TuUsuario>/Directorios/Desktop/Proyecto/Ev3-Pi/Backend
source ven/Scripts/activate
# Exporta variables en tu sesión local (reemplaza los placeholders)
export GMAIL_SMTP_USERNAME="<tu_email@ejemplo.com>"
export GMAIL_SMTP_PASSWORD="<GMAIL_APP_PASSWORD_16_CHARS>"
export NOTIFY_EMAIL_TO="<destino@ejemplo.com>"
export NOTIFY_EMAIL_FROM="<from@ejemplo.com>"
python scripts/send_test_email.py
# luego limpiar
unset GMAIL_SMTP_PASSWORD NOTIFY_EMAIL_TO NOTIFY_EMAIL_FROM GMAIL_SMTP_USERNAME
```

Salida esperada: `Correo enviado correctamente a cadamunto@gmail.com`.

Si falla con `535` o `BadCredentials`:
- Asegúrate de usar la App Password de 16 caracteres (sin espacios).
- Revoca y genera una nueva App Password si no estás seguro.
- Si tu cuenta pertenece a una organización o tiene Advanced Protection, las App Passwords pueden estar bloqueadas.

## 3) Añadir Secrets en GitHub (repo privado o público con cuidado)
En el repositorio GitHub: `Settings` → `Secrets` → `Actions`, añade valores seguros (no los pongas en el repo):
- `GMAIL_SMTP_USERNAME` = `<tu_email@ejemplo.com>`
- `GMAIL_SMTP_PASSWORD` = `<GMAIL_APP_PASSWORD_16_CHARS>`
- `NOTIFY_EMAIL_TO` = `<destino@ejemplo.com>`
- `NOTIFY_EMAIL_FROM` = `<from@ejemplo.com>`
- (Opcional) `CODECOV_TOKEN` si usas Codecov en repositorio privado.

El workflow ` .github/workflows/ci.yml` ya utiliza estas variables (requiere que las crees).

## 4) Seguridad y buenas prácticas
- Usa una App Password específica para CI y revócala si se expone.
- Para producción considera usar OAuth2 (XOAUTH2) o un proveedor de correo transaccional (SendGrid, Mailgun) con API keys gestionadas.
- No compartas contraseñas en el chat ni en commits.

---
Si quieres, actualizo el `workflow` para leer los Secrets en un job `deploy` o creo un `workflow_dispatch` manual para pruebas seguras. ¿Lo hago ahora?