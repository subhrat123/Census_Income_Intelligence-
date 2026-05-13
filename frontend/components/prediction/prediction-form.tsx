"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { usePredictIncome } from "@/hooks/use-predict-income";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  age: z.coerce.number().min(17).max(100),
  education_num: z.coerce.number().min(1).max(20),
  capital_gain: z.coerce.number().min(0),
  capital_loss: z.coerce.number().min(0),
  hours_per_week: z.coerce.number().min(1).max(99)
});

type FormValues = z.infer<typeof schema>;

export function PredictionForm() {
  const { predict, result, isLoading, error } = usePredictIncome();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { age: 39, education_num: 13, capital_gain: 2174, capital_loss: 0, hours_per_week: 40 }
  });

  async function onSubmit(values: FormValues) {
    try {
      await predict(values);
      toast.success("Prediction generated");
    } catch {
      toast.error("Prediction request failed");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /> Model Input</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {Object.entries({
              age: "Age",
              education_num: "Education Number",
              capital_gain: "Capital Gain",
              capital_loss: "Capital Loss",
              hours_per_week: "Hours Per Week"
            }).map(([key, label]) => (
              <div key={key} className="space-y-1">
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} type="number" {...form.register(key as keyof FormValues)} />
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Running ML Inference..." : "Predict Income"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="glass-card h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Prediction Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-500/40 bg-red-500/10">
                <AlertTitle>Inference Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result ? (
              <div className="space-y-3">
                <div className="rounded-md border border-border bg-background/40 p-4">
                  <p className="text-xs uppercase text-muted-foreground">Prediction Label</p>
                  <p className="text-3xl font-semibold text-primary">{result.prediction}</p>
                </div>
                <div className="rounded-md border border-border bg-background/40 p-4">
                  <p className="text-xs uppercase text-muted-foreground">Raw Prediction</p>
                  <p className="text-2xl font-semibold">{result.raw_prediction}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Submit model inputs to run real-time MLflow-backed income prediction.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
