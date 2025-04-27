import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/auth", credentials: "include" }),
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/send-otp",
        method: "POST",
        body: data,
      }),
    }),
    signupUser: builder.mutation({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/update-profile",
        method: "PUT",
        body: data,
      }),
    }),
    userProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/change-password",
        method: "PUT",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "PUT",
        body: data,
      }),
    }),
    deleteProfile: builder.mutation({
      query: () => ({
        url: "/delete-profile",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSendOtpMutation,
  useSignupUserMutation,
  useLoginMutation,
  useLogoutUserMutation,
  useUserProfileQuery,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteProfileMutation,
} = ApiSlice;
export default ApiSlice;
