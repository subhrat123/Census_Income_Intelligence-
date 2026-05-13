import { ExplorerView } from "@/components/explorer/explorer-view";
import { AppShell } from "@/components/layout/app-shell";

export default function ExplorerPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Data Explorer</h1>
        <p className="text-sm text-muted-foreground">Search, sort, and filter census records through server-side pagination.</p>
      </div>
      <ExplorerView />
    </AppShell>
  );
}
