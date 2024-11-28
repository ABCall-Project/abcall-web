export type SignUpRequest = {
  name: string;
  lastname?: string | null;
  phoneNumber: string;
  email: string;
  address?: string;
  birthdate?: Date;
  roleId?: string;
  document?: string | null;
  planId?: string | null;
  password: string;
}
