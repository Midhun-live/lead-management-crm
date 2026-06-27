'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Lead } from '../../../types';

const leadFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').transform((val) => val.replace(/\s+/g, ' ')),
  company: z.string().trim().min(1, 'Company is required').transform((val) => val.replace(/\s+/g, ' ')),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address').toLowerCase(),
  phone: z.string().trim().min(5, 'Phone must be at least 5 characters').max(20, 'Phone must be at most 20 characters'),
  source: z.enum(['WEBSITE', 'LINKEDIN', 'REFERRAL', 'EMAIL', 'PHONE', 'OTHER']),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST']),
  notes: z.string().trim().min(1, 'Notes cannot be empty').nullable().optional().or(z.literal('')),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormValues) => Promise<void>;
  lead?: Lead | null;
  isLoading: boolean;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lead,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      source: 'WEBSITE',
      status: 'NEW',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (lead) {
        reset({
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          source: lead.source,
          status: lead.status,
          notes: lead.notes || '',
        });
      } else {
        reset({
          name: '',
          company: '',
          email: '',
          phone: '',
          source: 'WEBSITE',
          status: 'NEW',
          notes: '',
        });
      }
    }
  }, [isOpen, lead, reset]);

  const sourceOptions = [
    { value: 'WEBSITE', label: 'Website' },
    { value: 'LINKEDIN', label: 'LinkedIn' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'PHONE', label: 'Phone' },
    { value: 'OTHER', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'WON', label: 'Won' },
    { value: 'LOST', label: 'Lost' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lead ? 'Edit Lead' : 'Create Lead'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter lead name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Company"
          placeholder="Enter company name"
          error={errors.company?.message}
          {...register('company')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone"
            placeholder="Enter phone number"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Source"
            options={sourceOptions}
            error={errors.source?.message}
            {...register('source')}
          />
          <Select
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>
        <div>
          <label htmlFor="notes-textarea" className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea
            id="notes-textarea"
            rows={3}
            placeholder="Additional information about the lead..."
            className={`block w-full px-3 py-2 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              errors.notes ? 'border-red-300' : ''
            }`}
            {...register('notes')}
          />
          {errors.notes && <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>}
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose} type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {lead ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LeadFormModal;
