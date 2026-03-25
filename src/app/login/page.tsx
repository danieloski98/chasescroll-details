"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardBody, Divider, addToast } from "@heroui/react";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const methods = useForm<LoginFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(loginSchema) as any,
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 404) {
        addToast({
          title: "Account Not Found",
          description: "Please register first.",
          color: "warning",
        });
        router.push("/"); // Redirect to registration
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }

      addToast({
        title: "OTP Sent",
        description: "Check your email for the verification code.",
        color: "success",
      });

      // Pass email to verify page via query param
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);

    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[whitesmoke] flex flex-col items-center justify-center p-4">
      {/* Header / Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="">
          <Image 
            src="/images/chasescrollLogo.png" 
            alt="Logo" 
            width={20} 
            height={20} 
            className=""
          />
        </div>
        <span className="text-lg font-bold text-slate-900">Chasescroll Employee Portal</span>
      </div>

      <Card className="w-full max-w-[400px] shadow-sm border-none bg-white rounded-2xl overflow-hidden">
        <CardBody className="p-8 flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2 mt-4">Login</h1>
          <p className="text-sm text-slate-500 mb-8">
            Enter your email to receive an authentication code.
          </p>

          <FormProvider {...methods}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <form onSubmit={handleSubmit(onSubmit as any)} className="w-full space-y-6 text-left">
              <Input 
                name="email" 
                label="Email Address" 
                placeholder="name@company.com"
              />

              <Button
                type="submit"
                color="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                className="bg-indigo-600 font-bold h-12 shadow-lg shadow-indigo-100"
              >
                Send OTP
              </Button>
            </form>
          </FormProvider>

          <div className="w-full flex items-center gap-4 my-8">
            <Divider className="flex-1 bg-slate-100" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
            <Divider className="flex-1 bg-slate-100" />
          </div>

         

          <Link href="/onboarding" className="text-sm font-bold text-indigo-600 mt-8 hover:underline">
            Don&apos;t have an account?
          </Link>
        </CardBody>
      </Card>

      {/* Footer / Info */}
      <div className="mt-12 flex gap-4">
        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
      </div>
      <p className="mt-4 text-xs text-slate-400 font-medium italic">
        © 2026 Chasescroll Employee Portal. All rights reserved.
      </p>
    </div>
  );
}
