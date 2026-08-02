/**
 * ==============================================================================
 * FMCK MultiPurpose Cooperative Society - Registration Portal Script
 * Federal Medical Center, Kumo (FMCK)
 * ==============================================================================
 */

// Configuration: Replace with your deployed Google Apps Script Web App URL if using web submissions
const APPS_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"; 

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const coopForm = document.getElementById('coopForm');
  const previewBtn = document.getElementById('previewBtn');
  const resetBtn = document.getElementById('resetBtn');
  const previewModal = document.getElementById('previewModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const editModalBtn = document.getElementById('editModalBtn');
  const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
  const modalPreviewContent = document.getElementById('modalPreviewContent');
  const toastContainer = document.getElementById('toastContainer');

  // Input Fields
  const fullName = document.getElementById('fullName');
  const staffId = document.getElementById('staffId');
  const department = document.getElementById('department');
  const unit = document.getElementById('unit');
  const ippisNo = document.getElementById('ippisNo');
  const phoneNo = document.getElementById('phoneNo');
  const monthlySavings = document.getElementById('monthlySavings');
  const nextOfKin = document.getElementById('nextOfKin');
  const declaration = document.getElementById('declaration');

  // Auto-restore saved draft if available
  loadDraft();

  // Input Listeners for Auto-Save
  [fullName, staffId, department, unit, ippisNo, phoneNo, monthlySavings, nextOfKin].forEach(input => {
    input.addEventListener('input', saveDraft);
  });

  // Preview Button Click Handler
  previewBtn.addEventListener('click', () => {
    if (validateForm()) {
      populatePreviewModal();
      openModal();
    }
  });

  // Reset Button
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all form fields?')) {
      coopForm.reset();
      localStorage.removeItem('fmck_coop_draft');
      showToast('Form cleared successfully.', 'info');
    }
  });

  // Modal Controls
  closeModalBtn.addEventListener('click', closeModal);
  editModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside card
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) closeModal();
  });

  // Final Submit Handler
  confirmSubmitBtn.addEventListener('click', async () => {
    await handleSubmit();
  });

  /**
   * Validates all 9 form inputs
   */
  function validateForm() {
    let isValid = true;
    let firstErrorInput = null;

    // Reset styles
    document.querySelectorAll('.input-control').forEach(el => el.style.borderColor = '#d1d5db');

    // 1. NAME
    if (!fullName.value.trim()) {
      markError(fullName, 'Please enter your full name');
      if (!firstErrorInput) firstErrorInput = fullName;
      isValid = false;
    }

    // 2. Staff ID
    if (!staffId.value.trim()) {
      markError(staffId, 'Please enter your Staff ID / File No.');
      if (!firstErrorInput) firstErrorInput = staffId;
      isValid = false;
    }

    // 3. DEPARTMENT
    if (!department.value.trim()) {
      markError(department, 'Please enter your Department');
      if (!firstErrorInput) firstErrorInput = department;
      isValid = false;
    }

    // 4. Unit
    if (!unit.value.trim()) {
      markError(unit, 'Please enter your Unit');
      if (!firstErrorInput) firstErrorInput = unit;
      isValid = false;
    }

    // 5. IPPIS NO.
    if (!ippisNo.value.trim()) {
      markError(ippisNo, 'Please enter your IPPIS Number');
      if (!firstErrorInput) firstErrorInput = ippisNo;
      isValid = false;
    }

    // 6. PHONE NO.
    if (!phoneNo.value.trim()) {
      markError(phoneNo, 'Please enter a valid Phone Number');
      if (!firstErrorInput) firstErrorInput = phoneNo;
      isValid = false;
    }

    // 7. MONTHLY SAVINGS
    if (!monthlySavings.value || parseFloat(monthlySavings.value) <= 0) {
      markError(monthlySavings, 'Please enter a valid Monthly Savings amount');
      if (!firstErrorInput) firstErrorInput = monthlySavings;
      isValid = false;
    }

    // 8. Next of Kin
    if (!nextOfKin.value.trim()) {
      markError(nextOfKin, 'Please enter Next of Kin details');
      if (!firstErrorInput) firstErrorInput = nextOfKin;
      isValid = false;
    }

    // 9. Declaration
    if (!declaration.checked) {
      showToast('You must agree to the Declaration & Consent checkbox to proceed.', 'error');
      isValid = false;
    }

    if (!isValid && firstErrorInput) {
      firstErrorInput.focus();
      showToast('Please complete all required fields marked in red.', 'error');
    }

    return isValid;
  }

  function markError(inputElement, message) {
    inputElement.style.borderColor = '#e63946';
  }

  /**
   * Formats Naira currency
   */
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Populates Preview Modal Content
   */
  function populatePreviewModal() {
    const formattedSavings = formatCurrency(parseFloat(monthlySavings.value));
    
    modalPreviewContent.innerHTML = `
      <div class="preview-item full-width">
        <span class="label">1. Full Name</span>
        <span class="value">${escapeHtml(fullName.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">2. Staff ID / File No.</span>
        <span class="value">${escapeHtml(staffId.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">3. Department</span>
        <span class="value">${escapeHtml(department.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">4. Unit</span>
        <span class="value">${escapeHtml(unit.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">5. IPPIS Number</span>
        <span class="value">${escapeHtml(ippisNo.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">6. Phone Number</span>
        <span class="value">${escapeHtml(phoneNo.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">7. Monthly Savings Amount</span>
        <span class="value" style="color: #2d6a4f; font-size: 1.1rem;">${formattedSavings}</span>
      </div>
      <div class="preview-item full-width">
        <span class="label">8. Next of Kin Details</span>
        <span class="value">${escapeHtml(nextOfKin.value).replace(/\n/g, '<br>')}</span>
      </div>
      <div class="preview-item full-width" style="margin-top: 0.5rem; background: #e8f5e9; padding: 0.75rem; border-radius: 8px;">
        <span class="label" style="color: #1b4332;">9. Declaration Status</span>
        <span class="value" style="color: #1b4332;"><i class="fa-solid fa-circle-check"></i> Agreed & Authorized Payroll Deduction</span>
      </div>
    `;
  }

  function openModal() {
    previewModal.classList.add('active');
  }

  function closeModal() {
    previewModal.classList.remove('active');
  }

  /**
   * Handles Form Submission
   */
  async function handleSubmit() {
    confirmSubmitBtn.disabled = true;
    confirmSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

    const formData = {
      name: fullName.value.trim(),
      staffId: staffId.value.trim(),
      department: department.value.trim(),
      unit: unit.value.trim(),
      ippisNo: ippisNo.value.trim(),
      phoneNo: phoneNo.value.trim(),
      monthlySavings: monthlySavings.value.trim(),
      nextOfKin: nextOfKin.value.trim(),
      declaration: declaration.checked
    };

    try {
      let refCode = 'FMCK-COOP-' + Math.floor(100000 + Math.random() * 900000);
      
      if (APPS_SCRIPT_WEBAPP_URL) {
        const response = await fetch(APPS_SCRIPT_WEBAPP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(formData)
        });
        showToast('Registration submitted successfully to FMCK database!', 'success');
      } else {
        // Fallback / Offline submission notification
        showToast('Registration recorded! Reference: ' + refCode, 'success');
      }

      // Display Final Slip and Print Options
      renderSuccessState(refCode);
      localStorage.removeItem('fmck_coop_draft');

    } catch (err) {
      console.error('Submission error:', err);
      showToast('Error submitting registration. Please check network connection.', 'error');
    } finally {
      confirmSubmitBtn.disabled = false;
      confirmSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Final Submit';
    }
  }

  /**
   * Renders success receipt modal view with Print capability
   */
  function renderSuccessState(refCode) {
    const formattedSavings = formatCurrency(parseFloat(monthlySavings.value));
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    modalPreviewContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem; background: #e8f5e9; padding: 1rem; border-radius: 8px; border: 1px solid #b7e4c7;">
        <i class="fa-solid fa-circle-check" style="font-size: 2.5rem; color: #2d6a4f; margin-bottom: 0.5rem;"></i>
        <h3 style="color: #1b4332;">Registration Successfully Submitted!</h3>
        <p style="font-size: 0.9rem; color: #2d6a4f;">Reference Number: <strong style="font-size: 1.1rem;">${refCode}</strong></p>
        <p style="font-size: 0.8rem; color: #64748b;">Date: ${now}</p>
      </div>

      <div class="preview-item full-width">
        <span class="label">1. Name</span>
        <span class="value">${escapeHtml(fullName.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">2. Staff ID / File No.</span>
        <span class="value">${escapeHtml(staffId.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">3. Department</span>
        <span class="value">${escapeHtml(department.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">4. Unit</span>
        <span class="value">${escapeHtml(unit.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">5. IPPIS Number</span>
        <span class="value">${escapeHtml(ippisNo.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">6. Phone Number</span>
        <span class="value">${escapeHtml(phoneNo.value)}</span>
      </div>
      <div class="preview-item">
        <span class="label">7. Monthly Savings Amount</span>
        <span class="value" style="color: #1b4332;">${formattedSavings}</span>
      </div>
      <div class="preview-item full-width">
        <span class="label">8. Next of Kin</span>
        <span class="value">${escapeHtml(nextOfKin.value).replace(/\n/g, '<br>')}</span>
      </div>
    `;

    // Swap footer buttons to Print Slip & Close
    const modalFooter = previewModal.querySelector('.modal-footer');
    modalFooter.innerHTML = `
      <button type="button" class="btn btn-secondary" onclick="window.print()">
        <i class="fa-solid fa-print"></i> Print Registration Slip
      </button>
      <button type="button" class="btn btn-primary" id="finishBtn">
        <i class="fa-solid fa-check"></i> Done
      </button>
    `;

    document.getElementById('finishBtn').addEventListener('click', () => {
      closeModal();
      coopForm.reset();
      window.location.reload();
    });
  }

  // Toast notification helper
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}" style="color: ${type === 'error' ? '#e63946' : '#2d6a4f'}; font-size: 1.2rem;"></i>
      <span>${escapeHtml(message)}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Draft saving in LocalStorage
  function saveDraft() {
    const draft = {
      fullName: fullName.value,
      staffId: staffId.value,
      department: department.value,
      unit: unit.value,
      ippisNo: ippisNo.value,
      phoneNo: phoneNo.value,
      monthlySavings: monthlySavings.value,
      nextOfKin: nextOfKin.value
    };
    localStorage.setItem('fmck_coop_draft', JSON.stringify(draft));
  }

  function loadDraft() {
    const saved = localStorage.getItem('fmck_coop_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.fullName) fullName.value = draft.fullName;
        if (draft.staffId) staffId.value = draft.staffId;
        if (draft.department) department.value = draft.department;
        if (draft.unit) unit.value = draft.unit;
        if (draft.ippisNo) ippisNo.value = draft.ippisNo;
        if (draft.phoneNo) phoneNo.value = draft.phoneNo;
        if (draft.monthlySavings) monthlySavings.value = draft.monthlySavings;
        if (draft.nextOfKin) nextOfKin.value = draft.nextOfKin;
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }

  // Utility to escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }
});
