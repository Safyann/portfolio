// Инлайн-скрипт для <head>: выполняется до гидрации и не зависит от React, поэтому блоки на первом
// экране не ждут загрузки бандла. Отмечает .reveal атрибутом data-revealed, когда блок доходит до
// области видимости.
//
// Не IntersectionObserver: при быстрой прокрутке или переходе по якорю браузер перепрыгивает блоки,
// они ни разу не пересекают экран и остаются невидимыми. Поэтому на каждом кадре прокрутки показываем
// всё, что уже выше нижней границы (10% запаса), — включая то, что проскочили.
// MutationObserver подхватывает новые блоки при клиентской навигации Next.js.
// Атрибуты, а не классы: React не трогает атрибуты, которых нет в его props, и не сбросит их при ререндере.
// Атрибут может появиться до гидрации, поэтому у элементов с .reveal стоит suppressHydrationWarning.
export const REVEAL_SCRIPT = `(function () {
  if (!('MutationObserver' in window) || !('requestAnimationFrame' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.setAttribute('data-reveal', '');

  var pending = [];
  var scheduled = false;

  function collect(scope) {
    if (scope.matches && scope.matches('.reveal:not([data-revealed])')) pending.push(scope);
    if (scope.querySelectorAll) {
      scope.querySelectorAll('.reveal:not([data-revealed])').forEach(function (el) {
        pending.push(el);
      });
    }
  }

  function check() {
    scheduled = false;
    var limit = window.innerHeight * 0.9;
    pending = pending.filter(function (el) {
      if (!el.isConnected) return false;
      if (el.getBoundingClientRect().top < limit) {
        el.setAttribute('data-revealed', '');
        return false;
      }
      return true;
    });
  }

  function schedule() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(check);
    }
  }

  function start() {
    collect(document);
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) collect(node);
        });
      });
      schedule();
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();`;
