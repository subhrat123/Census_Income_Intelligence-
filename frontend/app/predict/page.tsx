import { AppShell } from "@/components/layout/app-shell";
import { PredictionForm } from "@/components/prediction/prediction-form";

export default function PredictPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">AI Income Prediction</h1>
        <p className="text-sm text-muted-foreground">Run model inference using MLflow serving through your FastAPI integration.</p>
      </div>
      <PredictionForm />
    </AppShell>
  );
}
