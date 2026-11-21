/**
 * FreelanceMatch — Earnings Page JavaScript
 * Handles charts, withdrawals, transaction history, and tax documents
 */

(function() {
  'use strict';

  // ============================================================
  // Mock Data
  // ============================================================
  const earningsData = [
    { month: 'Jan', gross: 8200, net: 7380, fee: 820 },
    { month: 'Feb', gross: 9100, net: 8190, fee: 910 },
    { month: 'Mar', gross: 10300, net: 9270, fee: 1030 },
    { month: 'Apr', gross: 11800, net: 10620, fee: 1180 },
    { month: 'May', gross: 12400, net: 11160, fee: 1240 },
    { month: 'Jun', gross: 13200, net: 11880, fee: 1320 },
    { month: 'Jul', gross: 11900, net: 10710, fee: 1190 },
    { month: 'Aug', gross: 12400, net: 11160, fee: 1240 },
    { month: 'Sep', gross: 13100, net: 11790, fee: 1310 },
    { month: 'Oct', gross: 12800, net: 11520, fee: 1280 },
    { month: 'Nov', gross: 11500, net: 10350, fee: 1150 },
    { month: 'Dec', gross: 12400, net: 11160, fee: 1240 }
  ];

  const transactions = [
    { date: '2025-01-15', description: 'Milestone 3 - Dashboard Redesign', client: 'TechCorp', type: 'earning', gross: 3200, fee: 320, net: 2880, status: 'completed' },
    { date: '2025-01-10', description: 'Platform Fee (10%)', client: 'FreelanceMatch', type: 'fee', gross: 320, fee: 0, net: -320, status: 'completed' },
    { date: '2025-01-08', description: 'Withdrawal to Bank', client: 'Chase Bank', type: 'withdrawal', gross: 5000, fee: 0, net: -5000, status: 'completed' },
    { date: '2025-01-05', description: 'Milestone 2 - API Integration', client: 'DataFlow Inc', type: 'earning', gross: 4800, fee: 480, net: 4320, status: 'completed' },
    { date: '2025-01-02', description: 'Platform Fee (10%)', client: 'FreelanceMatch', type: 'fee', gross: 480, fee: 0, net: -480, status: 'completed' },
    { date: '2024-12-28', description: 'Milestone 1 - Project Setup', client: 'ScaleUp Labs', type: 'earning', gross: 6000, fee: 600, net: 5400, status: 'completed' },
    { date: '2024-12-22', description: 'Platform Fee (10%)', client: 'FreelanceMatch', type: 'fee', gross: 600, fee: 0, net: -600, status: 'completed' },
    { date: '2024-12-20', description: 'Withdrawal to PayPal', client: 'PayPal', type: 'withdrawal', gross: 3000, fee: 30, net: -3030, status: 'completed' },
    { date: '2024-12-15', description: 'Milestone 4 - Testing & Launch', client: 'CloudNine', type: 'earning', gross: 5500, fee: 550, net: 4950, status: 'pending' },
    { date: '2024-12-10', description: 'Platform Fee (10%)', client: 'FreelanceMatch', type: 'fee', gross: 550, fee: 0, net: -550, status: 'pending' },
    { date: '2024-12-05', description: 'Milestone 2 - Backend API', client: 'NextGen AI', type: 'earning', gross: 7200, fee: 720, net: 6480, status: 'completed' },
    { date: '2024-11-28', description: 'Platform Fee (10%)', client: 'FreelanceMatch', type: 'fee', gross: 720, fee: 0, net: -720, status: 'completed' },
  ];

  // ============================================================
  // DOM Elements
  // ============================================================
  const chartContainer = document.getElementById('earnings-chart');
  const transactionsBody = document.getElementById('transactions-body');
  const periodFilter = document.getElementById('period-filter');
  const transactionFilter = document.getElementById('transaction-filter');
  const withdrawAmount = document.getElementById('withdraw-amount');
  const withdrawMax = document.getElementById('withdraw-max');
  const withdrawHalf = document.getElementById('withdraw-half');
  const withdrawMethod = document.getElementById('withdraw-method');
  const confirmWithdraw = document.getElementById('confirm-withdraw');

  // ============================================================
  // Chart Rendering (Simple SVG Bar Chart)
  // ============================================================
  function renderChart() {
    if (!chartContainer) return;

    const maxGross = Math.max(...earningsData.map(d => d.gross));
    const maxNet = Math.max(...earningsData.map(d => d.net));
    const chartHeight = 250;
    const barWidth = 32;
    const gap = 12;
    const chartWidth = earningsData.length * (barWidth + gap);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${chartWidth + 80} 280`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';

    // Y-axis grid lines and labels
    const maxValue = maxGross;
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const value = (maxValue / steps) * i;
      const y = 250 - (value / maxGross) * 220;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 60);
      line.setAttribute('y1', y);
      line.setAttribute('x2', chartWidth + 60);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'var(--color-border)');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', 50);
      label.setAttribute('y', y + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('font-size', '10');
      label.setAttribute('fill', 'var(--color-muted-foreground)');
      label.textContent = '$' + (value / 1000).toFixed(0) + 'k';
      svg.appendChild(label);
    }

    // Bars
    earningsData.forEach((data, i) => {
      const x = 60 + i * (barWidth + gap);
      const grossHeight = (data.gross / maxGross) * 220;
      const netHeight = (data.net / maxGross) * 220;
      const feeHeight = (data.fee / maxGross) * 220;
      const baseY = 250;

      // Gross bar (background)
      const grossBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      grossBar.setAttribute('x', 10 + i * (barWidth + gap));
      grossBar.setAttribute('y', 250 - grossHeight);
      grossBar.setAttribute('width', barWidth);
      grossBar.setAttribute('height', grossHeight);
      grossBar.setAttribute('fill', 'var(--color-primary)');
      grossBar.setAttribute('opacity', '0.3');
      grossBar.setAttribute('rx', '4');
      grossBar.setAttribute('ry', '4');
      svg.appendChild(grossBar);

      // Net bar
      const netBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      netBar.setAttribute('x', 10 + i * (barWidth + gap));
      netBar.setAttribute('y', 250 - netHeight);
      netBar.setAttribute('width', barWidth);
      netBar.setAttribute('height', netHeight);
      netBar.setAttribute('fill', 'var(--color-accent)');
      netBar.setAttribute('rx', '4');
      netBar.setAttribute('ry', '4');
      svg.appendChild(netBar);

      // Fee bar (on top)
      const feeBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      feeBar.setAttribute('x', 10 + i * (barWidth + gap));
      feeBar.setAttribute('y', 250 - grossHeight);
      feeBar.setAttribute('width', barWidth);
      feeBar.setAttribute('height', feeHeight);
      feeBar.setAttribute('fill', 'var(--color-warning)');
      feeBar.setAttribute('rx', '4');
      feeBar.setAttribute('ry', '4');
      svg.appendChild(feeBar);

      // Month label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', 26 + i * (barWidth + gap));
      label.setAttribute('y', 270);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '11');
      label.setAttribute('fill', 'var(--color-muted-foreground)');
      label.textContent = data.month;
      svg.appendChild(label);
    });

    // Clear and append
    chartContainer.innerHTML = '';
    chartContainer.appendChild(svg);
  }

  // ============================================================
  // Transaction Rendering
  // ============================================================
  function renderTransactions(filter = 'all') {
    if (!transactionsBody) return;

    let filtered = [...transactions];

    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    transactionsBody.innerHTML = filtered.map(t => `
      <tr>
        <td>${formatDate(t.date)}</td>
        <td>${escapeHtml(t.description)}</td>
        <td>${escapeHtml(t.client)}</td>
        <td><span class="transaction-type ${t.type}">${formatType(t.type)}</span></td>
        <td class="transaction-gross">${t.gross > 0 ? '+' : ''}$${formatNumber(t.gross)}</td>
        <td class="transaction-fee">${t.fee > 0 ? '-' : ''}$${formatNumber(t.fee)}</td>
        <td class="transaction-net">${t.net > 0 ? '+' : ''}$${formatNumber(t.net)}</td>
        <td><span class="badge ${getStatusBadgeClass(t.status)}">${formatStatus(t.status)}</span></td>
      </tr>
    `).join('');
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatNumber(num) {
    return Math.abs(num).toLocaleString();
  }

  function formatType(type) {
    const labels = { earning: 'Earning', withdrawal: 'Withdrawal', fee: 'Platform Fee' };
    return labels[type] || type;
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'completed': return 'badge-accent';
      case 'pending': return 'badge-warning';
      default: return 'badge-muted';
    }
  }

  function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  // ============================================================
  // Withdrawal Logic
  // ============================================================
  const AVAILABLE_BALANCE = 3100;

  function updateWithdrawButton() {
    const amount = parseFloat(withdrawAmount.value) || 0;
    const isValid = amount >= 10 && amount <= AVAILABLE_BALANCE;
    confirmWithdraw.disabled = !isValid;
    confirmWithdraw.textContent = `Withdraw $${amount.toFixed(2)}`;
    confirmWithdraw.querySelector('svg') && (confirmWithdraw.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      Withdraw $${amount.toFixed(2)}
    `);
  }

  // ============================================================
  // Event Listeners
  // ============================================================
  periodFilter.addEventListener('change', () => {
    renderChart();
    renderTransactions(transactionFilter.value);
  });

  transactionFilter.addEventListener('change', () => {
    renderTransactions(transactionFilter.value);
  });

  withdrawAmount.addEventListener('input', updateWithdrawButton);
  withdrawAmount.addEventListener('change', updateWithdrawButton);

  withdrawMax.addEventListener('click', () => {
    withdrawAmount.value = AVAILABLE_BALANCE.toFixed(2);
    updateWithdrawButton();
  });

  withdrawHalf.addEventListener('click', () => {
    withdrawAmount.value = (AVAILABLE_BALANCE / 2).toFixed(2);
    updateWithdrawButton();
  });

  confirmWithdraw.addEventListener('click', () => {
    const amount = parseFloat(withdrawAmount.value);
    if (amount >= 10 && amount <= AVAILABLE_BALANCE) {
      showToast(`Withdrawal of $${amount.toFixed(2)} initiated via ${withdrawMethod.options[withdrawMethod.selectedIndex].text}. Funds arrive in 2-3 business days.`);
      withdrawAmount.value = '';
      updateWithdrawButton();
    }
  });

  // ============================================================
  // Utility Functions
  // ============================================================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: var(--space-4);
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: var(--space-3) var(--space-6);
      box-shadow: var(--shadow-xl);
      z-index: var(--z-tooltip);
      font-size: var(--text-sm);
      opacity: 0;
      transition: all var(--transition-normal);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    renderChart();
    renderTransactions();
    updateWithdrawButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();