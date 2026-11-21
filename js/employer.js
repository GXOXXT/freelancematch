/**
 * FreelanceMatch — Employer Dashboard JavaScript
 * Handles candidate rendering, job management, and pipeline interactions
 */

(function() {
  'use strict';

  // ============================================================
  // Mock Data
  // ============================================================
  const candidates = [
    {
      id: 1,
      name: 'Alex Chen',
      role: 'Senior React Developer',
      avatar: 'AC',
      matchScore: 94,
      skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      rate: '$140/hr',
      availability: 'Full-time',
      location: 'Remote (US)',
      applied: '2 hours ago',
      status: 'new'
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      role: 'Full-Stack Engineer',
      avatar: 'MR',
      matchScore: 89,
      skills: ['Python', 'React', 'PostgreSQL', 'Docker'],
      rate: '$120/hr',
      availability: 'Full-time',
      location: 'Hybrid (NYC)',
      applied: '5 hours ago',
      status: 'new'
    },
    {
      id: 3,
      name: 'James Park',
      role: 'Frontend Architect',
      avatar: 'JP',
      matchScore: 91,
      skills: ['Vue.js', 'TypeScript', 'GraphQL', 'AWS'],
      rate: '$150/hr',
      availability: 'Contract',
      location: 'Remote',
      applied: '1 day ago',
      status: 'reviewed'
    },
    {
      id: 4,
      name: 'Priya Sharma',
      role: 'DevOps Engineer',
      avatar: 'PS',
      matchScore: 87,
      skills: ['Kubernetes', 'AWS', 'Terraform', 'Go'],
      rate: '$130/hr',
      availability: 'Full-time',
      location: 'Remote (EU)',
      applied: '3 hours ago',
      status: 'new'
    },
    {
      id: 5,
      name: 'David Kim',
      role: 'ML Engineer',
      avatar: 'DK',
      matchScore: 93,
      skills: ['Python', 'PyTorch', 'MLOps', 'GCP'],
      rate: '$160/hr',
      availability: 'Project-based',
      location: 'Remote',
      applied: '6 hours ago',
      status: 'interested'
    },
    {
      id: 6,
      name: 'Sarah Johnson',
      role: 'Backend Engineer',
      avatar: 'SJ',
      matchScore: 85,
      skills: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL'],
      rate: '$110/hr',
      availability: 'Full-time',
      location: 'Hybrid (Chicago)',
      applied: '4 hours ago',
      status: 'new'
    }
  ];

  // ============================================================
  // DOM Elements
  // ============================================================
  const candidatesList = document.getElementById('candidates-list');
  const jobsList = document.getElementById('jobs-list');

  // ============================================================
  // Render Functions
  // ============================================================
  function renderCandidates() {
    if (!candidatesList) return;

    candidatesList.innerHTML = candidates.map(candidate => `
      <article class="candidate-card" data-candidate-id="${candidate.id}">
        <div class="candidate-header">
          <div class="candidate-avatar" aria-hidden="true">${candidate.avatar}</div>
          <div class="candidate-info">
            <h3 class="candidate-name">${escapeHtml(candidate.name)}</h3>
            <div class="candidate-role">${escapeHtml(candidate.role)}</div>
          </div>
          <span class="candidate-match">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${candidate.matchScore}% Match
          </span>
        </div>
        <div class="candidate-skills">
          ${candidate.skills.slice(0, 5).map(s => `<span class="badge badge-primary">${escapeHtml(s)}</span>`).join('')}
          ${candidate.skills.length > 5 ? `<span class="badge badge-muted">+${candidate.skills.length - 5}</span>` : ''}
        </div>
        <div class="candidate-meta">
          <span class="match-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            ${escapeHtml(candidate.rate)}
          </span>
          <span class="match-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${escapeHtml(candidate.availability)}
          </span>
          <span class="match-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escapeHtml(candidate.location)}
          </span>
        </div>
        <div class="candidate-actions">
          <button class="btn btn-primary btn-sm" data-action="view-profile" data-candidate-id="${candidate.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View Profile
          </button>
          <button class="btn btn-accent btn-sm" data-action="invite-interview" data-candidate-id="${candidate.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Invite
          </button>
          <button class="btn btn-secondary btn-sm" data-action="save-candidate" data-candidate-id="${candidate.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21l-7-7-7 7"/><path d="M12 16v-8"/></svg>
            Save
          </button>
        </div>
      </article>
    `).join('');

    // Add event listeners
    candidatesList.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleCandidateAction);
    });
  }

  function handleCandidateAction(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const candidateId = parseInt(btn.dataset.candidateId, 10);
    const candidate = candidates.find(c => c.id === candidateId);

    if (!candidate) return;

    switch (action) {
      case 'view-profile':
        showToast(`Viewing ${candidate.name}'s full profile...`);
        break;
      case 'invite-interview':
        showToast(`Interview invitation sent to ${candidate.name}!`);
        btn.disabled = true;
        btn.textContent = ' Invited';
        break;
      case 'save-candidate':
        showToast(`${candidate.name} saved to your talent pool.`);
        break;
    }
  }

  // ============================================================
  // Utility
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
    renderCandidates();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();