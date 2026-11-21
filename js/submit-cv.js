/**
 * FreelanceMatch — Submit CV Form Logic
 * Multi-step form with validation, file upload, and skill tags
 */

(function() {
  'use strict';

  // ============================================================
  // State
  // ============================================================
  const state = {
    currentStep: 1,
    totalSteps: 4,
    skills: [],
    formData: {}
  };

  // ============================================================
  // DOM Elements
  // ============================================================
  const form = document.getElementById('cv-form');
  const steps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');

  // Skill elements
  const skillInput = document.getElementById('skill-input');
  const skillTags = document.getElementById('skill-tags');

  // File upload elements
  const fileUpload = document.getElementById('file-upload');
  const cvFile = document.getElementById('cv-file');
  const filePreview = document.getElementById('file-preview');

  // Modal elements
  const modalBackdrop = document.getElementById('success-modal-backdrop');
  const modal = document.getElementById('success-modal');
  const modalCloseBtns = modal?.querySelectorAll('.modal-close');

  // ============================================================
  // Step Navigation
  // ============================================================
  function showStep(step) {
    // Hide all steps
    steps.forEach(s => s.classList.remove('active'));
    progressSteps.forEach(p => p.classList.remove('active', 'completed'));

    // Show target step
    const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
    if (targetStep) {
      targetStep.classList.add('active');
    }

    // Update progress indicators
    progressSteps.forEach((p, i) => {
      const stepNum = i + 1;
      if (stepNum < step) {
        p.classList.add('completed');
        p.classList.remove('active');
      } else if (stepNum === step) {
        p.classList.add('active');
        p.classList.remove('completed');
      } else {
        p.classList.remove('active', 'completed');
      }
    });

    // Update buttons
    prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
    nextBtn.style.display = step < state.totalSteps ? 'inline-flex' : 'none';
    submitBtn.style.display = step === state.totalSteps ? 'inline-flex' : 'none';

    // Update aria-valuenow
    document.querySelector('.form-progress').setAttribute('aria-valuenow', step);

    // Scroll to form top
    const formEl = document.getElementById('cv-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    state.currentStep = step;
  }

  function nextStep() {
    if (validateStep(state.currentStep)) {
      showStep(state.currentStep + 1);
    }
  }

  function prevStep() {
    if (state.currentStep > 1) {
      showStep(state.currentStep - 1);
    }
  }

  // ============================================================
  // Validation
  // ============================================================
  function validateStep(step) {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!stepEl) return true;

    const requiredFields = stepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        showFieldError(field, 'This field is required');
        isValid = false;
      } else {
        clearFieldError(field);
      }

      // Email validation
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          showFieldError(field, 'Please enter a valid email address');
          isValid = false;
        }
      }

      // URL validation
      if (field.type === 'url' && field.value.trim()) {
        try {
          new URL(field.value.trim());
        } catch {
          showFieldError(field, 'Please enter a valid URL');
          isValid = false;
        }
      }
    });

    // Special validation for skills (step 3)
    if (step === 3 && state.skills.length < 3) {
      const skillInputWrapper = document.querySelector('.skill-input-wrapper');
      if (skillInputWrapper) {
        skillInputWrapper.classList.add('input-error');
        const errorMsg = skillInputWrapper.querySelector('.error-message') || document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Minimum 3 skills required';
        if (!skillInputWrapper.querySelector('.error-message')) {
          skillInputWrapper.appendChild(errorMsg);
        }
      }
      isValid = false;
    } else if (step === 3) {
      const skillInputWrapper = document.querySelector('.skill-input-wrapper');
      if (skillInputWrapper) {
        skillInputWrapper.classList.remove('input-error');
        const errorMsg = skillInputWrapper.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
      }
    }

    // Special validation for file upload (step 4)
    if (step === 4 && cvFile.files.length === 0) {
      fileUpload.classList.add('input-error');
      const errorMsg = fileUpload.querySelector('.error-message') || document.createElement('p');
      errorMsg.className = 'error-message';
      errorMsg.style.marginTop = 'var(--space-2)';
      errorMsg.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Please upload your CV';
      if (!fileUpload.querySelector('.error-message')) {
        fileUpload.appendChild(errorMsg);
      }
      isValid = false;
    } else if (step === 4) {
      fileUpload.classList.remove('input-error');
      const errorMsg = fileUpload.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    }

    // Terms checkbox
    if (step === 4) {
      const termsCheckbox = document.getElementById('terms');
      if (termsCheckbox && !termsCheckbox.checked) {
        termsCheckbox.parentElement.classList.add('input-error');
        isValid = false;
      } else if (termsCheckbox) {
        termsCheckbox.parentElement.classList.remove('input-error');
      }
    }

    // Focus first invalid field
    if (!isValid) {
      const firstInvalid = stepEl.querySelector('.input-error, [aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: true });
      }
    }

    return isValid;
  }

  function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('input-error');
    field.setAttribute('aria-invalid', 'true');

    const errorEl = document.createElement('p');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> ${message}`;
    field.parentElement.appendChild(errorEl);
  }

  function clearFieldError(field) {
    field.classList.remove('input-error');
    field.removeAttribute('aria-invalid');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) errorEl.remove();
  }

  // Real-time validation on blur
  function initRealTimeValidation() {
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.hasAttribute('required')) {
          if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
          } else {
            clearFieldError(field);
            if (field.type === 'email') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(field.value.trim())) {
                showFieldError(field, 'Please enter a valid email address');
              }
            }
          }
        }
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('input-error') && field.value.trim()) {
          clearFieldError(field);
        }
      });
    });
  }

  // ============================================================
  // Skill Tags
  // ============================================================
  function addSkill(skill) {
    skill = skill.trim();
    if (!skill) return false;
    if (state.skills.includes(skill.toLowerCase())) return false;
    if (state.skills.length >= 15) return false; // Max 15 skills

    state.skills.push(skill.toLowerCase());
    renderSkills();
    return true;
  }

  function removeSkill(skill) {
    state.skills = state.skills.filter(s => s !== skill);
    renderSkills();
  }

  function renderSkills() {
    skillTags.innerHTML = '';
    state.skills.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.setAttribute('role', 'listitem');
      tag.innerHTML = `
        ${escapeHtml(skill)}
        <button type="button" class="skill-tag-remove" aria-label="Remove ${escapeHtml(skill)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;
      tag.querySelector('.skill-tag-remove').addEventListener('click', () => removeSkill(skill));
      skillTags.appendChild(tag);
    });

    // Clear error if we have enough skills
    if (state.skills.length >= 3) {
      const skillInputWrapper = document.querySelector('.skill-input-wrapper');
      if (skillInputWrapper) {
        skillInputWrapper.classList.remove('input-error');
        const errorMsg = skillInputWrapper.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
      }
    }
  }

  function initSkillInput() {
    skillInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addSkill(skillInput.value);
        skillInput.value = '';
      }
    });

    skillInput.addEventListener('blur', () => {
      if (skillInput.value.trim()) {
        addSkill(skillInput.value);
        skillInput.value = '';
      }
    });
  }

  // ============================================================
  // File Upload
  // ============================================================
  function initFileUpload() {
    // Click to open
    fileUpload.addEventListener('click', () => cvFile.click());
    fileUpload.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cvFile.click();
      }
    });

    // Drag and drop
    ['dragenter', 'dragover'].forEach(event => {
      fileUpload.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUpload.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(event => {
      fileUpload.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileUpload.classList.remove('drag-over');
      });
    });

    fileUpload.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length) {
        handleFileSelect(files[0]);
      }
    });

    // File input change
    cvFile.addEventListener('change', () => {
      if (cvFile.files.length) {
        handleFileSelect(cvFile.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file.');
      cvFile.value = '';
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      cvFile.value = '';
      return;
    }

    // Show preview
    filePreview.style.display = 'block';
    filePreview.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <strong>${escapeHtml(file.name)}</strong>
      <span style="margin-left:auto;color:var(--color-muted-foreground);">${formatFileSize(file.size)}</span>
      <button type="button" style="margin-left:var(--space-2);color:var(--color-error);background:none;border:none;cursor:pointer;font-size:var(--text-xs);" onclick="this.closest('.file-preview').style.display='none';document.getElementById('cv-file').value='';">Remove</button>
    `;

    // Clear error
    fileUpload.classList.remove('input-error');
    const errorMsg = fileUpload.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // ============================================================
  // Form Submission
  // ============================================================
  function handleSubmit(e) {
    e.preventDefault();

    if (!validateStep(state.currentStep)) return;

    // Collect all form data
    const formData = new FormData(form);
    const data = {};

    // Basic fields
    formData.forEach((value, key) => {
      if (key !== 'cvFile' && key !== 'skills') {
        data[key] = value;
      }
    });

    data.skills = state.skills;
    data.hasCV = cvFile.files.length > 0;

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/></svg>
      Submitting...
    `;

    // Simulate API call
    setTimeout(() => {
      showSuccessModal();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        Submit Profile
      `;
    }, 1500);
  }

  // ============================================================
  // Success Modal
  // ============================================================
  function showSuccessModal() {
    modalBackdrop.classList.add('open');
    modal.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.modal-close').focus();

    // Trap focus
    trapFocus(modal);
  }

  function hideSuccessModal() {
    modalBackdrop.classList.remove('open');
    modal.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-hidden', 'true');
  }

  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function handleTab(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
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
  nextBtn.addEventListener('click', nextStep);
  prevBtn.addEventListener('click', prevStep);
  form.addEventListener('submit', handleSubmit);

  modalCloseBtns.forEach(btn => btn.addEventListener('click', hideSuccessModal));
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) hideSuccessModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      hideSuccessModal();
    }
  });

  // ============================================================
  // Initialize
  // ============================================================
  function init() {
    initRealTimeValidation();
    initSkillInput();
    initFileUpload();
    showStep(1);

    // Pre-fill demo data for testing (remove in production)
    if (window.location.search.includes('demo=true')) {
      document.getElementById('firstName').value = 'John';
      document.getElementById('lastName').value = 'Doe';
      document.getElementById('email').value = 'john@example.com';
      document.getElementById('location').value = 'San Francisco, CA';
      document.getElementById('title').value = 'Senior Full-Stack Developer';
      document.getElementById('availability').value = 'full-time';
      document.getElementById('yearsExperience').value = '5-8';
      document.getElementById('currentRole').value = 'Leading a team of 5 developers building scalable web applications using React, Node.js, and PostgreSQL. Improved API response times by 40%.';
      ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'].forEach(s => addSkill(s));
      document.getElementById('rateMin').value = '100';
      document.getElementById('rateMax').value = '175';
      document.getElementById('preferredIndustries').value = ['fintech', 'saas'];
      document.getElementById('remotePreference').value = 'fully-remote';
      document.getElementById('noticePeriod').value = '2-weeks';
    }
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Add spin animation for submit button
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin { animation: spin 1s linear infinite; }
`;
document.head.appendChild(style);