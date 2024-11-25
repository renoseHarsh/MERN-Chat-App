import { useForm, SubmitHandler } from "react-hook-form";
import { useUserContext } from "../context/UserContext";
import { registerUser } from "../api/authApi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getUserDetails } from "../api/userApi";

type Inputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const { setUser } = useUserContext();

  const [error, setError] = useState<string | null>();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      };
      const response = await registerUser(payload);
      setLoading(false);
      if (response.status === 201 && response.data)
        setUser((await getUserDetails()).data);
      else setError(response.message);
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto flex h-[600px] w-[500px] transform cursor-default flex-col items-center self-center rounded-xl border border-[#4C3F89] bg-[#3A3A5F] py-10 text-white shadow-[0px_4px_12px_rgba(0,0,0,0.1)] transition duration-300 hover:shadow-[0px_6px_16px_rgba(0,_0,_0,_0.2)]">
      {loading ? (
        <div className="flex h-screen w-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <h1 className="text-3xl">Welcome to Chat App</h1>
          <h2 className="text-xl text-[#D1D5DB]">
            Create an account to get started
          </h2>
          <form
            className="my-auto mt-8 flex flex-col items-center justify-center gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Full Name */}
            <div className="flex flex-col items-center">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Full Name"
                  {...register("fullName", {
                    required: "Please enter your full name.",
                    minLength: { value: 3, message: "Name is too short." },
                    maxLength: { value: 50, message: "Name is too long." },
                  })}
                />
              </label>
              <span className="h-2 text-sm font-semibold text-[#FF6B6B]">
                {errors.fullName && errors.fullName.message}
              </span>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-21Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Email"
                  {...register("email", {
                    required: "Please provide a valid email address.",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Please provide a valid email address.",
                    },
                  })}
                />
              </label>
              <span className="h-2 text-sm font-semibold text-[#FF6B6B]">
                {errors.email && errors.email.message}
              </span>
            </div>

            {/* Password */}
            <div className="flex flex-col items-center gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  {...register("password", {
                    required: "A password is required.",
                    minLength: { value: 8, message: "Password is too short." },
                  })}
                />
              </label>
              <span className="h-2 text-sm font-semibold text-[#FF6B6B]">
                {errors.password && errors.password.message}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col items-center gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  className="grow"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password.",
                    validate: (confirmPass) =>
                      confirmPass === watch("password") ||
                      "Passwords do not match.",
                  })}
                />
              </label>
              <span className="h-2 text-sm font-semibold text-[#FF6B6B]">
                {errors.confirmPassword && errors.confirmPassword.message}
              </span>
            </div>

            <button className="w-full rounded-md bg-[#4C3F89] py-2 text-white shadow-md transition-colors duration-300 hover:bg-[#3B2E6B] active:border">
              Sign Up
            </button>
            <div className="flex h-2 flex-col items-center text-sm font-semibold text-[#FF6B6B]">
              {error?.split(".").map((err, index) => <p key={index}>{err}</p>)}
            </div>
          </form>
          <span className="text-[13px] font-medium text-[#B39DDB]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#d0c1eb] underline hover:cursor-pointer hover:text-[#9C79C7]"
            >
              Log In
            </Link>
          </span>
        </>
      )}
    </div>
  );
}