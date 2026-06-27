import prisma from '../config/prisma';
import { Prisma, Lead } from '@prisma/client';

export class LeadRepository {
  async findById(id: string): Promise<Lead | null> {
    return prisma.lead.findUnique({
      where: { id },
    });
  }

  async findActiveByEmailOrPhone(userId: string, email: string, phone: string): Promise<Lead | null> {
    return prisma.lead.findFirst({
      where: {
        createdBy: userId,
        deletedAt: null,
        OR: [
          { email },
          { phone },
        ],
      },
    });
  }

  async findActiveDuplicateExcept(userId: string, id: string, email?: string, phone?: string): Promise<Lead | null> {
    if (!email && !phone) return null;

    const conditions: Prisma.LeadWhereInput[] = [];
    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });

    return prisma.lead.findFirst({
      where: {
        createdBy: userId,
        deletedAt: null,
        NOT: { id },
        OR: conditions,
      },
    });
  }

  async create(userId: string, data: Omit<Prisma.LeadCreateInput, 'user'>): Promise<Lead> {
    return prisma.lead.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async update(id: string, data: Prisma.LeadUpdateInput): Promise<Lead> {
    return prisma.lead.update({
      where: { id },
      data,
    });
  }

  async count(where: Prisma.LeadWhereInput): Promise<number> {
    return prisma.lead.count({ where });
  }

  async findMany(args: {
    where: Prisma.LeadWhereInput;
    skip: number;
    take: number;
    orderBy: Prisma.LeadOrderByWithRelationInput;
  }): Promise<Lead[]> {
    return prisma.lead.findMany(args);
  }
}
