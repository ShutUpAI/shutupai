document.getElementById('year').textContent = new Date().getFullYear();

const translations = {
  zh: {
    skip: '跳转到主要内容', home: 'ShutUpAI 首页', discuss: '聊聊 AI',
    subtitle: '热爱 AI，但不惯着 AI。', scroll: '向下阅读我们的态度', attitude: '我们的态度',
    passion: '狂热', clarity: '清醒', edge: '犀利', period: '。',
    passionCopy: '坚定 All in AI。\n相信 AI 会改变世界。',
    clarityCopy: '不迷信 AI，不接受 AI\n一本正经地胡说八道。',
    edgeCopy: '敢吐槽，敢质疑，\n敢说真话。',
    philosophy: '不是讨厌 AI，而是挑战 AI。', footer: '独立思考，永不静音。', links: '相关链接',
    title: 'ShutUpAI — 热爱 AI，但不惯着 AI。',
    description: '热爱 AI，但不惯着 AI。狂热、清醒、犀利。Don’t Hate AI. Challenge AI.',
  },
  en: {
    skip: 'Skip to main content', home: 'ShutUpAI home', discuss: 'Let’s talk AI',
    subtitle: 'Passionate about AI. Unafraid to question it.', scroll: 'Read our attitude', attitude: 'Our attitude',
    passion: 'Passion', clarity: 'Clarity', edge: 'Edge', period: '.',
    passionCopy: 'All in on AI.\nWe believe it will change the world.',
    clarityCopy: 'No blind faith. No accepting\nconfident nonsense as truth.',
    edgeCopy: 'Dare to question. Call it out.\nSay what needs to be said.',
    philosophy: 'We don’t hate AI. We challenge it.', footer: 'Independent minds. Never on mute.', links: 'Related links',
    title: 'ShutUpAI — We Love AI. We Just Tell It to Shut Up.',
    description: 'Passion. Clarity. Edge. We Love AI. We Just Tell It to Shut Up. Don’t Hate AI. Challenge AI.',
  },
};

const languageToggle = document.querySelector('.language-toggle');
// Detect afresh on every visit; Chinese locales use Chinese, all others English.
let language = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';

function setLanguage(nextLanguage) {
  language = nextLanguage;
  const copy = translations[language];
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = copy[element.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-label]').forEach(element => {
    element.setAttribute('aria-label', copy[element.dataset.i18nLabel]);
  });
  document.title = copy.title;
  document.querySelector('meta[name="description"]').content = copy.description;
  document.querySelector('meta[property="og:title"]').content = copy.title;
  document.querySelector('meta[property="og:description"]').content = copy.description;
  languageToggle.textContent = language === 'zh' ? 'EN' : '中文';
  languageToggle.lang = language === 'zh' ? 'en' : 'zh-CN';
  languageToggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
}

setLanguage(language);
languageToggle.hidden = false;
languageToggle.addEventListener('click', () => setLanguage(language === 'zh' ? 'en' : 'zh'));

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const entranceAnimations = new Set();
const arrivalEase = 'cubic-bezier(0.16, 1, 0.3, 1)';

function arrive(element, { delay = 0, distance = 20, blur = 0, duration = 700 } = {}) {
  if (motionPreference.matches || !element.animate) return;
  const animation = element.animate([
    { opacity: 0.2, transform: `translateY(${distance}px)`, filter: `blur(${blur}px)` },
    { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
  ], { duration, delay, easing: arrivalEase, fill: 'backwards' });
  entranceAnimations.add(animation);
  animation.finished.then(
    () => entranceAnimations.delete(animation),
    () => entranceAnimations.delete(animation),
  );
}

// The English statement and reply land first, then the Chinese subtitle follows.
if (window.scrollY < 80 && !location.hash) {
  document.querySelectorAll('.headline-line').forEach((line, index) => {
    arrive(line, { delay: 80 + index * 170, distance: 32, blur: 5, duration: 800 });
  });
  arrive(document.querySelector('.hero-subtitle'), { delay: 390, distance: 14 });
  arrive(document.querySelector('.manifesto-link'), { delay: 560, distance: 8, duration: 500 });
}

// Reveal each group only once; content stays readable even without JavaScript.
let observer;
if ('IntersectionObserver' in window && !motionPreference.matches) {
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      observer.unobserve(element);
      if (element.matches('.manifesto')) {
        element.querySelectorAll('.principle').forEach((principle, index) => {
          arrive(principle, { delay: index * 90, distance: 16, duration: 600 });
        });
      } else {
        const lines = element.querySelectorAll('h2 > span');
        arrive(lines[0], { distance: 12, duration: 650 });
        arrive(lines[1], { delay: 160, distance: 22, blur: 3, duration: 800 });
        arrive(element.querySelector('p'), { delay: 300, distance: 8, duration: 600 });
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.manifesto, .philosophy').forEach(element => observer.observe(element));
}

motionPreference.addEventListener('change', event => {
  if (!event.matches) return;
  entranceAnimations.forEach(animation => animation.cancel());
  entranceAnimations.clear();
  observer?.disconnect();
});
