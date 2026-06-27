import prisma from '../config/prisma';

export class DashboardRepository {
  async getLeadCountsByStatus(userId: string) {
    return prisma.lead.groupBy({
      by: ['status'],
      where: {
        createdBy: userId,
        deletedAt: null,
      },
      _count: {
        _all: true,
      },
    });
  }
}
