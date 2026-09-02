const adminEmails = (process.env.EXPO_PUBLIC_ADMIN_EMAILS ?? '')
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

export const canAccessAdminConsole = (email?: string) =>
  Boolean(email && adminEmails.includes(email.trim().toLowerCase()));
