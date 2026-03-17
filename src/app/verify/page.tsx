"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Skeleton, addToast } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from 'react'


function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!email) {
      addToast({ title: "Error", description: "Email not provided.", color: "danger" });
      router.push("/login");
    }
  }, [email, router]);

  const handleChange = (value: string, index: number) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const otpCode = otp.join("");
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Verification failed");
      }

      addToast({ title: "Success", description: "Login successful!", color: "success" });
      router.push("/profile");

    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Header / Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="bg-indigo-600 p-1.5 rounded-md text-white font-bold">
          S
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">SecureAuth</span>
      </div>

      <Card className="w-full max-w-[480px] shadow-sm border-none bg-white rounded-2xl">
        <CardBody className="p-10 flex flex-col items-center text-center">
          <div className="bg-indigo-50 p-3 rounded-xl mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Identity</h1>
          <p className="text-sm text-slate-500 mb-1">We&apos;ve sent a 6-digit code to your email</p>
          <p className="text-sm font-bold text-slate-900 mb-8 underline decoration-indigo-200 decoration-2 underline-offset-4">
            {email}
          </p>

          <div className="flex gap-2 mb-10">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-16 text-2xl font-bold text-center border-2 border-slate-100 rounded-xl bg-slate-50 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all outline-none text-slate-900"
              />
            ))}
          </div>

          <Button
            color="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            onPress={handleSubmit}
            className="bg-indigo-600 font-bold h-14 rounded-xl shadow-lg shadow-indigo-100 mb-6"
          >
            Verify Account
          </Button>

          <p className="text-sm text-slate-500">
            Didn&apos;t receive the code?{" "}
            <button className="text-indigo-600 font-bold hover:underline">Resend Code</button>
          </p>

          <div className="mt-12 w-full p-4 bg-indigo-50/50 rounded-xl border border-indigo-50 flex items-start gap-3 text-left">
            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              Check your spam folder if you don&apos;t see it in your inbox within a minute. Make sure you&apos;re looking at the right email address.
            </p>
          </div>
        </CardBody>
      </Card>

      <p className="mt-8 text-xs text-slate-400 font-medium italic">
        Powered by SecureAuth Cloud Services
      </p>
    </div>
  );
}


export default function VerifyPage() {
  return (
    <Suspense 
       fallback={
         <div className="w-full h-[100px]">
          <Skeleton className="w-full h-20" />
         </div>
       }
    >
      <VerifyOtpPage />
    </Suspense>
  )
}