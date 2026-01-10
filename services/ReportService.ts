import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';

export interface ReportData {
  period: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  avgOrderValue: number;
  topWasher: { name: string; earnings: number };
  topService: { name: string; count: number };
  totalTips: number;
  platformFees: number;
  netRevenue: number;
}

class ReportService {
  // Generate daily report
  async generateDailyReport(): Promise<ReportData> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.generateReport(today, tomorrow, 'Daily');
  }

  // Generate weekly report
  async generateWeeklyReport(): Promise<ReportData> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    return this.generateReport(weekStart, today, 'Weekly');
  }

  // Generate monthly report
  async generateMonthlyReport(): Promise<ReportData> {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    return this.generateReport(monthStart, today, 'Monthly');
  }

  // Generate custom period report
  async generateCustomReport(startDate: Date, endDate: Date): Promise<ReportData> {
    return this.generateReport(startDate, endDate, 'Custom');
  }

  // Core report generation logic
  private async generateReport(startDate: Date, endDate: Date, period: string): Promise<ReportData> {
    try {
      // Get all orders in period
      const ordersQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<', Timestamp.fromDate(endDate))
      );

      const snapshot = await getDocs(ordersQuery);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

      // Calculate metrics
      let totalRevenue = 0;
      let completedOrders = 0;
      let cancelledOrders = 0;
      let totalTips = 0;
      let platformFees = 0;

      const washerEarnings: { [key: string]: { name: string; earnings: number } } = {};
      const serviceCount: { [key: string]: number } = {};

      orders.forEach(order => {
        if (order.status === 'Completed') {
          const revenue = order.price || 0;
          const tip = order.tip || 0;
          const fee = revenue * 0.15; // 15% platform fee

          totalRevenue += revenue;
          totalTips += tip;
          platformFees += fee;
          completedOrders++;

          // Track washer earnings
          if (order.washerId && order.washerName) {
            if (!washerEarnings[order.washerId]) {
              washerEarnings[order.washerId] = { name: order.washerName, earnings: 0 };
            }
            washerEarnings[order.washerId].earnings += revenue * 0.85; // 85% to washer
          }

          // Track service popularity - using service field
          const serviceName = order.service || 'Unknown';
          serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
        } else if (order.status === 'Cancelled') {
          cancelledOrders++;
        }
      });

      // Find top washer
      const topWasher = Object.values(washerEarnings).sort((a, b) => b.earnings - a.earnings)[0] || {
        name: 'N/A',
        earnings: 0
      };

      // Find top service
      const topServiceEntry = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0];
      const topService = topServiceEntry
        ? { name: topServiceEntry[0], count: topServiceEntry[1] }
        : { name: 'N/A', count: 0 };

      const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
      const netRevenue = totalRevenue - platformFees;

      return {
        period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalRevenue,
        totalOrders: orders.length,
        completedOrders,
        cancelledOrders,
        avgOrderValue,
        topWasher,
        topService,
        totalTips,
        platformFees,
        netRevenue
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  // Generate HTML email report
  generateEmailHTML(report: ReportData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #136dec 0%, #0a4cb0 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { padding: 30px; }
    .metric { background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
    .metric-label { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
    .metric-value { color: #111827; font-size: 32px; font-weight: bold; }
    .metric-sub { color: #9ca3af; font-size: 14px; margin-top: 5px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .highlight { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 ${report.period} Report</h1>
      <p>${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}</p>
    </div>
    
    <div class="content">
      <div class="metric highlight">
        <div class="metric-label">Total Revenue</div>
        <div class="metric-value">$${report.totalRevenue.toFixed(2)}</div>
        <div class="metric-sub">${report.completedOrders} completed orders</div>
      </div>
      
      <div class="grid">
        <div class="metric">
          <div class="metric-label">Total Orders</div>
          <div class="metric-value">${report.totalOrders}</div>
        </div>
        
        <div class="metric">
          <div class="metric-label">Avg Order Value</div>
          <div class="metric-value">$${report.avgOrderValue.toFixed(2)}</div>
        </div>
        
        <div class="metric">
          <div class="metric-label">Total Tips</div>
          <div class="metric-value">$${report.totalTips.toFixed(2)}</div>
        </div>
        
        <div class="metric">
          <div class="metric-label">Platform Fees</div>
          <div class="metric-value">$${report.platformFees.toFixed(2)}</div>
        </div>
      </div>
      
      <div class="metric">
        <div class="metric-label">Top Washer</div>
        <div class="metric-value" style="font-size: 24px;">${report.topWasher.name}</div>
        <div class="metric-sub">$${report.topWasher.earnings.toFixed(2)} earned</div>
      </div>
      
      <div class="metric">
        <div class="metric-label">Most Popular Service</div>
        <div class="metric-value" style="font-size: 24px;">${report.topService.name}</div>
        <div class="metric-sub">${report.topService.count} orders</div>
      </div>
      
      <div class="metric">
        <div class="metric-label">Net Revenue (After Fees)</div>
        <div class="metric-value" style="color: #10b981;">$${report.netRevenue.toFixed(2)}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Car Wash App - Automated Report</p>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  // Send report via email (would integrate with email service)
  async sendReportEmail(report: ReportData, recipients: string[]): Promise<void> {
    const html = this.generateEmailHTML(report);

    // This would integrate with your email service (SendGrid, etc.)
    console.log('Sending report to:', recipients);
    console.log('Report HTML generated');

    // Example: await emailService.send({ to: recipients, subject: `${report.period} Report`, html });
  }

  // Export report as CSV
  generateCSV(report: ReportData): string {
    const csv = [
      ['Metric', 'Value'],
      ['Period', report.period],
      ['Start Date', new Date(report.startDate).toLocaleDateString()],
      ['End Date', new Date(report.endDate).toLocaleDateString()],
      ['Total Revenue', `$${report.totalRevenue.toFixed(2)}`],
      ['Total Orders', report.totalOrders.toString()],
      ['Completed Orders', report.completedOrders.toString()],
      ['Cancelled Orders', report.cancelledOrders.toString()],
      ['Avg Order Value', `$${report.avgOrderValue.toFixed(2)}`],
      ['Total Tips', `$${report.totalTips.toFixed(2)}`],
      ['Platform Fees', `$${report.platformFees.toFixed(2)}`],
      ['Net Revenue', `$${report.netRevenue.toFixed(2)}`],
      ['Top Washer', report.topWasher.name],
      ['Top Washer Earnings', `$${report.topWasher.earnings.toFixed(2)}`],
      ['Top Service', report.topService.name],
      ['Top Service Count', report.topService.count.toString()]
    ];

    return csv.map(row => row.join(',')).join('\n');
  }

  // Download report as CSV
  downloadCSV(report: ReportData, filename?: string) {
    const csv = this.generateCSV(report);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `report_${report.period}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export const reportService = new ReportService();

