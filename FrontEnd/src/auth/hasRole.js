export function hasRole(user, roles = []) {
  if (!user) return false;
  if (user.is_superuser) return true;
  return roles.includes(user.rol);
}
