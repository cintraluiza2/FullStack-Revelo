import { useState } from "react";
import { SearchInput } from "./SearchInput";
import { CollapsibleSection } from "./CollapsibleSection";

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


interface SidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ filters, onFiltersChange }) => {
  const [fullTextSearch, setFullTextSearch] = useState(false);

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <aside className="w-[248px] bg-[#f7f8f7] min-h-screen px-6 pt-2 pb-6">
      {/* Search Input */}
      <SearchInput
        value={filters.search}
        onChange={(val) => updateFilter("search", val)}
      />

      {/* Full Text Search Toggle */}
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="fullTextSearch"
              checked={fullTextSearch}
              onChange={(e) => setFullTextSearch(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-[50px] h-[25px] bg-[#ccd4d1] rounded-full peer peer-checked:bg-[#047957] peer-focus:ring-2 peer-focus:ring-[#047957]/20 transition-colors duration-200 ease-in-out">
              <div
                className={`absolute left-0 top-0 w-[25px] h-[25px] bg-white border-[3px] rounded-full transition-transform duration-200 ease-in-out ${
                  fullTextSearch
                    ? "translate-x-[25px] border-[#047957]"
                    : "translate-x-0 border-[#ccd4d1]"
                }`}
              ></div>
            </div>
          </label>
          <label
            htmlFor="fullTextSearch"
            className="text-[13px] font-medium text-[#15372c] cursor-pointer leading-[19.5px]"
          >
            Full Text Search
          </label>
        </div>
        <p className="text-[11.6px] text-[#909090] font-light leading-[12px] mt-1">
          (Includes resumes and notes)
        </p>
      </div>

      {/* Sort Dropdown */}
      <div className="mt-4">
        <button
          onClick={() => {
            const newSortBy =
              filters.sortBy === "last_activity" ? "name" : "last_activity";
            const newSortOrder = filters.sortOrder === "desc" ? "asc" : "desc";
            onFiltersChange({
              ...filters,
              sortBy: newSortBy,
              sortOrder: newSortOrder,
            });
          }}
          className="w-full h-[36px] px-3 flex items-center justify-between border border-[#e1e1e1] bg-white rounded text-[14px] text-[#333333] cursor-pointer"
        >
          <span className="truncate">
            {filters.sortBy === "last_activity" ? "Last Activity" : "Name"} (
            {filters.sortOrder === "desc" ? "new to old" : "old to new"})
          </span>
          <svg
            className="w-3.5 h-3.5 text-[#909090] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filter Sections */}
      <div className="mt-6">
        <CollapsibleSection title="Application Type">
          {["Referral", "Direct", "Agency"].map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.applicationType.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.applicationType, type]
                    : filters.applicationType.filter((t) => t !== type);
                  updateFilter("applicationType", newTypes);
                }}
              />
              {type}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Source">
          {["LinkedIn", "Indeed", "Glassdoor"].map((src) => (
            <label key={src} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.source.includes(src)}
                onChange={(e) => {
                  const newSources = e.target.checked
                    ? [...filters.source, src]
                    : filters.source.filter((s) => s !== src);
                  updateFilter("source", newSources);
                }}
              />
              {src}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Responsibility">
  {["Team Lead", "Individual Contributor", "Manager"].map((resp) => (
    <label key={resp} className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={filters.responsibility.includes(resp)}
        onChange={(e) => {
          const newResp = e.target.checked
            ? [...filters.responsibility, resp]
            : filters.responsibility.filter((r) => r !== resp);
          updateFilter("responsibility", newResp);
        }}
      />
      {resp}
    </label>
  ))}
</CollapsibleSection>


        <CollapsibleSection title="Pipeline Tasks">
          {["Interview Scheduled", "Offer Sent", "Onboarding"].map((task) => (
            <label key={task} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.pipelineTasks?.includes(task)}
                onChange={(e) => {
                  const newTasks = e.target.checked
                    ? [...(filters.pipelineTasks || []), task]
                    : (filters.pipelineTasks || []).filter((t) => t !== task);
                  updateFilter("pipelineTasks", newTasks);
                }}
              />
              {task}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Education">
          {["High School", "Bachelor", "Master", "PhD"].map((edu) => (
            <label key={edu} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.education?.includes(edu)}
                onChange={(e) => {
                  const newEdu = e.target.checked
                    ? [...(filters.education || []), edu]
                    : (filters.education || []).filter((e2) => e2 !== edu);
                  updateFilter("education", newEdu);
                }}
              />
              {edu}
            </label>
          ))}
        </CollapsibleSection>
      </div>

      {/* Reset Filters Button */}
      <button
        onClick={() =>
          onFiltersChange({
            search: "",
            applicationType: [],
            source: [],
            responsibility: [],
            pipelineTasks: [],
            education: [],
            jobId: undefined,
            sortBy: "last_activity",
            sortOrder: "desc",
          })
        }
        className="mt-6 w-full px-4 py-2 text-[#3574d6] text-[13.9px] font-light flex items-center justify-center gap-2 hover:underline"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span>Reset Filters</span>
      </button>
    </aside>
  );
};
