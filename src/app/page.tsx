"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /registrationform when the homepage loads
    router.push("/registrationform");
  }, [router]);

  return null;
}