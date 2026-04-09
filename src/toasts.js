/**
 * Railroad Toasts v1.0.0
 * 
 * Toast notifications + animated confirm dialogs for web applications.
 * Works standalone or with HTMX.
 * 
 * @license MIT
 * @author Faron Coder
 * @see https://github.com/faroncoder/railroad-toasts
 */

(function(window) {
  'use strict';

  // ── Toast Container ───────────────────────────────────────────────
  const container = document.createElement('div');
  container.id = 'railroad-toast-container';
  container.style.cssText = 'position:fixed; top:60px; right:16px; z-index:10000; display:flex; flex-direction:column; gap:8px; pointer-events:none;';
  document.body.appendChild(container);

  const COLORS = {
    success: { bg: 'rgba(22,163,74,0.95)', border: '#16a34a', icon: '✓' },
    error:   { bg: 'rgba(220,38,38,0.95)', border: '#dc2626', icon: '✕' },
    warn:    { bg: 'rgba(217,119,6,0.95)', border: '#d97706', icon: '⚠' },
    info:    { bg: 'rgba(37,99,235,0.95)', border: '#2563eb', icon: 'ℹ' },
  };

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type: 'success', 'error', 'warn', 'info'
   * @param {number} duration - Auto-dismiss duration in ms (default: 4000)
   */
  function toast(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;
    const c = COLORS[type] || COLORS.info;

    const el = document.createElement('div');
    el.style.cssText = [
      'background:' + c.bg,
      'border-left:3px solid ' + c.border,
      'color:#fff',
      'padding:10px 16px',
      'border-radius:6px',
      'font-size:0.82rem',
      'font-weight:500',
      'box-shadow:0 4px 20px rgba(0,0,0,0.4)',
      'pointer-events:auto',
      'cursor:pointer',
      'max-width:360px',
      'display:flex',
      'align-items:center',
      'gap:8px',
      'transform:translateX(120%)',
      'transition:transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s',
      'opacity:0',
    ].join(';');

    el.innerHTML = '<span style="font-size:1rem;">' + c.icon + '</span><span>' + message + '</span>';
    el.addEventListener('click', function() { dismiss(el); });

    container.appendChild(el);

    // Animate in
    requestAnimationFrame(function() {
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    });

    // Auto dismiss
    if (duration > 0) {
      setTimeout(function() { dismiss(el); }, duration);
    }
  }

  function dismiss(el) {
    el.style.transform = 'translateX(120%)';
    el.style.opacity = '0';
    setTimeout(function() { el.remove(); }, 300);
  }

  // ── Custom Confirm Dialog ───────────────────────────────────────
  const confirmOverlay = document.createElement('div');
  confirmOverlay.id = 'railroad-confirm-overlay';
  confirmOverlay.style.cssText = 'display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:10001; align-items:center; justify-content:center;';
  confirmOverlay.innerHTML = [
    '<div style="background:#1f2937; border:1px solid #374151; border-radius:10px; padding:1.5rem; width:340px; box-shadow:0 16px 48px rgba(0,0,0,0.5);">',
    '  <div id="railroad-confirm-message" style="font-size:0.9rem; color:#f3f4f6; margin-bottom:1.25rem; line-height:1.5;"></div>',
    '  <div style="display:flex; gap:8px; justify-content:flex-end;">',
    '    <button id="railroad-confirm-cancel" style="padding:0.5rem 1rem; font-size:0.875rem; border:1px solid #4b5563; background:transparent; color:#d1d5db; border-radius:6px; cursor:pointer;">Cancel</button>',
    '    <button id="railroad-confirm-ok" style="padding:0.5rem 1rem; font-size:0.875rem; border:none; background:#dc2626; color:#fff; border-radius:6px; cursor:pointer;">Confirm</button>',
    '  </div>',
    '</div>',
  ].join('');
  document.body.appendChild(confirmOverlay);

  let _confirmResolve = null;

  document.getElementById('railroad-confirm-cancel').addEventListener('click', function() {
    confirmOverlay.style.display = 'none';
    if (_confirmResolve) _confirmResolve(false);
  });

  document.getElementById('railroad-confirm-ok').addEventListener('click', function() {
    confirmOverlay.style.display = 'none';
    if (_confirmResolve) _confirmResolve(true);
  });

  confirmOverlay.addEventListener('click', function(e) {
    if (e.target === confirmOverlay) {
      confirmOverlay.style.display = 'none';
      if (_confirmResolve) _confirmResolve(false);
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && confirmOverlay.style.display === 'flex') {
      confirmOverlay.style.display = 'none';
      if (_confirmResolve) _confirmResolve(false);
    }
  });

  /**
   * Show a confirm dialog
   * @param {string} message - Message to display
   * @param {object} options - Optional: { confirmText, cancelText }
   * @returns {Promise<boolean>} - Resolves to true if confirmed
   */
  function confirm(message, options) {
    options = options || {};
    return new Promise(function(resolve) {
      _confirmResolve = resolve;
      document.getElementById('railroad-confirm-message').textContent = message;
      
      const okBtn = document.getElementById('railroad-confirm-ok');
      const cancelBtn = document.getElementById('railroad-confirm-cancel');
      
      if (options.confirmText) okBtn.textContent = options.confirmText;
      else okBtn.textContent = 'Confirm';
      
      if (options.cancelText) cancelBtn.textContent = options.cancelText;
      else cancelBtn.textContent = 'Cancel';
      
      confirmOverlay.style.display = 'flex';
    });
  }

  // ── HTMX Integration (optional) ──────────────────────────────────
  // Override hx-confirm if HTMX is present
  if (typeof htmx !== 'undefined' || document.body.getAttribute('hx-boost')) {
    document.body.addEventListener('htmx:confirm', function(e) {
      const msg = e.detail.question;
      if (!msg) return;

      e.preventDefault();
      confirm(msg).then(function(confirmed) {
        if (confirmed) {
          e.detail.issueRequest(true);
        }
      });
    });

    // HTMX error toasts
    document.body.addEventListener('htmx:responseError', function(e) {
      const status = e.detail.xhr ? e.detail.xhr.status : 0;
      toast('Request failed (HTTP ' + status + ')', 'error');
    });

    document.body.addEventListener('htmx:sendError', function() {
      toast('Network error — server unreachable', 'error');
    });

    // Success toast via HX-Trigger response header
    document.body.addEventListener('htmx:afterRequest', function(e) {
      const xhr = e.detail.xhr;
      if (!xhr) return;
      const trigger = xhr.getResponseHeader('HX-Trigger');
      if (trigger) {
        try {
          const data = JSON.parse(trigger);
          if (data.toast) {
            toast(data.toast.message || data.toast, data.toast.type || 'success');
          }
        } catch (_) {}
      }
    });
  }

  // ── Export API ────────────────────────────────────────────────────
  const RailroadToasts = {
    toast: toast,
    confirm: confirm,
    dismiss: dismiss,
    colors: COLORS
  };

  // Global export
  window.toast = toast;
  window.confirm = confirm;
  window.RailroadToasts = RailroadToasts;

  // Module export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RailroadToasts;
  }

  console.log('[Railroad Toasts] Initialized');

})(typeof window !== 'undefined' ? window : this);
