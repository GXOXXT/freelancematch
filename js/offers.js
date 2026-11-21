/**
 * FreelanceMatch — Offers Page JavaScript
 * Handles offer rendering, acceptance, negotiation, and rejection
 */

(function() {
  'use strict';

  // ============================================================
  // Mock Data - Offers
  // ============================================================
  const offers = [
    {
      id: 1,
      company: 'TechCorp',
      role: 'Senior React Developer',
      avatar: 'TC',
      status: 'pending',
      rate: '$140/hr',
      duration: '6 months',
      location: 'Remote (US)',
      posted: '3 hours ago',
      expires: '5 days',
      description: 'We\'d love to have you join our team building the next-gen enterprise dashboard. Your React/TypeScript expertise is exactly what we need. The role involves leading a team of 4 engineers, architecting the frontend architecture, and working closely with product and design.',
      terms: {
        rate: '$140/hr',
        hours: '40/week',
        duration: '6 months (renewable)',
        payment: 'Net-15 via escrow',
        equipment: 'MacBook Pro provided',
        benefits: 'Health stipend, learning budget, 401k match'
      }
    },
    {
      id: 2,
      company: 'DataFlow Inc',
      role: 'Full-Stack Engineer',
      avatar: 'DF',
      status: 'pending',
      rate: '$120/hr',
      duration: '4 months',
      location: 'Hybrid (NYC)',
      posted: '1 day ago',
      expires: '3 days',
      description: 'Join our data platform team modernizing our analytics infrastructure. Work with 50TB+ datasets, build real-time dashboards, and optimize query performance. Strong Python/React background required.',
      terms: {
        rate: '$120/hr',
        hours: '30-40/week',
        duration: '4 months (extendable)',
        payment: 'Net-30 via escrow',
        equipment: 'Choice of laptop',
        benefits: 'Health insurance, gym stipend'
      }
    },
    {
      id: 3,
      company: 'ScaleUp Labs',
      role: 'Frontend Architect',
      avatar: 'SL',
      status: 'pending',
      rate: '$150/hr',
      duration: '12 months',
      location: 'Remote',
      posted: '6 hours ago',
      expires: '7 days',
      description: 'Lead the frontend architecture for our B2B SaaS platform. Design system ownership, micro-frontend strategy, and team mentorship. Vue.js/TypeScript expertise essential. High autonomy role.',
      terms: {
        rate: '$150/hr',
        hours: '40/week',
        duration: '12 months (renewable)',
        payment: 'Net-15 via escrow',
        equipment: 'Top-tier MacBook Pro + monitor budget',
        benefits: 'Equity package, health, learning budget, conference travel'
      }
    }
  ];

  // ============================================================
  // DOM Elements
  // ============================================================
  const offersGrid = document.getElementById('offers-grid');
  const offersEmpty = document.getElementById('offers-empty');

  // ============================================================
  // Render Functions
  // ============================================================
  function render() {
    if (!offersGrid) return;

    if (offers.length === 0) {
      offersGrid.style.display = 'none';
      offersEmpty.style.display = 'block';
      return;
    }

    offersGrid.style.display = 'grid';
    offersEmpty.style.display = 'none';

    offersGrid.innerHTML = offers.map(offer => `
      <article class="offer-card card" data-offer-id="${offer.id}" role="listitem">
        <div class="offer-header">
          <div class="offer-company-badge">
            <div class="offer-avatar" aria-hidden="true">${offer.avatar}</div>
            <div>
              <h3 class="offer-title">${escapeHtml(offer.role)}</h3>
              <p class="offer-company">${escapeHtml(offer.company)}</p>
            </div>
          </div>
          <span class="badge badge-accent offer-status-badge">${formatStatus(offer.status)}</span>
        </div>

        <div class="offer-details">
          <div class="offer-detail">
            <div class="offer-detail-label">Rate</div>
            <div class="offer-detail-value rate">${escapeHtml(offer.rate)}</div>
          </div>
          <div class="offer-detail">
            <div class="offer-detail-label">Duration</div>
            <div class="offer-detail-value duration">${escapeHtml(offer.duration)}</div>
          </div>
          <div class="offer-detail">
            <div class="offer-detail-label">Location</div>
            <div class="offer-detail-value">${escapeHtml(offer.location)}</div>
          </div>
          <div class="offer-detail">
            <div class="offer-detail-label">Expires</div>
            <div class="offer-detail-value" style="color:var(--color-warning);">${escapeHtml(offer.expires)}</div>
          </div>
        </div>

        <div class="offer-meta">
          <span class="offer-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escapeHtml(offer.location)}
          </span>
          <span class="offer-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Posted ${escapeHtml(offer.posted)}
          </span>
          <span class="offer-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <strong>${escapeHtml(offer.terms.rate)}</strong>
          </span>
        </div>

        <p class="offer-description">${escapeHtml(offer.description)}</p>

        <div class="offer-actions">
          <button class="btn btn-primary" data-action="view-terms" data-offer-id="${offer.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            View Terms
          </button>
          <button class="btn btn-secondary" data-action="negotiate" data-offer-id="${offer.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Negotiate
          </button>
          <button class="btn btn-accent" data-action="accept" data-offer-id="${offer.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            Accept Offer
          </button>
        </div>
      </article>
    `).join('');

    // Add event listeners
    offersGrid.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleOfferAction);
    });
  }

  function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  // ============================================================
  // Event Handlers
  // ============================================================
  function handleOfferAction(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const offerId = parseInt(btn.dataset.offerId, 10);
    const offer = offers.find(o => o.id === offerId);

    if (!offer) return;

    switch (action) {
      case 'view-terms':
        showTermsModal(offer);
        break;
      case 'negotiate':
        showNegotiationModal(offer);
        break;
      case 'accept':
        showAcceptModal(offer);
        break;
    }
  }

  function showTermsModal(offer) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop open';
    modal.innerHTML = `
      <div class="modal open" style="max-width: 600px;max-height:90vh;overflow-y:auto;" role="dialog" aria-modal="true" aria-labelledby="terms-title">
        <div class="modal-header">
          <h2 id="terms-title" class="modal-title">Offer Terms — ${escapeHtml(offer.role)} at ${escapeHtml(offer.company)}</h2>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom:var(--space-6);">
            <div style="display:flex;align-items:flex-start;gap:var(--space-4);margin-bottom:var(--space-6);">
              <div class="match-avatar" style="width:64px;height:64px;font-size:var(--text-2xl);" aria-hidden="true">${offer.avatar}</div>
              <div>
                <h3 style="font-size:var(--text-xl);font-weight:var(--font-weight-bold);">${escapeHtml(offer.role)}</h3>
                <p style="color:var(--color-muted-foreground);">${escapeHtml(offer.company)}</p>
              </div>
            </div>

            <div style="margin-bottom:var(--space-6);">
              <span class="badge badge-accent">${formatStatus(offer.status)}</span>
            </div>

            <p style="color:var(--color-muted-foreground);margin-bottom:var(--space-6);line-height:var(--line-height-relaxed);">${escapeHtml(offer.description)}</p>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--space-4);margin-bottom:var(--space-6);">
            <div class="offer-detail">
              <div class="offer-detail-label">Rate</div>
              <div class="offer-detail-value rate">${escapeHtml(offer.terms.rate)}</div>
            </div>
            <div class="offer-detail">
              <div class="offer-detail-label">Hours/Week</div>
              <div class="offer-detail-value">${escapeHtml(offer.terms.hours)}</div>
            </div>
            <div class="offer-detail">
              <div class="offer-detail-label">Duration</div>
              <div class="offer-detail-value duration">${escapeHtml(offer.terms.duration)}</div>
            </div>
            <div class="offer-detail">
              <div class="offer-detail-label">Payment</div>
              <div class="offer-detail-value">${escapeHtml(offer.terms.payment)}</div>
            </div>
            <div class="offer-detail">
              <div class="offer-detail-label">Equipment</div>
              <div class="offer-detail-value">${escapeHtml(offer.terms.equipment)}</div>
            </div>
            <div class="offer-detail">
              <div class="offer-detail-label">Benefits</div>
              <div class="offer-detail-value" style="font-size:var(--text-sm);">${escapeHtml(offer.terms.benefits)}</div>
            </div>
          </div>

          <div style="padding:var(--space-4);background:var(--color-primary-light);border-radius:var(--radius-lg);border-left:3px solid var(--color-primary);">
            <div style="font-size:var(--text-sm);font-weight:var(--font-weight-semibold);color:var(--color-primary);margin-bottom:var(--space-2);">Important Notes</div>
            <ul style="font-size:var(--text-sm);color:var(--color-primary);line-height:2;padding-left:var(--space-5);">
              <li>All payments held in escrow until milestone delivery</li>
              <li>Either party can terminate with 2 weeks notice</li>
              <li>IP ownership transfers upon full payment</li>
              <li>FreelanceMatch takes 10% platform fee</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-action="negotiate" data-offer-id="${offer.id}">Negotiate</button>
          <button class="btn btn-accent" data-action="accept" data-offer-id="${offer.id}">Accept Offer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.focus();

    modal.querySelectorAll('[data-action]').forEach(b => {
      b.addEventListener('click', (e) => {
        handleOfferAction({ currentTarget: e.currentTarget });
        closeModal(modal);
      });
    });

    closeBtn.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  }

  function showNegotiationModal(offer) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop open';
    modal.innerHTML = `
      <div class="modal open" style="max-width: 520px;" role="dialog" aria-modal="true" aria-labelledby="negotiate-title">
        <div class="modal-header">
          <h2 id="negotiate-title" class="modal-title">Negotiate Offer</h2>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <p style="color:var(--color-muted-foreground);margin-bottom:var(--space-6);">Propose new terms for ${escapeHtml(offer.role)} at ${escapeHtml(offer.company)}. They'll have 48 hours to respond.</p>
          <form class="negotiation-form" id="negotiation-form">
            <div class="negotiation-field">
              <label for="negotiate-rate">Proposed Rate (USD/hr)</label>
              <input type="number" id="negotiate-rate" name="rate" min="10" max="500" step="5" value="${parseInt(offer.terms.rate)}" required>
            </div>
            <div class="negotiation-field">
              <label for="negotiate-duration">Proposed Duration</label>
              <select id="negotiate-duration" name="duration" required>
                <option value="">Select duration</option>
                <option value="3 months">3 months</option>
                <option value="6 months" ${offer.terms.duration.includes('6') ? 'selected' : ''}>6 months</option>
                <option value="9 months">9 months</option>
                <option value="12 months" ${offer.terms.duration.includes('12') ? 'selected' : ''}>12 months</option>
                <option value="Project-based">Project-based</option>
              </select>
            </div>
            <div class="negotiation-field">
              <label for="negotiate-hours">Hours per Week</label>
              <input type="number" id="negotiate-hours" name="hours" min="5" max="40" step="5" value="${parseInt(offer.terms.hours) || 40}" required>
            </div>
            <div class="negotiation-field">
              <label for="negotiate-message">Message to Client (optional)</label>
              <textarea id="negotiate-message" name="message" rows="3" placeholder="Explain your reasoning for the proposed changes..."></textarea>
            </div>
            <div class="negotiation-note">
              <strong>Note:</strong> The client has 48 hours to accept, counter, or decline. You can withdraw your proposal anytime before they respond.
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" class="modal-close">Cancel</button>
          <button class="btn btn-accent" type="submit" form="negotiation-form">Send Proposal</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.focus();

    modal.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => closeModal(modal)));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });

    // Form submission
    const form = modal.querySelector('#negotiation-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      showToast(`Negotiation proposal sent to ${offer.company}! They have 48 hours to respond.`);
      closeModal(modal);
    });
  }

  function showAcceptModal(offer) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop open';
    modal.innerHTML = `
      <div class="modal open" style="max-width: 520px;" role="dialog" aria-modal="true" aria-labelledby="accept-title">
        <div class="modal-header">
          <h2 id="accept-title" class="modal-title">Accept Offer?</h2>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body text-center">
          <div style="width:80px;height:80px;margin:0 auto var(--space-6);background:var(--color-accent-light);border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 style="font-size:var(--text-xl);font-weight:var(--font-weight-bold);margin-bottom:var(--space-2);">Accept ${escapeHtml(offer.role)}?</h3>
          <p style="color:var(--color-muted-foreground);margin-bottom:var(--space-4);">You're about to accept the offer from <strong>${escapeHtml(offer.company)}</strong> at <strong>${escapeHtml(offer.terms.rate)}</strong> for <strong>${escapeHtml(offer.terms.duration)}</strong>.</p>
          <p style="font-size:var(--text-sm);color:var(--color-muted-foreground);margin-bottom:var(--space-6);">Funds will be held in escrow. FreelanceMatch takes a 10% platform fee ($${(parseInt(offer.terms.rate) * 0.1).toFixed(2)}/hr).</p>
          <label style="display:flex;align-items:center;justify-content:center;gap:var(--space-2);font-size:var(--text-sm);color:var(--color-muted-foreground);cursor:pointer;">
            <input type="checkbox" id="accept-terms" required style="accent-color:var(--color-accent);"> I agree to the <a href="#" style="color:var(--color-primary);">Terms of Service</a> and <a href="#" style="color:var(--color-primary);">Escrow Agreement</a>
          </label>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close">Cancel</button>
          <button class="btn btn-accent" id="confirm-accept" disabled>Accept Offer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const acceptCheckbox = modal.querySelector('#accept-terms');
    const confirmBtn = modal.querySelector('#confirm-accept');
    const closeBtn = modal.querySelector('.modal-close');

    closeBtn.focus();

    acceptCheckbox.addEventListener('change', () => {
      confirmBtn.disabled = !acceptCheckbox.checked;
    });

    confirmBtn.addEventListener('click', () => {
      showToast(`Offer accepted! Welcome to the team at ${offer.company}!`);
      closeModal(modal);
      // In real app: update offer status, navigate to contract
    });

    closeBtn.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
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
  // Utility
  // ============================================================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.querySelector('.modal-backdrop').classList.remove('open');
    setTimeout(() => modal.remove(), 200);
  }

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();