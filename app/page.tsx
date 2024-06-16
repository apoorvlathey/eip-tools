"use client";

import { EIPOfTheDay } from "@/components/EIPOfTheDay";
import { Layout } from "@/components/Layout";
import { TrendingEIPs } from "@/components/TrendingEIPs";

export default function Home() {
  return (
    <Layout>
      <TrendingEIPs />
      <EIPOfTheDay />
    </Layout>
  );
}
