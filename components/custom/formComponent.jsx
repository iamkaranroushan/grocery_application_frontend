import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./input";
import { Button } from "../ui/button";
import { useState } from "react";
import useLogin from "@/hooks/useLogin";
import useSignup from "@/hooks/useSignup";

const FormComponent = ({ className, setIsLoginOpen }) => {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const isLogin = mode === "login";

  const { login, loading: loginLoading} = useLogin();
  const { signup, loading: signupLoading} = useSignup();
  const [apiError, setApiError] = useState(null);

  const schema = z.object({
    name: isLogin ? z.string().optional() : z.string().min(2, "Name is required"),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setApiError(null);
    let response;

    if (isLogin) {
      response = await login(data.email, data.password);
    } else {
      response = await signup(data.name, data.email, data.password);
    }

    if (response?.error) {
      setApiError(response.error);
    } else {
      setIsLoginOpen?.(false);
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="flex flex-col gap-4">
        {!isLogin && (
          <div className="flex flex-col space-y-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="name"
                  className="p-4 placeholder:text-sm placeholder:text-stone-400 rounded-lg border focus:border-stone-400 focus:outline-none"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-xs pl-4">{errors.name.message}</p>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="email"
                className="p-4 placeholder:text-sm placeholder:text-stone-400 rounded-lg border focus:border-stone-400 focus:outline-none"
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs pl-4">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                placeholder="password"
                className="p-4 placeholder:text-sm placeholder:text-stone-400 rounded-lg border focus:border-stone-400 focus:outline-none"
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-xs pl-4">{errors.password.message}</p>
          )}
        </div>

        <Button className="p-7" disabled={loginLoading || signupLoading}>
          {isLogin
            ? loginLoading
              ? "Logging in..."
              : "Login"
            : signupLoading
            ? "Signing up..."
            : "Register"}
        </Button>

        {apiError && (
          <p className="text-red-500 text-xs pl-4 mt-2">{apiError}</p>
        )}

        <p className="text-sm text-stone-600 mt-3 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="font-semibold text-stone-700 cursor-pointer underline"
            onClick={() => setMode(isLogin ? "signup" : "login")}
          >
            {isLogin ? "Signup here" : "Login here"}
          </span>
        </p>
      </div>
    </form>
  );
};

export default FormComponent;
