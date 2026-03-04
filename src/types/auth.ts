export type AdminUser = {
  id: string;
  email: string | null;
  role: string | null;
};

export type AdminLoginResponse = {
  admin: AdminUser;
  accessToken: string;
  refreshToken: string;
};

export type AdminRefreshResponse = {
  accessToken: string;
  refreshToken: string;
};
