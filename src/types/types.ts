// Otp Model Types
export enum Purpose {
  REGISTER = "REGISTER",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

export type OtpBody = {
  email: string;
  purpose: Purpose;
};

// User Model Types
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SELLER = "SELLER",
}

export type SignupData = {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // Optional role
  otp: string;
  purpose: Purpose;
};

// Error Types
export type ErrorType = {
  success: boolean;
  message: string;
  stack?: string;
};

// Api Response Type
export type ResponseType<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

// Error DTO
export type ErrorDTO = {
  status: number;
  data: {
    message: string;
    stack?: string;
    success: boolean;
  };
};

// Profile Type
export type ProfileType = {
  id?: number;
  name: string;
  email: string;
  role?: UserRole;
  phone?: string;
  city?: string;
  address?: string;
  interest?: string;
  createdAt: Date;
  updatedAt?: Date;
};
