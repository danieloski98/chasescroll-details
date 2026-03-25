"use client";

import React, { useState, useEffect } from "react";
import { Input, Card, CardBody, Avatar, Button, Spinner } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  companyEmail: string;
  position: string;
  image?: string;
}

export default function EmployeeSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchEmployees = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/employees/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchEmployees, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="min-h-screen bg-[whitesmoke]">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/profile" className="flex items-center gap-2">
          <div className="p-1.5 rounded-md">
            <Image 
              src="/images/chasescrollLogo.png" 
              alt="Logo" 
              width={18} 
              height={18} 
            />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Chasescroll Employee Directory</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Find an Employee</h1>
          <p className="text-slate-500 font-medium">Search by name or company email address</p>
        </div>

        <div className="relative mb-12">
          <Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search employees..."
            size="lg"
            variant="bordered"
            radius="lg"
            startContent={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
            classNames={{
              inputWrapper: "bg-white h-16 px-6 border-slate-200 shadow-sm hover:border-slate-300 focus-within:!border-indigo-500",
              input: "text-lg font-medium text-black",
            }}
          />
          {loading && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <Spinner size="sm" color="primary" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((employee) => (
              <Link key={employee._id} href={`/profile/share/${employee._id}`}>
                <Card 
                  shadow="none" 
                  className="border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/10 transition-all cursor-pointer mb-4"
                >
                  <CardBody className="p-4 flex flex-row items-center gap-4">
                    <Avatar 
                      src={employee.image || "/images/user-placeholder.jpg"} 
                      size="lg"
                      className="ring-2 ring-slate-50"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{employee.firstName} {employee.lastName}</h3>
                      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{employee.position}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{employee.companyEmail}</p>
                    </div>
                    <Button variant="light" isIconOnly radius="full" className="text-slate-300 group-hover:text-indigo-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Button>
                  </CardBody>
                </Card>
              </Link>
            ))
          ) : query && !loading ? (
            <div className="text-center py-12">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-slate-500 font-bold">No employees found for &quot;{query}&quot;</p>
            </div>
          ) : !query ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
              <p className="text-slate-400 font-medium italic">Enter a name to start searching</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
