"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { onboardingSchema, type OnboardingFormData } from "@/schemas/onboardingSchema";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button, Card, CardBody } from "@heroui/react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import Image from "next/image";
import {addToast} from "@heroui/react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const methods = useForm<OnboardingFormData>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: yupResolver(onboardingSchema) as any,
      defaultValues: {
      firstName: "",
      lastName: "",
      companyEmail: "",
      phoneNumber: "",
      position: "",
      dateOfBirth: undefined,
      address: "",
      bio: "",
      profilePhoto: null,
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      let imageUrl = "";
      if (data.profilePhoto) {
        const formData = new FormData();
        formData.append("file", data.profilePhoto as File);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { profilePhoto: _, ...rest } = data;
      const payload = { ...rest, image: imageUrl };

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");
      
      addToast({
        title: "Success",
        description: "Profile saved successfully!",
        color: 'success'
      });
      router.push("/login");
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again.";
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger"
      })  
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="">
            <Image 
              src="/images/chasescrollLogo.png" 
              alt="Chasescroll Logo" 
              width={24} 
              height={24} 
              className=""
            />
          </div>
          <span className="text-xl font-bold text-gray-900">Chasescroll Employee Portal</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Employee Profile</h1>
          <p className="mt-2 text-lg text-gray-500">
            Complete the professional profile to finalize the onboarding process.
          </p>
        </div>

        <FormProvider {...methods}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-12">
              {/* Profile Photo Section */}
            <Card shadow="none" className="bg-gray-50/50 border border-gray-100 rounded-2xl">
              <CardBody className="p-8">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <ImageUpload />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG or JPG, max size 5MB. 400x400px recommended.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Form Fields Section */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                <Input 
                  name="firstName" 
                  label="First Name" 
                  placeholder="e.g. Michael" 
                />
                <Input 
                  name="lastName" 
                  label="Last Name" 
                  placeholder="e.g. Scott" 
                />
                
                <Input 
                  name="companyEmail" 
                  label="Company Email" 
                  type="email" 
                  placeholder="name@company.com" 
                />
                <Input 
                  name="phoneNumber" 
                  label="Phone Number" 
                  placeholder="+1 (555) 000-0000" 
                />
                
                <Select
                  name="position"
                  label="Position"
                  placeholder="Select position"
                  options={[
                     { value: "CEO", label: "CEO" },
                     { value: "CFO", label: "CFO" },
                    { value: "Software Engineer", label: "Software Engineer" },
                    { value: "Designer", label: "Designer" },
                    { value: "Manager", label: "Manager" },
                    { value: "QA Engineer", label: "QA Engineer" },
                  ]}
                />
                
                <Input 
                  name="dateOfBirth" 
                  label="Date of Birth" 
                  type="date" 
                />
              </div>

              <div className="space-y-8">
                <Input 
                  name="address" 
                  label="Address" 
                  placeholder="123 Corporate Blvd, Suite 100" 
                />
                <Textarea 
                  name="bio" 
                  label="Bio" 
                  placeholder="Briefly describe your experience and skills..." 
                  minRows={4} 
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end items-center gap-4 pt-8 border-t border-gray-100">
              <Button
                type="button"
                variant="light"
                size="lg"
                className="px-8 font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={isSubmitting}
                className="px-10 font-bold bg-indigo-600 shadow-lg shadow-indigo-200"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </FormProvider>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2024 HR Systems Inc.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
