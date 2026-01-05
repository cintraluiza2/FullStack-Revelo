import { useState, useEffect } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { CandidateCard } from "./components/CandidateCard";
import { Pagination } from "./components/Pagination";
import type { Candidate } from "./types/candidate";

interface Filters {
  search: string;
  applicationType: string[];
  source: string[];
  responsibility: string[];
  pipelineTasks: string[];
  education: string[];
  jobId?: string;
  sortBy: "last_activity" | "name";
  sortOrder: "asc" | "desc";
}


function App() {
  const [filters, setFilters] = useState<Filters>({
  search: "",
  applicationType: [],
  source: [],
  responsibility: [],
  pipelineTasks: [],
  education: [],
  jobId: undefined,
  sortBy: "last_activity",
  sortOrder: "desc",
});


  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Busca candidatos da API sempre que filtros ou página mudam
  useEffect(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      per_page: "5",
      sort_by: String(filters.sortBy),
      sort_order: String(filters.sortOrder),
    });

    if (filters.search) params.append("search", filters.search);
    if (filters.responsibility.length > 0) {
  filters.responsibility.forEach((r) => params.append("responsibility", r));
}
if (filters.pipelineTasks.length > 0) {
  filters.pipelineTasks.forEach((t) => params.append("pipeline_task", t));
}
if (filters.education.length > 0) {
  filters.education.forEach((e) => params.append("education", e));
}

    if (filters.applicationType.length > 0) {
      filters.applicationType.forEach((t) =>
        params.append("application_type", t)
      );
    }
    if (filters.source.length > 0) {
      filters.source.forEach((s) => params.append("source", s));
    }
    if (filters.jobId) params.append("job_id", filters.jobId);

    setLoading(true);
    fetch(`http://localhost:8000/api/candidates?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data.candidates);
        setTotalPages(data.total_pages);
        setTotal(data.total);
      })
      .catch((err) => {
        console.error("Erro ao buscar candidatos:", err);
        setCandidates([]);
        setTotalPages(1);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [filters, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f7]">
      {/* Page Title */}
      <h1 className="text-[34.59px] font-normal text-[#15372c] px-6 pt-4 pb-3 leading-[46.67px]">
        All Candidates
      </h1>

      <div className="flex">
        {/* Sidebar com filtros */}
        <Sidebar filters={filters} onFiltersChange={setFilters} />

        {/* Main Content */}
        <main className="flex-1 px-6">
          {/* Results Summary */}
          <div className="mb-4 flex items-center gap-4 mt-[9px]">
            <p className="text-[13.8px] text-[#222222]">
              Showing {total} candidate applications
            </p>
          </div>

          {/* Candidate List Header */}
          <div className="bg-neutral-50 border border-[#e1e1e1] border-b-0 rounded-t mb-0">
            <div className="grid grid-cols-[360px_1fr] h-[40px]">
              <div className="px-[15px] text-[12.4px] font-normal text-[#909090] flex items-center border-r border-[#e1e1e1]">
                Name
              </div>
              <div className="px-[15px] text-[12.4px] font-normal text-[#909090] flex items-center">
                Job/Status
              </div>
            </div>
          </div>

          {/* Candidate List */}
          {loading ? (
            <p className="text-center text-gray-500 py-8 bg-white border border-[#e1e1e1]">
              Loading candidates...
            </p>
          ) : candidates.length > 0 ? (
            <div className="bg-white border-l border-r border-[#e1e1e1]">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8 bg-white border border-[#e1e1e1]">
              No candidates found.
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
