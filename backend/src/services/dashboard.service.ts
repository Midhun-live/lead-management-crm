import { DashboardRepository } from '../repositories/dashboard.repository';
import { LeadStatus } from '@prisma/client';

export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getDashboardData(userId: string) {
    const groupResult = await this.dashboardRepository.getLeadCountsByStatus(userId);

    const statusCounts: Record<LeadStatus, number> = {
      [LeadStatus.NEW]: 0,
      [LeadStatus.CONTACTED]: 0,
      [LeadStatus.QUALIFIED]: 0,
      [LeadStatus.WON]: 0,
      [LeadStatus.LOST]: 0,
    };

    let totalLeads = 0;

    for (const row of groupResult) {
      const count = row._count._all;
      statusCounts[row.status] = count;
      totalLeads += count;
    }

    return {
      totalLeads,
      statusCounts,
    };
  }
}
