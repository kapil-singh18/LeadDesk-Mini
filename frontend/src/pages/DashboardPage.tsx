import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  LogOut,
  RefreshCw,
  Layers,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  DollarSign,
  MessageSquare,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Inbox,
  Eye,
  X
} from 'lucide-react';
import { leadApiClient } from '../services/leadApiClient.js';
import { authApiClient } from '../services/authApiClient.js';
import { Lead, LeadStatus, LeadsResponseData } from '../types/index.js';
import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { Footer } from '../components/layout/Footer.js';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = authApiClient.getUser();

  // State Management
  const [data, setData] = useState<LeadsResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Updating lead state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Detail Modal State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // reset to page 1 on search change
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadApiClient.getLeads({
        search: debouncedSearch,
        status: statusFilter,
        page: currentPage,
        limit: pageSize,
      });

      if (response.success && response.data) {
        setData(response.data);
      } else {
        const errorMsg =
          typeof response.error === 'string'
            ? response.error
            : 'Failed to retrieve leads from server.';
        setError(errorMsg);
      }
    } catch (err: unknown) {
      console.error('Fetch leads error:', err);
      const axiosError = err as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        authApiClient.logout();
        navigate('/admin/login');
        return;
      }
      setError('A network or server error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, currentPage, pageSize, navigate]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle status inline change with Optimistic UI & Rollback
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    // Find current status for potential rollback
    const targetLead = data?.leads.find((l) => l.id === leadId);
    if (!targetLead || targetLead.status === newStatus) return;

    const previousStatus = targetLead.status;
    setUpdatingId(leadId);
    setStatusNotice(null);

    // 1. OPTIMISTIC UPDATE: Update UI badge immediately before API call
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        leads: prev.leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
      };
    });

    try {
      // 2. Perform API PATCH request
      const response = await leadApiClient.updateLeadStatus(leadId, newStatus);
      if (response.success && response.data) {
        setStatusNotice({
          type: 'success',
          message: `Status for ${targetLead.name} updated to ${newStatus}.`,
        });
        // Re-fetch in background to refresh summary counts
        fetchLeads();
      } else {
        throw new Error(typeof response.error === 'string' ? response.error : 'Update rejected');
      }
    } catch (err: unknown) {
      console.error('Status update failed, rolling back UI:', err);
      // 3. ROLLBACK: Revert to previous status on failure
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          leads: prev.leads.map((l) => (l.id === leadId ? { ...l, status: previousStatus } : l)),
        };
      });
      setStatusNotice({
        type: 'error',
        message: `Failed to update status for ${targetLead.name}. Rolled back to ${previousStatus}.`,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    authApiClient.logout();
    navigate('/');
  };

  const leads = data?.leads || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const summary = data?.summary || { all: 0, new: 0, contacted: 0, closed: 0 };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      {/* Admin Navigation Bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5F6FFF] text-white flex items-center justify-center font-bold shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 tracking-tight block leading-none">
                LeadDesk <span className="text-[#5F6FFF]">Mini</span>
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                Admin Management Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 bg-[#F2F3FF] px-3.5 py-2 rounded-full border border-[#5F6FFF]/20">
              <User className="w-3.5 h-3.5 text-[#5F6FFF]" />
              <span className="font-medium">{user?.email || 'Admin'}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <button
            onClick={() => {
              setStatusFilter('All');
              setCurrentPage(1);
            }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'All'
                ? 'bg-white border-[#5F6FFF] shadow-md ring-2 ring-[#5F6FFF]/20'
                : 'bg-white border-gray-100 shadow-xs hover:border-gray-300'
            }`}
          >
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Total Leads
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gray-900">{summary.all}</span>
              <span className="text-xs font-semibold text-[#5F6FFF] bg-[#F2F3FF] px-2.5 py-1 rounded-full">
                All Time
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setStatusFilter('New');
              setCurrentPage(1);
            }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'New'
                ? 'bg-white border-[#5F6FFF] shadow-md ring-2 ring-[#5F6FFF]/20'
                : 'bg-white border-gray-100 shadow-xs hover:border-gray-300'
            }`}
          >
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
              New Submissions
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-[#5F6FFF]">{summary.new}</span>
              <span className="text-xs font-semibold text-[#5F6FFF] bg-[#F2F3FF] px-2.5 py-1 rounded-full">
                Pending
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setStatusFilter('Contacted');
              setCurrentPage(1);
            }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'Contacted'
                ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-gray-100 shadow-xs hover:border-gray-300'
            }`}
          >
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
              In Progress
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-amber-600">{summary.contacted}</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                Contacted
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setStatusFilter('Closed');
              setCurrentPage(1);
            }}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'Closed'
                ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-gray-100 shadow-xs hover:border-gray-300'
            }`}
          >
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Completed
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-emerald-600">{summary.closed}</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Closed
              </span>
            </div>
          </button>
        </div>

        {/* Toolbar: Search, Status Filter & Actions */}
        <Card className="shadow-card border-gray-100 bg-white p-5 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Filter Pills & Limit Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Dropdown or Pills */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              {['All', 'New', 'Contacted', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-gray-900 shadow-2xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh dataset"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#5F6FFF]' : ''}`} />
            </button>
          </div>
        </Card>

        {/* Status Update Toast/Alert */}
        {statusNotice && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm animate-in fade-in duration-200 ${
              statusNotice.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {statusNotice.type === 'error' ? (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              )}
              <span className="font-medium">{statusNotice.message}</span>
            </div>
            <button
              onClick={() => setStatusNotice(null)}
              className="text-xs font-semibold hover:underline cursor-pointer opacity-75"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error Alert View */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 text-red-700 text-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <Button variant="danger" size="sm" onClick={fetchLeads}>
              Retry
            </Button>
          </div>
        )}

        {/* Lead Dataset Container */}
        <Card className="shadow-card border-gray-100 bg-white p-0 overflow-hidden">
          
          {loading ? (
            /* Loading Skeleton */
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="animate-pulse flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="space-y-2 w-1/3">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded-md w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Leads Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'All'
                  ? 'No records matched your search query or status filter criteria.'
                  : 'There are currently no leads submitted in the database.'}
              </p>
              {(searchTerm || statusFilter !== 'All') && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            /* Lead Table View (Desktop) & Cards (Mobile) */
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Applicant Name</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Budget</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Submitted Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#F8F9FD]/60 transition-colors group">
                        <td className="py-4 px-6 font-semibold text-gray-900">
                          {lead.name}
                        </td>
                        <td className="py-4 px-6 text-gray-600 font-mono text-xs">
                          {lead.email}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-800">
                          {lead.budget}
                        </td>
                        <td className="py-4 px-6">
                          {/* Inline Status Dropdown */}
                          <div className="relative inline-block">
                            <select
                              value={lead.status}
                              disabled={updatingId === lead.id}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] transition-all ${
                                lead.status === 'New'
                                  ? 'bg-[#F2F3FF] text-[#5F6FFF]'
                                  : lead.status === 'Contacted'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                            {updatingId === lead.id && (
                              <span className="absolute -right-6 top-1/2 -translate-y-1/2">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#5F6FFF]" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5F6FFF] hover:bg-[#F2F3FF] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden divide-y divide-gray-100">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{lead.name}</h4>
                        <p className="text-xs text-gray-500 font-mono">{lead.email}</p>
                      </div>
                      <Badge status={lead.status} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                      <span>Budget: <strong className="text-gray-900">{lead.budget}</strong></span>
                      <span className="text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 italic">
                      "{lead.message}"
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white"
                      >
                        <option value="New">Set status: New</option>
                        <option value="Contacted">Set status: Contacted</option>
                        <option value="Closed">Set status: Closed</option>
                      </select>

                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-xs font-bold text-[#5F6FFF] hover:underline"
                      >
                        Read Full Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination Footer */}
          {!loading && leads.length > 0 && (
            <div className="p-4 sm:px-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
              <div>
                Showing <span className="font-semibold text-gray-900">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-semibold text-gray-900">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-semibold text-gray-900">{pagination.total}</span> leads
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-semibold px-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </Card>
      </main>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F2F3FF] text-[#5F6FFF] flex items-center justify-center font-bold">
                {selectedLead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedLead.name}</h3>
                <p className="text-xs text-gray-500 font-mono">{selectedLead.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-gray-500 block mb-1">Budget Range</span>
                <span className="font-bold text-gray-900 text-sm">{selectedLead.budget}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Current Status</span>
                <Badge status={selectedLead.status} />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Project Details / Message:
              </span>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedLead.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Submitted {new Date(selectedLead.createdAt).toLocaleString()}
              </span>
              <Button variant="secondary" size="sm" onClick={() => setSelectedLead(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
};
