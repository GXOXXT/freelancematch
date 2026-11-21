/**
 * FreelanceMatch — Profile Page JavaScript
 * Handles profile editing, avatar upload, and profile actions
 */

(function() {
  'use strict';

  // ============================================================
  // DOM Elements
  // ============================================================
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const changeAvatarBtn = document.getElementById('change-avatar-btn');
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const shareProfileBtn = document.getElementById('share-profile-btn');
  const profileAvatar = document.getElementById('profile-avatar');

  // ============================================================
  // Event Handlers
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

  function showEditModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop open';
    modal.innerHTML = `
      <div class="modal open" style="max-width: 600px;max-height:90vh;overflow-y:auto;" role="dialog" aria-modal="true" aria-labelledby="edit-title">
        <div class="modal-header">
          <h2 id="edit-title" class="modal-title">Edit Profile</h2>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="edit-profile-form">
            <div class="form-grid form-grid-2">
              <div>
                <label for="edit-firstName" class="label">First Name</label>
                <input type="text" id="edit-firstName" class="input" value="John">
              </div>
              <div>
                <label for="edit-lastName" class="label">Last Name</label>
                <input type="text" id="edit-lastName" class="input" value="Doe">
              </div>
            </div>
            <div class="mt-4">
              <label for="edit-email" class="label">Email</label>
              <input type="email" id="edit-email" class="input" value="john@example.com">
            </div>
            <div class="mt-4">
              <label for="edit-title" class="label">Professional Title</label>
              <input type="text" id="edit-title" class="input" value="Senior Full-Stack Developer">
            </div>
            <div class="mt-4">
              <label for="edit-location" class="label">Location</label>
              <input type="text" id="edit-location" class="input" value="San Francisco, CA">
            </div>
            <div class="form-grid form-grid-2 mt-4">
              <div>
                <label for="edit-rateMin" class="label">Min Rate (USD/hr)</label>
                <input type="number" id="edit-rateMin" class="input" value="120" min="10" max="500">
              </div>
              <div>
                <label for="edit-rateMax" class="label">Max Rate (USD/hr)</label>
                <input type="number" id="edit-rateMax" class="input" value="150" min="10" max="500">
              </div>
            </div>
            <div class="mt-4">
              <label for="edit-availability" class="label">Availability</label>
              <select id="edit-availability" class="input">
                <option value="full-time" selected>Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="project">Project-based</option>
              </select>
            </div>
            <div class="mt-4">
              <label for="edit-bio" class="label">Bio</label>
              <textarea id="edit-bio" class="input" rows="4">Senior Full-Stack Developer with 8+ years of experience building scalable web applications. Expert in React, Node.js, TypeScript, and cloud platforms (AWS/GCP). Proven track record of leading engineering teams, architecting microservices, and delivering high-impact products for fintech and SaaS companies.</textarea>
            </div>
            <div class="mt-4">
              <label for="edit-skills" class="label">Skills (comma-separated)</label>
              <input type="text" id="edit-skills" class="input" value="React, TypeScript, Node.js, AWS, PostgreSQL, Docker, GraphQL, Kubernetes">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close">Cancel</button>
          <button class="btn btn-primary" type="submit" form="edit-profile-form">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.focus();

    modal.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => closeModal(modal));
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Profile updated successfully!');
      closeModal(modal);
    });
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.querySelector('.modal-backdrop').classList.remove('open');
    setTimeout(() => modal.remove(), 200);
  }

  function handleAvatarClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profileAvatar.innerHTML = `<img src="${e.target.result}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
          showToast('Profile photo updated!');
        };
        reader.readAsDataURL(file);
      }
    });
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
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
  // Event Listeners
  // ============================================================
  document.getElementById('edit-profile-btn').addEventListener('click', showEditModal);
  document.getElementById('change-avatar-btn').addEventListener('click', handleAvatarClick);
  document.getElementById('profile-avatar').addEventListener('click', handleAvatarClick);

  document.getElementById('download-cv-btn').addEventListener('click', () => {
    showToast('Preparing CV download... (In real app, this would download the PDF)');
  });

  document.getElementById('share-profile-btn').addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'John Doe - Senior Full-Stack Developer',
        text: 'Check out my FreelanceMatch profile!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard!');
    }
  });

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    // Profile avatar click
    const avatar = document.getElementById('profile-avatar');
    avatar.style.cursor = 'pointer';
    avatar.title = 'Click to change photo';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();