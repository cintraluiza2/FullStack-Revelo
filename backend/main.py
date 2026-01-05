from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pathlib import Path
from datetime import datetime
import json

app = FastAPI(title="Candidate Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data file path
DATA_FILE = Path(__file__).parent.parent / "mock-data" / "candidates.json"


def load_candidates():
    """Load candidates from JSON file"""
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data["candidates"]


def parse_date(date_string: str) -> datetime:
    """Parse ISO date string to datetime object for sorting"""
    try:
        return datetime.fromisoformat(date_string)
    except (ValueError, TypeError):
        return datetime.min


@app.get("/")
def read_root():
    """Root endpoint"""
    return {"message": "Candidate Management API", "docs": "/docs"}


@app.get("/api/candidates")
def get_candidates(
    page: int = Query(1, ge=1, description="Page number (starts at 1)"),
    per_page: int = Query(5, ge=1, le=50, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by name, position, or company (case-insensitive)"),
    sort_by: str = Query("last_activity", description="Field to sort by: 'last_activity' or 'name'"),
    sort_order: str = Query("desc", description="Sort order: 'asc' or 'desc'"),
    application_type: Optional[List[str]] = Query(None, description="Filter by application type(s)"),
    source: Optional[List[str]] = Query(None, description="Filter by source(s)"),
    job_id: Optional[str] = Query(None, description="Filter by exact job ID"),
    responsibility: Optional[List[str]] = Query(None),
    pipeline_tasks: Optional[List[str]] = Query(None),
    education: Optional[List[str]] = Query(None),
):

    
    # =========================================================================
    # STEP 1: LOAD DATA
    # =========================================================================
    candidates = load_candidates()
    
    # =========================================================================
    # STEP 2: FILTERING
    # =========================================================================
    
    # Filter 1: Search by name, position, or company (case-insensitive)
    if search:
        search_lower = search.lower().strip()
        candidates = [
            c for c in candidates
            if (search_lower in c.get('name', '').lower() or
                search_lower in c.get('position', '').lower() or
                search_lower in c.get('company', '').lower())
        ]
    
    # Filter 2: Application type filter (list parameter)
    if application_type:
        candidates = [
            c for c in candidates
            if c.get('application_type') in application_type
        ]
    
    # Filter 3: Source filter (list parameter)
    if source:
        candidates = [
            c for c in candidates
            if c.get('source') in source
        ]
    
    # Filter 4: Job ID filter (exact match)
    if job_id:
        candidates = [
            c for c in candidates
            if c.get('job_id') == job_id
        ]
        
    if responsibility: candidates = [c for c in candidates if c.get("responsibility") in responsibility] 
    if pipeline_tasks: candidates = [c for c in candidates if c.get("pipeline_task") in pipeline_tasks] 
    if education: candidates = [c for c in candidates if c.get("education") in education]    
    
    # =========================================================================
    # STEP 3: SORTING
    # =========================================================================
    
    # Normalize sort parameters
    sort_by = sort_by.lower().strip()
    sort_order = sort_order.lower().strip()
    
    # Determine sort direction (True = descending, False = ascending)
    reverse_order = (sort_order == 'desc')
    
    # Apply sorting based on field
    if sort_by == 'name':
        # Sort alphabetically by name (case-insensitive)
        candidates.sort(
            key=lambda x: x.get('name', '').lower(),
            reverse=reverse_order
        )
    else:
        # Default: sort by last_activity (date field)
        candidates.sort(
            key=lambda x: parse_date(x.get('last_activity', '')),
            reverse=reverse_order
        )
    
    # =========================================================================
    # STEP 4: PAGINATION
    # =========================================================================
    
    # Calculate total count after filtering
    total = len(candidates)
    
    # Calculate total pages (minimum 1 page even with no results)
    total_pages = max(1, (total + per_page - 1) // per_page)
    
    # Handle out-of-bounds pages gracefully
    # If requested page exceeds total_pages, return empty results
    if page > total_pages and total > 0:
        paginated_candidates = []
    else:
        # Calculate slice indices
        start_index = (page - 1) * per_page
        end_index = start_index + per_page
        
        # Slice the candidates list
        paginated_candidates = candidates[start_index:end_index]
    
    # =========================================================================
    # STEP 5: RESPONSE FORMAT
    # =========================================================================
    
    return {
        "candidates": paginated_candidates,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "responsibility": responsibility,
        "education": education,
        "pipeline_tasks": pipeline_tasks
    }