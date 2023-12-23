// Import necessary modules
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

// Define the shape of the response from the registration endpoint
type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

// Create the authentication API using apiSlice
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Define the registration endpoint
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      // Configuration for the registration request
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),

      // Callback function triggered when the registration query is started
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          // Await the completion of the registration query
          const result = await queryFulfilled;

          // Dispatch the user registration action with the activation token from the response
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log("authApi Error:", error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: {
          activation_code,
          activation_token,
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials: "include" as const,
      }),
      // Callback function triggered when the login query is started
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          // Await the completion of the registration query
          const result = await queryFulfilled;

          // Dispatch the user login action
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log("authApi Error:", error);
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: {
          email,
          name,
          avatar,
        },
        credentials: "include" as const,
      }),
      // Callback function triggered when the login query is started
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          // Await the completion of the registration query
          const result = await queryFulfilled;

          // Dispatch the user login action
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log("authApi Error:", error);
        }
      },
    }),
    logout: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",

        credentials: "include" as const,
      }),
      // Callback function triggered when the login query is started
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          // Dispatch the user login action
          dispatch(userLoggedOut());
        } catch (error: any) {
          console.log("authApi Error:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogoutQuery,
} = authApi;
