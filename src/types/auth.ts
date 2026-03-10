export type AdminUser = {
  id: string;
  email: string | null;
  role: string | null;
  created_at?: string | null;
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

export type AdminProfileUpdateInput = {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
};

export type AdminProfileUpdateResponse = {
  admin: AdminUser;
  accessToken: string;
};
