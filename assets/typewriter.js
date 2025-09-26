const HERO_PARAGRAPH_PREFIX =
  "Здравствуйте! Меня зовут Валентин Посланчик. Я оказываю юридическую поддержку компаниям, которые создают аудио- и видеоконтент";

const TYPEWRITER_TEXTS = [
  "Видеопродакшны",
  "Кинокомпании",
  "Студии анимации",
  "Рекламные агентства",
  "Постпродакшны",
  "Студии графики",
  "Студии мэппинга",
];

const TYPE_DELAY = 120;
const ERASE_DELAY = 60;
const WORD_HOLD_DELAY = 1800;
const TRANSITION_DELAY = 400;

const createTypewriterElement = (targetElement) => {
  if (!targetElement || document.querySelector(".typewriter-text")) {
    return null;
  }

  const typewriterElement = document.createElement("p");
  typewriterElement.className = "typewriter-text";
  typewriterElement.setAttribute("role", "status");
  typewriterElement.setAttribute("aria-live", "polite");

  targetElement.insertAdjacentElement("afterend", typewriterElement);
  return typewriterElement;
};

const startTypewriterAnimation = (element) => {
  let wordIndex = 0;
  let charIndex = 0;
  let isErasing = false;

  const updateText = () => {
    const currentWord = TYPEWRITER_TEXTS[wordIndex];

    if (!isErasing) {
      charIndex += 1;
      element.textContent = currentWord.slice(0, charIndex);

      if (charIndex === currentWord.length) {
        isErasing = true;
        setTimeout(updateText, WORD_HOLD_DELAY);
        return;
      }
    } else {
      charIndex -= 1;
      element.textContent = currentWord.slice(0, charIndex);

      if (charIndex === 0) {
        isErasing = false;
        wordIndex = (wordIndex + 1) % TYPEWRITER_TEXTS.length;
        setTimeout(updateText, TRANSITION_DELAY);
        return;
      }
    }

    const nextDelay = isErasing ? ERASE_DELAY : TYPE_DELAY;
    setTimeout(updateText, nextDelay);
  };

  updateText();
};

const findHeroParagraph = () => {
  const heroCandidates = document.querySelectorAll("[data-testid='text-hero-description'], p, div");

  for (const element of heroCandidates) {
    if (
      element.textContent &&
      element.textContent.trim().startsWith(HERO_PARAGRAPH_PREFIX)
    ) {
      return element;
    }
  }

  return null;
};

const initializeTypewriter = () => {
  const target = findHeroParagraph();

  if (!target) {
    return false;
  }

  const typewriterElement = createTypewriterElement(target);

  if (!typewriterElement) {
    return false;
  }

  startTypewriterAnimation(typewriterElement);
  return true;
};

const setupObserver = () => {
  const observer = new MutationObserver(() => {
    if (initializeTypewriter()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

const run = () => {
  if (initializeTypewriter()) {
    return;
  }

  setupObserver();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run, { once: true });
} else {
  run();
}

