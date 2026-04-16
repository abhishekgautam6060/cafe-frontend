export const getRole = () => {
  return localStorage.getItem("role");
};

export const hasAccess = (allowedRoles: string[]) => {
  const role = getRole();
  return allowedRoles.includes(role || "");
};
