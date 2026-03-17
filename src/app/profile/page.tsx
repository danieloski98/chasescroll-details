"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Chip, Avatar, Spinner } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

interface UserProfile {
  firstName: string;
  lastName: string;
  companyEmail: string;
  phoneNumber: string;
  position: string;
  address: string;
  bio: string;
  image?: string;
  createdAt: string;
}

export default function ProfileViewPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          throw new Error("Failed to fetch profile. Please log in again.");
        }
        const data = await res.json();
        setUser(data);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        addToast({ title: "Error", description: errorMessage, color: "danger" });
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Or a more specific error component
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-md">
            <Image 
              src="/images/chasescrollLogo.png" 
              alt="Logo" 
              width={18} 
              height={18} 
              className="brightness-0 invert"
            />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Employee Profile</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="light" isIconOnly radius="full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </Button>
          <Link href="/profile/edit">
            <Button color="primary" className="bg-indigo-600 font-bold px-6 shadow-lg shadow-indigo-100">
              Edit Profile
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-12 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Avatar & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card shadow="none" className="border border-gray-100 rounded-3xl overflow-hidden bg-white">
              <CardBody className="p-8 flex flex-col items-center text-center">
                <Avatar 
                  src={user.image || "/images/user-placeholder.jpg"} 
                  className="w-32 h-32 text-large mb-6 ring-4 ring-indigo-50"
                />
                <h1 className="text-2xl font-bold text-slate-900">{user.firstName} {user.lastName}</h1>
                <p className="text-sm font-semibold text-indigo-600 mb-6 uppercase tracking-wider">{user.position}</p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  <Chip variant="flat" size="sm" className="bg-indigo-50 text-indigo-600 font-bold border-none">{user.address.split(",").slice(-2).join(", ")}</Chip>
                  <Chip variant="flat" size="sm" className="bg-indigo-50 text-indigo-600 font-bold border-none">Joined {joinedDate}</Chip>
                </div>
              </CardBody>
            </Card>

            <Card shadow="none" className="border border-gray-100 rounded-3xl bg-white">
              <CardBody className="p-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  Contact Details
                </h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Personal Email</p>
                    <p className="text-sm font-semibold text-slate-900">{user.companyEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-sm font-semibold text-slate-900">{user.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm font-semibold text-slate-900">{user.address}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Bio & Skills */}
          <div className="lg:col-span-2 space-y-6">
            <Card shadow="none" className="border border-gray-100 rounded-3xl bg-white">
              <CardBody className="p-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  Biography
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {user.bio}
                </p>
              </CardBody>
            </Card>

            <Card shadow="none" className="border border-gray-100 rounded-3xl bg-white">
              <CardBody className="p-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2 mb-10">
                  {["UI/UX Design", "Product Strategy", "Design Systems", "Brand Identity", "Adobe Creative Suite", "Figma Expert", "Team Leadership", "Frontend Development"].map(skill => (
                    <Chip key={skill} variant="bordered" className="border-slate-100 text-slate-600 font-bold px-3 py-4">{skill}</Chip>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Primary Focus</p>
                      <p className="text-sm font-bold text-slate-900">User Experience (UX)</p>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Management Role</p>
                      <p className="text-sm font-bold text-slate-900">Lead Design Manager</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
