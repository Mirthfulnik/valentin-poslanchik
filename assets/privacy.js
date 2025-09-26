const modal = document.getElementById('privacy-modal');
const modalDialog = modal?.querySelector('.privacy-modal__dialog');
const overlay = modal?.querySelector('[data-privacy-overlay]');
const closeButtons = modal ? modal.querySelectorAll('[data-privacy-close]') : [];
const triggers = document.querySelectorAll('[data-privacy-trigger]');
const body = document.body;
let lastFocusedElement = null;

const openModal = () => {
  if (!modal) return;
  if (!modal.classList.contains('privacy-modal--open')) {
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  modal.classList.add('privacy-modal--open');
  modal.setAttribute('aria-hidden', 'false');
  body.classList.add('privacy-modal-open');
  const firstFocusable = modalDialog?.querySelector(
    'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (firstFocusable instanceof HTMLElement) {
    firstFocusable.focus();
  }
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('privacy-modal--open');
  modal.setAttribute('aria-hidden', 'true');
  body.classList.remove('privacy-modal-open');
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
};

const trapFocus = (event) => {
  if (!modal?.classList.contains('privacy-modal--open') || !modalDialog) return;
  if (event.key !== 'Tab') return;

  const focusable = modalDialog.querySelectorAll(
    'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      (last instanceof HTMLElement ? last : first).focus();
    }
    return;
  }

  if (document.activeElement === last) {
    event.preventDefault();
    (first instanceof HTMLElement ? first : last).focus();
  }
};

const handleTriggerClick = (event) => {
  event.preventDefault();
  openModal();
};

triggers.forEach((trigger) => {
  trigger.addEventListener('click', handleTriggerClick);
});

closeButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    closeModal();
  });
});

overlay?.addEventListener('click', closeModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('privacy-modal--open')) {
    closeModal();
  }
});

document.addEventListener('keydown', trapFocus);

const COOKIE_STORAGE_KEY = 'cookieConsentChoice';
const banner = document.getElementById('cookie-consent-banner');
const acceptButton = document.getElementById('cookie-accept');
const declineButton = document.getElementById('cookie-decline');

const storage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn('Невозможно прочитать значение из localStorage', error);
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Невозможно сохранить значение в localStorage', error);
    }
  },
};

const showBanner = () => {
  if (!banner) return;
  banner.classList.add('cookie-banner--visible');
  banner.setAttribute('aria-hidden', 'false');
};

const hideBanner = () => {
  if (!banner) return;
  banner.classList.remove('cookie-banner--visible');
  banner.setAttribute('aria-hidden', 'true');
};

const initBanner = () => {
  if (!banner) return;
  const storedChoice = storage.get(COOKIE_STORAGE_KEY);
  if (!storedChoice) {
    window.setTimeout(showBanner, 400);
  }
};

acceptButton?.addEventListener('click', () => {
  storage.set(COOKIE_STORAGE_KEY, 'accepted');
  hideBanner();
});

declineButton?.addEventListener('click', () => {
  storage.set(COOKIE_STORAGE_KEY, 'declined');
  hideBanner();
});

initBanner();
index.html
