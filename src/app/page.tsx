"use client";

import Link from "next/link";
import { useEffect } from "react";
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
} from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center">
          <Building className="h-6 w-6" />
          <span className="ml-2 text-xl font-bold">ConstructionOS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
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
        <div className="ml-4 sm:ml-6 flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Streamline Your Construction Projects
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Manage projects, schedules, documents, and teams all in one
                    platform. Built for construction professionals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full min-[400px]:w-auto"
                    >
                      Request Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-video overflow-hidden rounded-xl md:rounded-2xl bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 backdrop-blur-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/80 p-4 shadow-lg backdrop-blur-sm">
                        <Calendar className="h-10 w-10 text-blue-500 mb-2" />
                        <h3 className="text-lg font-semibold">Schedule</h3>
                        <p className="text-sm text-center text-muted-foreground">
                          Manage project timelines
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/80 p-4 shadow-lg backdrop-blur-sm">
                        <FileText className="h-10 w-10 text-green-500 mb-2" />
                        <h3 className="text-lg font-semibold">Documents</h3>
                        <p className="text-sm text-center text-muted-foreground">
                          Centralize all files
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/80 p-4 shadow-lg backdrop-blur-sm">
                        <BarChart4 className="h-10 w-10 text-orange-500 mb-2" />
                        <h3 className="text-lg font-semibold">Budget</h3>
                        <p className="text-sm text-center text-muted-foreground">
                          Track financials
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-background/80 p-4 shadow-lg backdrop-blur-sm">
                        <Users className="h-10 w-10 text-purple-500 mb-2" />
                        <h3 className="text-lg font-semibold">Team</h3>
                        <p className="text-sm text-center text-muted-foreground">
                          Collaborate efficiently
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 border-t items-center justify-between px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2023 ConstructionOS. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
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
      </footer>
    </div>
  );
}
