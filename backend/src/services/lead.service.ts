import { LeadRepository } from '../repositories/lead.repository';
import { ApiError } from '../utils/ApiError';
import { Lead, Prisma } from '@prisma/client';

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const validateUuid = (id: string) => {
  if (!UUID_REGEX.test(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }
};

export class LeadService {
  private leadRepository: LeadRepository;

  constructor() {
    this.leadRepository = new LeadRepository();
  }

  async createLead(userId: string, data: {
    name: string;
    company: string;
    email: string;
    phone: string;
    source: any;
    status: any;
    notes?: string | null;
  }) {
    const existing = await this.leadRepository.findActiveByEmailOrPhone(userId, data.email, data.phone);
    if (existing) {
      throw new ApiError(409, 'Lead already exists');
    }

    return this.leadRepository.create(userId, data);
  }

  async getLeads(userId: string, params: {
    page: number;
    limit: number;
    q?: string;
    status?: any;
    source?: any;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) {
    const { page, limit, q, status, source, sortBy, sortOrder } = params;

    const where: Prisma.LeadWhereInput = {
      createdBy: userId,
      deletedAt: null,
    };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { company: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (source) {
      where.source = source;
    }

    const total = await this.leadRepository.count(where);
    const totalPages = Math.ceil(total / limit) || 1;

    if (page > totalPages) {
      throw new ApiError(400, 'Page number exceeds total pages');
    }

    const skip = (page - 1) * limit;
    const items = await this.leadRepository.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      items,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async getLeadById(userId: string, id: string): Promise<Lead> {
    validateUuid(id);
    const lead = await this.leadRepository.findById(id);

    if (!lead || lead.deletedAt !== null || lead.createdBy !== userId) {
      throw new ApiError(404, 'Lead not found');
    }

    return lead;
  }

  async updateLead(userId: string, id: string, data: Partial<Omit<Lead, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>>) {
    validateUuid(id);
    const lead = await this.leadRepository.findById(id);

    if (!lead || lead.deletedAt !== null || lead.createdBy !== userId) {
      throw new ApiError(404, 'Lead not found');
    }

    if (data.email || data.phone) {
      const duplicate = await this.leadRepository.findActiveDuplicateExcept(
        userId,
        id,
        data.email || undefined,
        data.phone || undefined
      );
      if (duplicate) {
        throw new ApiError(409, 'Lead already exists');
      }
    }

    return this.leadRepository.update(id, data);
  }

  async deleteLead(userId: string, id: string): Promise<Lead> {
    validateUuid(id);
    const lead = await this.leadRepository.findById(id);

    if (!lead || lead.deletedAt !== null || lead.createdBy !== userId) {
      throw new ApiError(404, 'Lead not found');
    }

    return this.leadRepository.update(id, {
      deletedAt: new Date(),
    });
  }
}
