"use client";

import { Layout } from "@/components/Layout";
import { TrendingEIPs } from "@/components/TrendingEIPs";

export default function Home() {
  return (
    <Layout>
      <TrendingEIPs />
    </Layout>
  );
}
