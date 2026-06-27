'use client';

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import axios from 'axios';
import axiosInstance from '../../../services/api/axiosInstance';
import toast from 'react-hot-toast';
import { Lead, PaginatedResult } from '../../../types';
import useDebounce from '../../../hooks/useDebounce';

import SearchBar from '../../../features/leads/components/SearchBar';
import StatusFilter from '../../../features/leads/components/StatusFilter';
import SourceFilter from '../../../features/leads/components/SourceFilter';
import Pagination from '../../../features/leads/components/Pagination';
import LeadTable from '../../../features/leads/components/LeadTable';
import EmptyState from '../../../features/leads/components/EmptyState';
import LeadFormModal from '../../../features/leads/components/LeadFormModal';
import DeleteLeadModal from '../../../features/leads/components/DeleteLeadModal';
import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';

function LeadsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialPage = Number(searchParams.get('page') || '1');
  const initialLimit = Number(searchParams.get('limit') || '10');
  const initialQ = searchParams.get('q') || '';
  const initialStatus = searchParams.get('status') || '';
  const initialSource = searchParams.get('source') || '';
  const initialSortBy = searchParams.get('sortBy') || 'createdAt';
  const initialSortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState(initialStatus);
  const [source, setSource] = useState(initialSource);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  const debouncedQ = useDebounce(q, 500);

  const [leadsData, setLeadsData] = useState<PaginatedResult<Lead> | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLeads = useCallback(async (
    currentPage: number,
    searchQuery: string,
    filterStatus: string,
    filterSource: string,
    sortField: string,
    sortDir: string
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit,
        sortBy: sortField,
        sortOrder: sortDir,
      };

      const trimmedQ = searchQuery.trim();
      if (trimmedQ) params.q = trimmedQ;
      if (filterStatus) params.status = filterStatus;
      if (filterSource) params.source = filterSource;

      const response = await axiosInstance.get('/leads', { 
        params,
        signal: controller.signal
      });

      if (response.data && response.data.success) {
        setLeadsData(response.data.data);
      }
    } catch (error: any) {
      if (axios.isCancel(error) || error.name === 'CanceledError') {
        return;
      }
      const errMsg = error.response?.status === 500
        ? 'An unexpected server error occurred. Please try again later.'
        : error.response?.data?.message || 'Failed to fetch leads';
      toast.error(errMsg);
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [limit]);

  const updateUrl = useCallback((
    currentPage: number,
    searchQuery: string,
    filterStatus: string,
    filterSource: string,
    sortField: string,
    sortDir: string
  ) => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', String(limit));
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (filterStatus) params.set('status', filterStatus);
    if (filterSource) params.set('source', filterSource);
    params.set('sortBy', sortField);
    params.set('sortOrder', sortDir);

    const newUrl = `${pathname}?${params.toString()}`;
    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
  }, [limit, pathname]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    fetchLeads(page, debouncedQ, status, source, sortBy, sortOrder);
    updateUrl(page, debouncedQ, status, source, sortBy, sortOrder);
  }, [page, debouncedQ, status, source, sortBy, sortOrder, fetchLeads, updateUrl]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, status, source]);

  const handleFormSubmit = useCallback(async (formData: any) => {
    setModalLoading(true);
    try {
      if (activeLead) {
        const response = await axiosInstance.put(`/leads/${activeLead.id}`, formData);
        toast.success(response.data.message || 'Lead updated successfully');
      } else {
        const response = await axiosInstance.post('/leads', formData);
        toast.success(response.data.message || 'Lead created successfully');
      }
      setModalOpen(false);
      setActiveLead(null);
      fetchLeads(page, debouncedQ, status, source, sortBy, sortOrder);
    } catch (error: any) {
      const errMsg = error.response?.status === 500
        ? 'An unexpected server error occurred. Please try again later.'
        : error.response?.data?.message || 'Operation failed';
      toast.error(errMsg);
    } finally {
      setModalLoading(false);
    }
  }, [activeLead, page, debouncedQ, status, source, sortBy, sortOrder, fetchLeads]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!leadToDelete) return;
    setDeleteLoading(true);
    try {
      const response = await axiosInstance.delete(`/leads/${leadToDelete.id}`);
      toast.success(response.data.message || 'Lead deleted successfully');
      setDeleteModalOpen(false);
      setLeadToDelete(null);

      if (leadsData && leadsData.items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchLeads(page, debouncedQ, status, source, sortBy, sortOrder);
      }
    } catch (error: any) {
      const errMsg = error.response?.status === 500
        ? 'An unexpected server error occurred. Please try again later.'
        : error.response?.data?.message || 'Failed to delete lead';
      toast.error(errMsg);
    } finally {
      setDeleteLoading(false);
    }
  }, [leadToDelete, leadsData, page, debouncedQ, status, source, sortBy, sortOrder, fetchLeads]);

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);

  const handleNewLeadClick = useCallback(() => {
    setActiveLead(null);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setActiveLead(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setLeadToDelete(null);
  }, []);

  const handleEditClick = useCallback((lead: Lead) => {
    setActiveLead(lead);
    setModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteModalOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your business leads</p>
        </div>
        <Button
          onClick={handleNewLeadClick}
          className="inline-flex items-center cursor-pointer"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Lead
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <SearchBar value={q} onChange={setQ} />
        <StatusFilter value={status} onChange={setStatus} />
        <SourceFilter value={source} onChange={setSource} />
      </div>

      {leadsData && leadsData.items.length === 0 && !loading ? (
        <EmptyState onCreateClick={handleNewLeadClick} />
      ) : (
        <div className="space-y-4">
          <LeadTable
            leads={leadsData ? leadsData.items : []}
            isLoading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          {leadsData && leadsData.totalPages > 0 && (
            <Pagination
              currentPage={leadsData.page}
              totalPages={leadsData.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      <LeadFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        lead={activeLead}
        isLoading={modalLoading}
      />

      <DeleteLeadModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        leadName={leadToDelete ? leadToDelete.name : ''}
        isLoading={deleteLoading}
      />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    }>
      <LeadsContent />
    </Suspense>
  );
}
