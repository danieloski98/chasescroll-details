"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { onboardingSchema, type OnboardingFormData } from "@/schemas/onboardingSchema";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button, Card, CardBody, Divider, Spinner, addToast } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/ImageUpload";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
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

  const { handleSubmit, formState: { isSubmitting }, reset } = methods;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        
        // Format date for the input field (YYYY-MM-DD)
        if (data.dateOfBirth) {
          data.dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0];
        }
        
        reset(data);
      } catch (error: unknown) {
        console.error(error);
        addToast({ title: "Error", description: "Failed to load profile", color: "danger" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let imageUrl = (data as any).image;

      // Handle image upload if a new file was selected
      if (data.profilePhoto instanceof File) {
        const formData = new FormData();
        formData.append("file", data.profilePhoto);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // Prepare payload
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { profilePhoto: _, ...rest } = data;
      const payload = { ...rest, image: imageUrl };

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      
      addToast({ title: "Success", description: "Profile updated successfully", color: "success" });
      router.push("/profile");
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to save changes";
      addToast({ title: "Error", description: message, color: "danger" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[whitesmoke]">
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
          <Button 
            color="primary" 
            className="bg-indigo-600 font-bold px-8 shadow-lg shadow-indigo-100"
            isLoading={isSubmitting}
            onPress={() => handleSubmit(onSubmit)()}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Avatar Section */}
            <Card shadow="none" className="border border-gray-100 rounded-3xl bg-white overflow-visible">
              <CardBody className="p-10 flex flex-col items-center">
                <div className="mb-6">
                  <ImageUpload />
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

            <div className="flex justify-end items-center py-6">
              <div className="flex gap-4">
                <Link href="/profile">
                  <Button variant="light" className="font-bold px-8 text-slate-500">Cancel</Button>
                </Link>
                <Button type="submit" color="primary" className="bg-indigo-600 font-bold px-10 shadow-lg shadow-indigo-100" isLoading={isSubmitting}>
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
