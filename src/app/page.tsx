"use client";

import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[whitesmoke] flex flex-col items-center justify-center p-6 text-black">
      {/* Logo and Header */}
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
          <Image 
            src="/images/chasescrollLogo.png" 
            alt="Chasescroll Logo" 
            width={60} 
            height={60} 
          />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Chasescroll Portal</h1>
        <p className="text-lg text-slate-500 max-w-md">
          The central hub for employee onboarding, profile management, and internal directory search.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Onboarding Link */}
        <Link href="/onboarding" className="group">
          <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white">
            <CardBody className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">New Employee</h3>
              <p className="text-slate-500 text-sm mb-6">Complete your professional profile to finalize the onboarding process.</p>
              <Button color="primary" variant="flat" className="mt-auto font-bold px-8">Get Started</Button>
            </CardBody>
          </Card>
        </Link>

        {/* Login Link */}
        <Link href="/login" className="group">
          <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white">
            <CardBody className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Staff Login</h3>
              <p className="text-slate-500 text-sm mb-6">Access your dashboard to view and manage your professional details.</p>
              <Button color="success" variant="flat" className="mt-auto font-bold px-8">Login Now</Button>
            </CardBody>
          </Card>
        </Link>

        {/* Search Link */}
        <Link href="/search" className="group">
          <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white">
            <CardBody className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Directory</h3>
              <p className="text-slate-500 text-sm mb-6">Search for colleagues by name or email in the employee directory.</p>
              <Button color="warning" variant="flat" className="mt-auto font-bold px-8">Search All</Button>
            </CardBody>
          </Card>
        </Link>
      </div>

      <footer className="mt-20 text-slate-400 text-sm font-medium">
        © 2026 Chasescroll Technology Inc. Internal HR System.
      </footer>
    </div>
  );
}
