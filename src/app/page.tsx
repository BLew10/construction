"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Building,
  Calendar,
  FileText,
  BarChart4,
  Users,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
  	if (isAuthenticated) {
  		router.push("/dashboard");
  	}
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b justify-between">
        <Link href="/" className="flex items-center">
          <Building className="h-6 w-6" />
          <span className="ml-2 text-xl font-bold">ConstructionOS</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-2 flex flex-col gap-2 border-b">
          <Link
            href="/features"
            className="py-2 text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="py-2 text-sm font-medium hover:underline underline-offset-4"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="py-2 text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
          <div className="flex gap-2 py-2">
            <Link href="/login" className="w-1/2">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/signup" className="w-1/2">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1">
        <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Streamline Your Construction Projects
                  </h1>
                  <p className="text-base text-muted-foreground md:text-xl">
                    Manage projects, schedules, documents, and teams all in one
                    platform. Built for construction professionals.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full">
                      Get Started
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full">
                      Request Demo
                    </Button>
                  </Link>
                </div>
              </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-4 w-full">
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/80 p-2 sm:p-4 shadow-lg backdrop-blur-sm">
                        <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mb-1 sm:mb-2" />
                        <h3 className="text-sm sm:text-base font-semibold">Schedule</h3>
                        <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
                          Manage project timelines
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/80 p-2 sm:p-4 shadow-lg backdrop-blur-sm">
                        <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mb-1 sm:mb-2" />
                        <h3 className="text-sm sm:text-base font-semibold">Documents</h3>
                        <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
                          Centralize all files
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/80 p-2 sm:p-4 shadow-lg backdrop-blur-sm">
                        <BarChart4 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mb-1 sm:mb-2" />
                        <h3 className="text-sm sm:text-base font-semibold">Budget</h3>
                        <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
                          Track financials
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/80 p-2 sm:p-4 shadow-lg backdrop-blur-sm">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 mb-1 sm:mb-2" />
                        <h3 className="text-sm sm:text-base font-semibold">Team</h3>
                        <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
                          Collaborate efficiently
                        </p>
                      </div>
                  </div>
                </div>
              </div>
        </section>
      </main>
      <footer className="py-6 border-t px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © 2023 ConstructionOS. All rights reserved.
            </p>
            <nav className="flex gap-4 justify-center">
              <Link
                href="/terms"
                className="text-xs hover:underline underline-offset-4"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs hover:underline underline-offset-4"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
