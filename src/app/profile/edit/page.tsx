"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { onboardingSchema, type OnboardingFormData } from "@/schemas/onboardingSchema";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button, Card, CardBody, Avatar, Divider } from "@heroui/react";
import Link from "next/link";

export default function EditProfilePage() {
  const methods = useForm<OnboardingFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(onboardingSchema) as any,
    defaultValues: {
      firstName: "Johnathan",
      lastName: "Maxwell",
      companyEmail: "j.maxwell@chasescroll.com",
      phoneNumber: "+1 (555) 123-4567",
      position: "developer",
      dateOfBirth: new Date("1990-01-01"),
      address: "123 Design Street, Suite 400, San Francisco, CA 94103",
      bio: "A dedicated creative leader with over 12 years of experience in user-centric design and brand strategy.",
      profilePhoto: null,
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      console.log("Saving changes:", data);
      // Implementation for saving profile would go here
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/profile" className="flex items-center gap-2 group">
          <div className="p-2 rounded-full group-hover:bg-slate-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-600">Back to Profile</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Draft saved 2m ago</span>
          <Button 
            color="primary" 
            className="bg-indigo-600 font-bold px-8 shadow-lg shadow-indigo-100"
            isLoading={isSubmitting}
            onPress={() => methods.handleSubmit(onSubmit as any)()}
          >
            Save Changes
          </Button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Profile</h1>
          <p className="text-slate-500 font-medium text-sm">Update your personal and professional information</p>
        </div>

        <FormProvider {...methods}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
            
            {/* Avatar Section */}
            <Card shadow="none" className="border border-gray-100 rounded-3xl bg-white overflow-visible">
              <CardBody className="p-10 flex flex-col items-center">
                <div className="relative mb-6">
                  <Avatar 
                    src="/images/user-placeholder.jpg" 
                    className="w-32 h-32 text-large ring-4 ring-indigo-50"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-slate-50 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Change Profile Photo</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recommended: 400x400px • Max 5MB</p>
              </CardBody>
            </Card>

            <Card shadow="none" className="border border-gray-100 rounded-3xl bg-white">
              <CardBody className="p-10 space-y-10">
                {/* Personal Information */}
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <Input name="firstName" label="First Name" placeholder="Johnathan" />
                    <Input name="lastName" label="Last Name" placeholder="Maxwell" />
                    <Input name="companyEmail" label="Company Email" type="email" placeholder="j.maxwell@chasescroll.com" />
                    <Input name="phoneNumber" label="Phone Number" placeholder="+1 (555) 123-4567" />
                  </div>
                </section>

                <Divider className="bg-slate-50" />

                {/* Professional Details */}
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    Professional Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <Select
                      name="position"
                      label="Position"
                      options={[
                        { value: "developer", label: "Senior Creative Director" },
                        { value: "designer", label: "UI/UX Designer" },
                        { value: "manager", label: "Product Manager" },
                      ]}
                    />
                    <Input name="dateOfBirth" label="Date of Birth" type="date" />
                  </div>
                </section>

                <Divider className="bg-slate-50" />

                {/* Location & About */}
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    Location & About
                  </h3>
                  <div className="space-y-8">
                    <Input name="address" label="Mailing Address" placeholder="123 Design Street, Suite 400..." />
                    <Textarea name="bio" label="Biography" placeholder="Tell us about yourself..." minRows={5} />
                  </div>
                </section>
              </CardBody>
            </Card>

            <div className="flex justify-between items-center py-6">
              <Button variant="flat" color="danger" className="font-bold px-6 bg-red-50 text-red-600 border-none">
                Delete Account
              </Button>
              <div className="flex gap-4">
                <Link href="/profile">
                  <Button variant="light" className="font-bold px-8 text-slate-500">Cancel</Button>
                </Link>
                <Button type="submit" color="primary" className="bg-indigo-600 font-bold px-10 shadow-lg shadow-indigo-100">
                  Save All Changes
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </main>
    </div>
  );
}
