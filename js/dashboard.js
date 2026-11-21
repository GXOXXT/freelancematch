/**
 * FreelanceMatch — Dashboard JavaScript
 * Handles sidebar, notifications, match rendering, and interactions
 */

(function() {
  'use strict';

  // ============================================================
  // Mock Data
  // ============================================================
  const matches = [
    {
      id: 1,
      company: 'TechCorp',
      role: 'Senior React Developer',
      avatar: 'TC',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      matchScore: 94,
      rate: '$120-150/hr',
      duration: '6+ months',
      location: 'Remote (US)',
      status: 'new',
      posted: '2 hours ago'
    },
    {
      id: 2,
      company: 'DataFlow Inc',
      role: 'Full-Stack Engineer',
      avatar: 'DF',
      skills: ['Python', 'React', 'PostgreSQL', 'Docker'],
      matchScore: 89,
      rate: '$100-130/hr',
      duration: '3-6 months',
      location: 'Hybrid (NYC)',
      status: 'new',
      posted: '5 hours ago'
    },
    {
      id: 3,
      company: 'ScaleUp Labs',
      role: 'Frontend Architect',
      avatar: 'SL',
      skills: ['Vue.js', 'TypeScript', 'GraphQL', 'AWS'],
      matchScore: 91,
      rate: '$130-160/hr',
      duration: '12+ months',
      location: 'Remote',
      status: 'reviewed',
      posted: '1 day ago'
    },
    {
      id: 4,
      company: 'CloudNine',
      role: 'DevOps Engineer',
      avatar: 'CN',
      skills: ['Kubernetes', 'AWS', 'Terraform', 'Go'],
      matchScore: 87,
      rate: '$110-140/hr',
      duration: '6 months',
      location: 'Remote (EU)',
      status: 'new',
      posted: '3 hours ago'
    },
    {
      id: 5,
      company: 'NextGen AI',
      role: 'ML Engineer',
      avatar: 'NG',
      skills: ['Python', 'PyTorch', 'MLOps', 'GCP'],
      matchScore: 93,
      rate: '$140-180/hr',
      duration: 'Project-based',
      location: 'Remote',
      status: 'interested',
      posted: '6 hours ago'
    }
  ];

  const notifications = [
    { id: 1, type: 'match', title: 'New Match!', message: 'TechCorp matched with you for Senior React Developer', time: '2 hours ago', unread: true },
    { id: 2, type: 'offer', title: 'Offer Received', message: 'DataFlow Inc sent an offer for Full-Stack Engineer ($120/hr)', time: '5 hours ago', unread: true },
    { id: 3, type: 'match', title: 'High Match', message: '94% match with ScaleUp Labs for Frontend Architect', time: '1 day ago', unread: false },
    { id: 4, type: 'payment', title: 'Payment Released', message: '$3,200 released from escrow for CloudNine project', time: '2 days ago', unread: false },
    { id: 5, type: 'system', title: 'Profile Update', message: 'Your profile strength increased to 85%', time: '3 days ago', unread: false }
  ];

  // ============================================================
  // DOM Elements
  // ============================================================
  const matchesList = document.getElementById('matches-list');
  const notificationBell = document.getElementById('notification-bell');
  const notificationDropdown = document.getElementById('notification-dropdown');
  const notificationList = document.getElementById('notification-list');
  const notificationCount = document.getElementById('notification-count');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarToggle = document.createElement('button');
  const completionBar = document.getElementById('completion-bar');
  const completionPercent = document.getElementById('completion-percent');

  // ============================================================
  // Render Matches
  // ============================================================
  function renderMatches() {
    if (!matchesList) return;

    matchesList.innerHTML = matches.map(match => `
      <article class="match-card" data-match-id="${match.id}">
        <div class="match-badge">
          <span class="badge ${match.status === 'new' ? 'badge-primary' : match.status === 'interested' ? 'badge-accent' : 'badge-muted'}">${match.status === 'new' ? 'New' : match.status === 'interested' ? 'Interested' : 'Reviewed'}</span>
        </div>
        <div class="match-header">
          <div class="match-avatar" aria-hidden="true">${match.avatar}</div>
          <div class="match-info">
            <h3 class="match-name">${escapeHtml(match.role)}</h3>
            <div class="match-role">${escapeHtml(match.company)}</div>
          </div>
        </div>
        <div class="match-skills">
          ${match.skills.slice(0, 5).map(s => `<span class="badge badge-primary">${escapeHtml(s)}</span>`).join('')}
          ${match.skills.length > 5 ? `<span class="badge badge-muted">+${match.skills.length - 5} more</span>` : ''}
        </div>
        <div class="match-meta">
          <span class="match-meta-item" title="Match Score">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${match.matchScore}% match
          </span>
          <span class="match-meta-item" title="Rate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            ${escapeHtml(match.rate)}
          </span>
          <span class="match-meta-item" title="Duration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${escapeHtml(match.duration)}
          </span>
          <span class="match-meta-item" title="Location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escapeHtml(match.location)}
          </span>
        </div>
        <div class="match-actions">
          <button class="btn btn-primary btn-sm" data-action="view" data-match-id="${match.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View Details
          </button>
          ${match.status === 'new' ? `
            <button class="btn btn-accent btn-sm" data-action="interested" data-match-id="${match.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06a5.5 5.5 0 0 0 7.78 0l1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              Interested
            </button>
          ` : ''}
          <button class="btn btn-secondary btn-sm" data-action="pass" data-match-id="${match.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Pass
          </button>
        </div>
      </article>
    `).join('');

    // Add event listeners to match actions
    matchesList.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleMatchAction);
    });
  }

  function handleMatchAction(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const matchId = parseInt(btn.dataset.matchId, 10);
    const match = matches.find(m => m.id === matchId);

    if (!match) return;

    switch (action) {
      case 'view':
        alert(`View details for ${match.role} at ${match.company}`);
        // In real app: navigate to match detail page
        break;
      case 'interested':
        match.status = 'interested';
        btn.textContent = ' Interested';
        btn.className = 'btn btn-accent btn-sm';
        btn.dataset.action = 'view';
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> View Details`;
        showToast('Interest sent! The company will be notified.');
        break;
      case 'pass':
        // Remove from list with animation
        const card = btn.closest('.match-card');
        card.style.animation = 'slideUp 0.3s ease-in reverse';
        setTimeout(() => {
          card.remove();
          if (matchesList.children.length === 0) {
            matchesList.innerHTML = `
              <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <h3 class="empty-title">No More Matches</h3>
                <p class="empty-desc">Check back later for new opportunities.</p>
              </div>
            `;
          }
        }, 300);
        showToast('Match passed. We\'ll find you better ones!');
        break;
    }
  }

  // ============================================================
  // Notifications
  // ============================================================
  function renderNotifications() {
    if (!notificationList) return;

    const unreadCount = notifications.filter(n => n.unread).length;
    notificationCount.textContent = unreadCount;
    notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';

    notificationList.innerHTML = notifications.map(n => `
      <article class="notification-item ${n.unread ? 'unread' : ''}" data-notification-id="${n.id}" role="menuitem">
        <div class="notification-icon ${n.type}">
          ${getNotificationIcon(n.type)}
        </div>
        <div class="notification-content">
          <h4 class="notification-title">${escapeHtml(n.title)}</h4>
          <p class="notification-message">${escapeHtml(n.message)}</p>
        </div>
        <time class="notification-time" datetime="">${escapeHtml(n.time)}</time>
      </article>
    `).join('');

    // Add click handlers
    notificationList.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.notificationId, 10);
        markNotificationRead(id);
      });
    });
  }

  function getNotificationIcon(type) {
    switch (type) {
      case 'match':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
      case 'offer':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
      case 'payment':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';
      default:
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }
  }

  function markNotificationRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.unread) {
      notification.unread = false;
      renderNotifications();
    }
  }

  function toggleNotificationDropdown() {
    const isOpen = notificationDropdown.classList.toggle('open');
    notificationBell.setAttribute('aria-expanded', isOpen);
  }

  // ============================================================
  // Sidebar Mobile
  // ============================================================
  function initSidebar() {
    // Add toggle button for mobile
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.setAttribute('aria-label', 'Open sidebar');
    sidebarToggle.setAttribute('aria-controls', 'sidebar');
    sidebarToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
    document.body.appendChild(sidebarToggle);

    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarBackdrop.classList.toggle('open');
      sidebarBackdrop.setAttribute('aria-hidden', !sidebar.classList.contains('open'));
    });

    sidebarBackdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarBackdrop.classList.remove('open');
      sidebarBackdrop.setAttribute('aria-hidden', 'true');
    });

    // Close sidebar on link click (mobile)
    sidebar.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          sidebar.classList.remove('open');
          sidebarBackdrop.classList.remove('open');
          sidebarBackdrop.setAttribute('aria-hidden', 'true');
        }
      });
    });
  }

  // ============================================================
  // Profile Completion Animation
  // ============================================================
  function animateCompletion() {
    if (!completionBar || !completionPercent) return;

    const target = 85;
    let current = 0;
    const duration = 1000;
    const step = target / (duration / 16);

    function animate() {
      current += step;
      if (current >= target) {
        current = target;
        completionBar.style.width = current + '%';
        completionPercent.textContent = current + '%';
        return;
      }
      completionBar.style.width = current + '%';
      completionPercent.textContent = Math.round(current) + '%';
      requestAnimationFrame(animate);
    }

    // Start animation after a delay
    setTimeout(animate, 500);
  }

  // ============================================================
  // Toast Notifications
  // ============================================================
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
  // Utility
  // ============================================================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================
  // Event Listeners
  // ============================================================
  notificationBell.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNotificationDropdown();
  });

  document.addEventListener('click', (e) => {
    if (!notificationDropdown.contains(e.target) && !notificationBell.contains(e.target)) {
      notificationDropdown.classList.remove('open');
      notificationBell.setAttribute('aria-expanded', 'false');
    }
  });

  // Keyboard navigation for dropdown
  notificationBell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleNotificationDropdown();
    }
  });

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    renderMatches();
    renderNotifications();
    initSidebar();
    animateCompletion();

    // Close dropdown on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        notificationDropdown.classList.remove('open');
        notificationBell.setAttribute('aria-expanded', 'false');
        if (sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          sidebarBackdrop.classList.remove('open');
          sidebarBackdrop.setAttribute('aria-hidden', 'true');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();