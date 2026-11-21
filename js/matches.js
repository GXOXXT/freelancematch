/**
 * FreelanceMatch — Matches Page JavaScript
 * Handles match rendering, filtering, sorting, and actions
 */

(function() {
  'use strict';

  // ============================================================
  // Mock Data - Extended Matches
  // ============================================================
  const allMatches = [
    {
      id: 1,
      company: 'TechCorp',
      role: 'Senior React Developer',
      avatar: 'TC',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      matchScore: 94,
      rate: '$120-150/hr',
      duration: '6+ months',
      location: 'Remote (US)',
      status: 'new',
      posted: '2 hours ago',
      description: 'Building next-gen dashboard for enterprise clients. Team of 8 engineers.'
    },
    {
      id: 2,
      company: 'DataFlow Inc',
      role: 'Full-Stack Engineer',
      avatar: 'DF',
      skills: ['Python', 'React', 'PostgreSQL', 'Docker', 'Kubernetes'],
      matchScore: 89,
      rate: '$100-130/hr',
      duration: '3-6 months',
      location: 'Hybrid (NYC)',
      status: 'new',
      posted: '5 hours ago',
      description: 'Data platform modernization. Work with 50TB+ datasets.'
    },
    {
      id: 3,
      company: 'ScaleUp Labs',
      role: 'Frontend Architect',
      avatar: 'SL',
      skills: ['Vue.js', 'TypeScript', 'GraphQL', 'AWS', 'Storybook'],
      matchScore: 91,
      rate: '$130-160/hr',
      duration: '12+ months',
      location: 'Remote',
      status: 'reviewed',
      posted: '1 day ago',
      description: 'Design system and frontend architecture for B2B SaaS platform.'
    },
    {
      id: 4,
      company: 'CloudNine',
      role: 'DevOps Engineer',
      avatar: 'CN',
      skills: ['Kubernetes', 'AWS', 'Terraform', 'Go', 'Prometheus'],
      matchScore: 87,
      rate: '$110-140/hr',
      duration: '6 months',
      location: 'Remote (EU)',
      status: 'new',
      posted: '3 hours ago',
      description: 'Infrastructure automation for fintech platform. 99.99% SLA.'
    },
    {
      id: 5,
      company: 'NextGen AI',
      role: 'ML Engineer',
      avatar: 'NG',
      skills: ['Python', 'PyTorch', 'MLOps', 'GCP', 'Kubeflow'],
      matchScore: 93,
      rate: '$140-180/hr',
      duration: 'Project-based',
      location: 'Remote',
      status: 'interested',
      posted: '6 hours ago',
      description: 'Production ML pipeline for recommendation engine. 10M+ daily users.'
    },
    {
      id: 6,
      company: 'FinTech Solutions',
      role: 'Backend Engineer',
      avatar: 'FS',
      skills: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Redis'],
      matchScore: 85,
      rate: '$100-125/hr',
      duration: '12 months',
      location: 'Hybrid (Chicago)',
      status: 'new',
      posted: '4 hours ago',
      description: 'High-throughput payment processing. 50K TPS target.'
    },
    {
      id: 7,
      company: 'HealthTech Innovations',
      role: 'Full-Stack Developer',
      avatar: 'HT',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'GraphQL'],
      matchScore: 88,
      rate: '$90-120/hr',
      duration: '6 months',
      location: 'Remote',
      status: 'new',
      posted: '1 day ago',
      description: 'Patient portal modernization. HIPAA compliance required.'
    },
    {
      id: 8,
      company: 'E-Commerce Plus',
      role: 'Senior Frontend Engineer',
      avatar: 'EC',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Testing Library'],
      matchScore: 90,
      rate: '$110-140/hr',
      duration: '9 months',
      location: 'Remote (US)',
      status: 'reviewed',
      posted: '2 days ago',
      description: 'Checkout optimization for 10M+ monthly transactions.'
    },
    {
      id: 9,
      company: 'CryptoVentures',
      role: 'Blockchain Developer',
      avatar: 'CV',
      skills: ['Solidity', 'Rust', 'TypeScript', 'Web3.js', 'Hardhat'],
      matchScore: 82,
      rate: '$130-170/hr',
      duration: 'Project-based',
      location: 'Remote',
      status: 'passed',
      posted: '3 days ago',
      description: 'DeFi protocol development. Audit-ready code required.'
    },
    {
      id: 10,
      company: 'EdTech Pioneers',
      role: 'Platform Engineer',
      avatar: 'EP',
      skills: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'Observability'],
      matchScore: 86,
      rate: '$105-135/hr',
      duration: '12+ months',
      location: 'Hybrid (Boston)',
      status: 'new',
      posted: '8 hours ago',
      description: 'Scaling learning platform to 5M+ students. Multi-region deployment.'
    },
    {
      id: 11,
      company: 'GameStudio X',
      role: 'Gameplay Engineer',
      avatar: 'GX',
      skills: ['Unity', 'C#', 'Multiplayer', 'WebGL', 'Performance'],
      matchScore: 78,
      rate: '$95-125/hr',
      duration: '6 months',
      location: 'On-site (LA)',
      status: 'passed',
      posted: '5 days ago',
      description: 'Cross-platform multiplayer systems. 100K+ concurrent players.'
    },
    {
      id: 12,
      company: 'AI Research Lab',
      role: 'Research Engineer',
      avatar: 'AR',
      skills: ['Python', 'PyTorch', 'Transformers', 'Distributed Training', 'CUDA'],
      matchScore: 95,
      rate: '$150-200/hr',
      duration: 'Project-based',
      location: 'Remote',
      status: 'interested',
      posted: '12 hours ago',
      description: 'Foundation model fine-tuning. Published papers a plus.'
    }
  ];

  // ============================================================
  // State
  // ============================================================
  const state = {
    matches: [...allMatches],
    filteredMatches: [...allMatches],
    sortBy: 'match',
    filterStatus: 'all',
    currentView: 'table'
  };

  // ============================================================
  // DOM Elements
  // ============================================================
  const tableBody = document.getElementById('matches-table-body');
  const cardsContainer = document.getElementById('matches-cards');
  const filterStatus = document.getElementById('filter-status');
  const filterSort = document.getElementById('filter-sort');
  const refreshBtn = document.getElementById('refresh-matches');

  // ============================================================
  // Render Functions
  // ============================================================
  function render() {
    applyFilters();
    applySort();
    renderTable();
    renderCards();
  }

  function applyFilters() {
    let filtered = [...allMatches];

    if (state.filterStatus !== 'all') {
      filtered = filtered.filter(m => m.status === state.filterStatus);
    }

    state.filteredMatches = filtered;
  }

  function applySort() {
    const { filteredMatches, sortBy } = state;

    switch (sortBy) {
      case 'match':
        filteredMatches.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'date':
        filteredMatches.sort((a, b) => new Date(b.posted) - new Date(a.posted));
        break;
      case 'rate':
        filteredMatches.sort((a, b) => {
          const aMax = parseInt(a.rate.match(/\d+/g)?.pop() || '0');
          const bMax = parseInt(b.rate.match(/\d+/g)?.pop() || '0');
          return bMax - aMax;
        });
        break;
    }
  }

  function renderTable() {
    if (!tableBody) return;

    tableBody.innerHTML = state.filteredMatches.map(match => `
      <tr data-match-id="${match.id}">
        <td>
          <div class="match-cell">
            <div class="match-cell-avatar" aria-hidden="true">${match.avatar}</div>
            <div class="match-cell-info">
              <div class="match-cell-title">${escapeHtml(match.role)}</div>
              <div class="match-cell-company">${escapeHtml(match.company)}</div>
            </div>
          </div>
        </td>
        <td>${escapeHtml(match.company)}</td>
        <td>${escapeHtml(match.role)}</td>
        <td>
          <div class="match-score">
            <div class="match-score-bar" role="progressbar" aria-valuenow="${match.matchScore}" aria-valuemin="0" aria-valuemax="100" aria-label="Match score">
              <div class="match-score-fill" style="width: ${match.matchScore}%"></div>
            </div>
            <span class="match-score-text">${match.matchScore}%</span>
          </div>
        </td>
        <td class="match-rate">${escapeHtml(match.rate)}</td>
        <td class="match-duration">${escapeHtml(match.duration)}</td>
        <td class="match-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${escapeHtml(match.location)}
        </td>
        <td>
          <span class="badge ${getStatusBadgeClass(match.status)}">${formatStatus(match.status)}</span>
        </td>
        <td class="match-posted">${escapeHtml(match.posted)}</td>
        <td>
          <div class="match-actions-cell">
            <button class="action-btn primary" data-action="view" data-match-id="${match.id}" aria-label="View ${escapeHtml(match.role)} details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            ${match.status === 'new' ? `
              <button class="action-btn accent" data-action="interested" data-match-id="${match.id}" aria-label="Mark as interested">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06a5.5 5.5 0 0 0 7.78 0l1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            ` : ''}
            <button class="action-btn danger" data-action="pass" data-match-id="${match.id}" aria-label="Pass on this match">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Add event listeners
    tableBody.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleMatchAction);
    });
  }

  function renderCards() {
    if (!cardsContainer) return;

    cardsContainer.innerHTML = state.filteredMatches.map(match => `
      <article class="match-card-full" data-match-id="${match.id}">
        <div class="match-card-header">
          <div class="match-card-avatar" aria-hidden="true">${match.avatar}</div>
          <div class="match-card-main">
            <h3 class="match-card-title">${escapeHtml(match.role)}</h3>
            <div class="match-card-company">${escapeHtml(match.company)}</div>
          </div>
          <span class="badge ${getStatusBadgeClass(match.status)}" style="margin-left:auto;align-self:flex-start;">${formatStatus(match.status)}</span>
        </div>
        <div class="match-card-meta">
          <span class="match-card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${match.matchScore}% match
          </span>
          <span class="match-card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            ${escapeHtml(match.rate)}
          </span>
          <span class="match-card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${escapeHtml(match.duration)}
          </span>
          <span class="match-card-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escapeHtml(match.location)}
          </span>
        </div>
        <div class="match-card-skills">
          ${match.skills.slice(0, 6).map(s => `<span class="badge badge-primary">${escapeHtml(s)}</span>`).join('')}
          ${match.skills.length > 6 ? `<span class="badge badge-muted">+${match.skills.length - 6}</span>` : ''}
        </div>
        <div class="match-card-actions">
          <button class="btn btn-primary btn-sm" data-action="view" data-match-id="${match.id}">View Details</button>
          ${match.status === 'new' ? `<button class="btn btn-accent btn-sm" data-action="interested" data-match-id="${match.id}">Interested</button>` : ''}
          <button class="btn btn-secondary btn-sm" data-action="pass" data-match-id="${match.id}">Pass</button>
        </div>
      </article>
    `).join('');

    // Add event listeners
    cardsContainer.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleMatchAction);
    });
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'new': return 'badge-primary';
      case 'interested': return 'badge-accent';
      case 'reviewed': return 'badge-primary';
      case 'passed': return 'badge-muted';
      default: return 'badge-muted';
    }
  }

  function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  // ============================================================
  // Event Handlers
  // ============================================================
  function handleMatchAction(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const matchId = parseInt(btn.dataset.matchId, 10);
    const match = allMatches.find(m => m.id === matchId);

    if (!match) return;

    switch (action) {
      case 'view':
        showMatchDetail(match);
        break;
      case 'interested':
        match.status = 'interested';
        render();
        showToast(`Interest sent to ${match.company}!`);
        break;
      case 'pass':
        match.status = 'passed';
        render();
        showToast('Match passed. We\'ll find you better ones!');
        break;
    }
  }

  function showMatchDetail(match) {
    // Create modal for match detail
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop open';
    modal.innerHTML = `
      <div class="modal open" style="max-width: 600px;" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div class="modal-header">
          <h2 id="detail-title" class="modal-title">${escapeHtml(match.role)}</h2>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display:flex;align-items:flex-start;gap:var(--space-4);margin-bottom:var(--space-6);">
            <div class="match-avatar" style="width:64px;height:64px;font-size:var(--text-2xl);" aria-hidden="true">${match.avatar}</div>
            <div>
              <h3 style="font-size:var(--text-xl);font-weight:var(--font-weight-bold);">${escapeHtml(match.role)}</h3>
              <p style="color:var(--color-muted-foreground);">${escapeHtml(match.company)}</p>
            </div>
          </div>
          <div style="margin-bottom:var(--space-4);">
            <span class="badge ${getStatusBadgeClass(match.status)}">${formatStatus(match.status)}</span>
            <span class="badge badge-primary" style="margin-left:var(--space-2);">${match.matchScore}% Match</span>
          </div>
          <p style="color:var(--color-muted-foreground);margin-bottom:var(--space-6);line-height:var(--line-height-relaxed);">${escapeHtml(match.description)}</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--space-4);margin-bottom:var(--space-6);padding:var(--space-4);background:var(--color-muted);border-radius:var(--radius-lg);">
            <div><div style="font-size:var(--text-xs);color:var(--color-muted-foreground);text-transform:uppercase;letter-spacing:0.05em;">Rate</div><div style="font-size:var(--text-lg);font-weight:var(--font-weight-bold);">${escapeHtml(match.rate)}</div></div>
            <div><div style="font-size:var(--text-xs);color:var(--color-muted-foreground);text-transform:uppercase;letter-spacing:0.05em;">Duration</div><div style="font-size:var(--text-lg);font-weight:var(--font-weight-bold);">${escapeHtml(match.duration)}</div></div>
            <div><div style="font-size:var(--text-xs);color:var(--color-muted-foreground);text-transform:uppercase;letter-spacing:0.05em;">Location</div><div style="font-size:var(--text-lg);font-weight:var(--font-weight-bold);">${escapeHtml(match.location)}</div></div>
            <div><div style="font-size:var(--text-xs);color:var(--color-muted-foreground);text-transform:uppercase;letter-spacing:0.05em;">Match Score</div><div style="font-size:var(--text-lg);font-weight:var(--font-weight-bold);color:var(--color-primary);">${match.matchScore}%</div></div>
          </div>
          <div style="margin-bottom:var(--space-6);">
            <div style="font-size:var(--text-sm);font-weight:var(--font-weight-semibold);margin-bottom:var(--space-2);">Required Skills</div>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
              ${match.skills.map(s => `<span class="badge badge-primary">${escapeHtml(s)}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          ${match.status === 'new' ? `<button class="btn btn-accent" data-action="interested" data-match-id="${match.id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06a5.5 5.5 0 0 0 7.78 0l1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> I'm Interested</button>` : ''}
          <button class="btn btn-primary" data-action="view" data-match-id="${match.id}">View Full Details</button>
          <button class="btn btn-secondary" data-action="pass" data-match-id="${match.id}">Pass</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Focus management
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.focus();

    // Event listeners
    modal.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        handleMatchAction({ currentTarget: btn });
        closeModal(modal);
      });
    });

    closeBtn.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    document.addEventListener('keydown', function handleEsc(e) {
      if (e.key === 'Escape') {
        closeModal(modal);
        document.removeEventListener('keydown', handleEsc);
      }
    });
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.querySelector('.modal-backdrop').classList.remove('open');
    setTimeout(() => modal.remove(), 200);
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
  // Filter & Sort
  // ============================================================
  filterStatus.addEventListener('change', () => {
    state.filterStatus = filterStatus.value;
    render();
  });

  filterSort.addEventListener('change', () => {
    state.sortBy = filterSort.value;
    render();
  });

  refreshBtn.addEventListener('click', () => {
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/></svg>
      Refreshing...
    `;

    setTimeout(() => {
      render();
      refreshBtn.disabled = false;
      refreshBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        Refresh
      `;
      showToast('Matches refreshed!');
    }, 1000);
  });

  // ============================================================
  // View Toggle (Table/Cards)
  // ============================================================
  function checkView() {
    if (window.innerWidth < 1024) {
      document.querySelector('.table-wrapper').style.display = 'none';
      cardsContainer.style.display = 'block';
    } else {
      document.querySelector('.table-wrapper').style.display = 'block';
      cardsContainer.style.display = 'none';
    }
  }

  window.addEventListener('resize', checkView);

  // ============================================================
  // Utility
  // ============================================================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    checkView();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();