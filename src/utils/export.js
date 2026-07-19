/**
 * GumiGenk Journal — Export Utilities
 * PDF and file sharing export functions
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { tradesToCSV } from './storage';
import { formatPL, formatDate, formatPercent } from './formatters';
import { calculateStats } from './calculations';

/**
 * Generate PDF report of trades
 */
export const exportPDF = async (trades) => {
  const stats = calculateStats(trades);
  
  const tradesRows = trades.map(t => `
    <tr>
      <td>${formatDate(t.date, 'iso')}</td>
      <td>${t.instrument || '-'}</td>
      <td style="color: ${t.direction === 'BUY' ? '#16A34A' : '#DC2626'}">${t.direction || '-'}</td>
      <td>${t.entry || '-'}</td>
      <td>${t.exit || '-'}</td>
      <td>${t.lot || '-'}</td>
      <td style="color: ${(t.profitLoss || 0) >= 0 ? '#16A34A' : '#DC2626'}">${formatPL(t.profitLoss || 0)}</td>
      <td>${t.rrRatio ? t.rrRatio.toFixed(2) + 'R' : '-'}</td>
      <td>${t.strategy || '-'}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 24px; color: #1E293B; }
        h1 { color: #00897B; font-size: 24px; margin-bottom: 4px; }
        h2 { color: #64748B; font-size: 14px; font-weight: normal; margin-top: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
        .stat-card { background: #F1F5F9; border-radius: 8px; padding: 12px; text-align: center; }
        .stat-value { font-size: 18px; font-weight: bold; color: #00897B; }
        .stat-label { font-size: 11px; color: #64748B; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
        th { background: #00897B; color: white; padding: 8px 6px; text-align: left; }
        td { padding: 6px; border-bottom: 1px solid #E2E8F0; }
        tr:nth-child(even) { background: #F8FAFB; }
        .footer { margin-top: 30px; text-align: center; color: #94A3B8; font-size: 10px; }
      </style>
    </head>
    <body>
      <h1>GumiGenk Journal Report</h1>
      <h2>Generated: ${new Date().toLocaleDateString()}</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${formatPL(stats.netProfit)}</div>
          <div class="stat-label">Net Profit</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatPercent(stats.winRate)}</div>
          <div class="stat-label">Win Rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.profitFactor.toFixed(2)}</div>
          <div class="stat-label">Profit Factor</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalTrades}</div>
          <div class="stat-label">Total Trades</div>
        </div>
      </div>

      <table>
        <tr>
          <th>Date</th><th>Instrument</th><th>Dir</th><th>Entry</th>
          <th>Exit</th><th>Lot</th><th>P/L</th><th>RR</th><th>Strategy</th>
        </tr>
        ${tradesRows}
      </table>

      <div class="footer">
        GumiGenk Journal — Trade Smarter, Journal Better
      </div>
    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  }
};

/**
 * Export trades to CSV and share
 */
export const exportCSV = async (trades) => {
  try {
    const csvContent = tradesToCSV(trades);
    // For CSV export on React Native, we'll use expo-file-system + sharing
    // Since expo-print only does PDF, we create an HTML with download link
    const html = `
      <!DOCTYPE html>
      <html><head><style>body{font-family:monospace;white-space:pre;}</style></head>
      <body>${csvContent}</body></html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { mimeType: 'text/csv' });
    return true;
  } catch (error) {
    console.error('Failed to export CSV:', error);
    return false;
  }
};
