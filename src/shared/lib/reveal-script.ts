// Инлайн-скрипт для <head>: выполняется до гидрации и не зависит от React, поэтому блоки на первом
// экране не ждут загрузки бандла. Отмечает .reveal атрибутом data-revealed, когда блок попадает в экран.
// MutationObserver нужен для клиентской навигации: новые страницы Next.js монтирует без перезагрузки.
// Атрибуты, а не классы: React не трогает атрибуты, которых нет в его props, и не сбросит их при ререндере.
// Атрибут может появиться до гидрации, поэтому у элементов с .reveal стоит suppressHydrationWarning.
export const REVEAL_SCRIPT = `(function () {
  if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root = document.documentElement;
  root.setAttribute('data-reveal', '');

  var intersection = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-revealed', '');
        intersection.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  function observe(scope) {
    if (scope.matches && scope.matches('.reveal:not([data-revealed])')) intersection.observe(scope);
    if (scope.querySelectorAll) scope.querySelectorAll('.reveal:not([data-revealed])').forEach(function (el) {
      intersection.observe(el);
    });
  }

  function start() {
    observe(document);
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) observe(node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();`;
