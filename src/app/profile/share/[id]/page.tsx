"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Chip, Avatar, Spinner } from "@heroui/react";
import Image from "next/image";
import { useParams } from "next/navigation";

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

export default function PublicProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/employees/${id}`);
        if (!res.ok) {
          throw new Error("Employee profile not found");
        }
        const data = await res.json();
        setUser(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Profile not found";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h1>
        <p className="text-slate-500">{error || "The requested profile does not exist."}</p>
      </div>
    );
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[whitesmoke]">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md">
            <Image 
              src="/images/chasescrollLogo.png" 
              alt="Logo" 
              width={18} 
              height={18} 
            />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Employee Details</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-12 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column */}
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
                  <Chip variant="flat" size="sm" className="bg-indigo-50 text-indigo-600 font-bold border-none">Joined {joinedDate}</Chip>
                </div>
              </CardBody>
            </Card>

            <Card shadow="none" className="border border-gray-100 rounded-3xl bg-white">
              <CardBody className="p-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  Professional Info
                </h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Email</p>
                    <p className="text-sm font-semibold text-slate-900">{user.companyEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
                    <p className="text-sm font-semibold text-slate-900 uppercase">{user.position}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card shadow="none" className="border border-gray-100 rounded-3xl bg-white">
              <CardBody className="p-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  About
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {user.bio || "No biography provided."}
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
