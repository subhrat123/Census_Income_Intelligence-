"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Database, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  { icon: Database, title: "Databricks SQL Layer", description: "Query-ready warehouse analytics with enterprise-grade data scale." },
  { icon: Bot, title: "MLflow Inference", description: "Live predictions using production model-serving infrastructure." },
  { icon: Radar, title: "Decision Intelligence", description: "Unified views for trend analysis, segmentation, and forecasting." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative border-b border-border/50 px-4 pb-20 pt-24">
        <div className="mx-auto max-w-6xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 text-sm uppercase tracking-[0.18em] text-primary">
            AI Analytics SaaS
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Census Income Intelligence Platform
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A modern AI analytics workspace combining Databricks SQL, MLflow predictions, and enterprise-ready data exploration.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild><Link href="/dashboard">Open Dashboard <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild variant="secondary"><Link href="/explorer">Explore Data</Link></Button>
            <Button asChild variant="outline"><Link href="/predict">Predict Income</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-3">
        {features.map((feature, idx) => (
          <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
            <Card className="glass-card h-full">
              <CardHeader>
                <feature.icon className="h-6 w-6 text-primary" />
                <CardTitle className="pt-3">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Card className="glass-card">
          <CardHeader><CardTitle>Platform Architecture</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            {["Next.js Frontend", "FastAPI APIs", "Databricks Warehouse", "MLflow Serving"].map((item) => (
              <div key={item} className="rounded-md border border-border bg-background/40 p-4 text-sm">{item}</div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
