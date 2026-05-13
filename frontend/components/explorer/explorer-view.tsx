"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { RecordsTable } from "@/components/explorer/records-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecords } from "@/hooks/use-records";

const LIMIT = 10;

export function ExplorerView() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [workclass, setWorkclass] = useState("");
  const [sort, setSort] = useState("age");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const query = useMemo(() => ({ page, limit: LIMIT, search, workclass, sort, order }), [order, page, search, sort, workclass]);
  const { response, isLoading, error } = useRecords(query);

  const workclassOptions = Array.from(
    new Set((response?.data ?? []).map((d) => (typeof d.workclass === "string" ? d.workclass : "")).filter(Boolean))
  );

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Enterprise Data Explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search workclass, education, occupation..." className="pl-9" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <Select value={workclass} onValueChange={(v) => { setPage(1); setWorkclass(v === "all" ? "" : v); }}>
            <SelectTrigger><SelectValue placeholder="Filter by workclass" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workclasses</SelectItem>
              {workclassOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => { setPage(1); setSearch(searchInput); }}>Apply</Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>
        ) : response && response.data.length > 0 ? (
          <>
            <RecordsTable
              data={response.data}
              currentSort={sort}
              currentOrder={order}
              onSort={(newSort, newOrder) => {
                setSort(newSort);
                setOrder(newOrder);
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Page {page} • Loaded {response.count} rows</p>
              <div className="flex gap-2">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" disabled={response.count < LIMIT} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-md border border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">No records found for the current filters.</div>
        )}
      </CardContent>
    </Card>
  );
}
