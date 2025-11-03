import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowDownToLine,
  Calendar,
  Filter,
  History,
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { CallDetail, CallRecord } from "../../data/types";
import { useDataProvider } from "../../providers/DataProviderContext";
import { CallsTable } from "../../components/tables/CallsTable";
import { CallDetailsModal } from "../../components/tables/CallDetailsModal";
import { LoadingSkeleton } from "../../components/ui/LoadingSkeleton";

export function CallsPage() {
  const dataProvider = useDataProvider();
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallDetail | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  useEffect(() => {
    let mounted = true;
    dataProvider.getCallRecords().then((data) => {
      if (mounted) {
        setCalls(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [dataProvider]);

  const agents = useMemo(
    () => Array.from(new Set(calls.map((call) => call.agentName))),
    [calls],
  );

  const handleRowClick = async (call: CallRecord) => {
    setIsFetchingDetail(true);
    const detail = await dataProvider.getCallDetail(call.id);
    if (detail) {
      setSelectedCall(detail);
    }
    setIsFetchingDetail(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Call Intelligence</h1>
          <p className="mt-2 text-sm text-slate-500">
            Filter by agent, status, and direction to dive into any conversation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn-ghost border border-slate-200">
            <History className="h-4 w-4" />
            Saved views
          </button>
          <button type="button" className="btn-primary">
            <ArrowDownToLine className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <FilterBadge icon={<Calendar className="h-4 w-4" />} label="Last 7 days" />
        <FilterBadge icon={<SlidersHorizontal className="h-4 w-4" />} label="All statuses" />
        <FilterBadge icon={<Search className="h-4 w-4" />} label={`${agents.length} agents`} />
        <button type="button" className="btn-ghost border border-slate-200">
          <Filter className="h-4 w-4" />
          Advanced filters
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Real-time sync
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton className="h-96 rounded-3xl" />
      ) : (
        <CallsTable calls={calls} onRowClick={handleRowClick} />
      )}

      {isFetchingDetail ? (
        <div className="fixed right-6 top-20 z-40 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading call insight…
        </div>
      ) : null}

      <CallDetailsModal detail={selectedCall} onClose={() => setSelectedCall(null)} />
    </div>
  );
}

interface FilterBadgeProps {
  icon: ReactNode;
  label: string;
}

function FilterBadge({ icon, label }: FilterBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
      {icon}
      {label}
    </span>
  );
}
