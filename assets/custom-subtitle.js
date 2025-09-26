const TARGET_TEXT = "Я умею сохранять бюджет";
const SUBTITLE_TEXT = "Уже уберёг";

const insertSubtitle = () => {
  const heading = [...document.querySelectorAll("h1, h2, h3")].find(
    (element) => element.textContent.trim() === TARGET_TEXT
  );

  if (!heading || heading.dataset.subtitleAdded === "true") {
    return false;
  }

  const subtitle = document.createElement("p");
  subtitle.textContent = SUBTITLE_TEXT;
  subtitle.className = "budget-subtitle";
  heading.insertAdjacentElement("afterend", subtitle);
  heading.dataset.subtitleAdded = "true";
  return true;
};

const setupObserver = () => {
  const observer = new MutationObserver(() => {
    if (insertSubtitle()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

const initialize = () => {
  if (insertSubtitle()) {
    return;
  }

  setupObserver();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
