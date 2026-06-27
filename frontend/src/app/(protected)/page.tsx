'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/api/axiosInstance';
import toast from 'react-hot-toast';
import { DashboardData } from '../../types';
import { Users, MailOpen, UserCheck, Award, ThumbsDown, Database } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axiosInstance.get('/dashboard');
        if (response.data && response.data.success) {
          setData(response.data.data);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your lead pipeline</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Leads',
      value: data?.totalLeads ?? 0,
      icon: Database,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    },
    {
      name: 'New',
      value: data?.statusCounts.NEW ?? 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      name: 'Contacted',
      value: data?.statusCounts.CONTACTED ?? 0,
      icon: MailOpen,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    },
    {
      name: 'Qualified',
      value: data?.statusCounts.QUALIFIED ?? 0,
      icon: UserCheck,
      color: 'bg-teal-50 text-teal-700 border-teal-100',
    },
    {
      name: 'Won',
      value: data?.statusCounts.WON ?? 0,
      icon: Award,
      color: 'bg-green-50 text-green-700 border-green-100',
    },
    {
      name: 'Lost',
      value: data?.statusCounts.LOST ?? 0,
      icon: ThumbsDown,
      color: 'bg-red-50 text-red-700 border-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your lead pipeline</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm p-6 flex items-center transition-all hover:shadow-md"
            >
              <div className={`p-3 rounded-lg border ${stat.color} mr-4`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</dd>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
