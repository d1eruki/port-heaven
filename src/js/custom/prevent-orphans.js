// nonbreaking-prepositions.js
document.addEventListener('DOMContentLoaded', () => {
  // короткие предлоги/союзы (добавил частые: а, но, да, же, ли, бы)
  const SHORT = [
    'в','на','и','к','с','у','о','об','от','по','за','из','до',
    'под','при','про','без','над','для','а','но','да','же','ли','бы'
  ];

  // \s или NBSP слева, короткое слово, обычный пробел справа
  // заменяем на: тот же левый пробел + короткое слово + NBSP
  const re = new RegExp(`([\\s\\u00A0])(${SHORT.join('|')})(\\s+)`, 'gi');

  const rootSelector = '.article'; // меняй при желании
  const roots = document.querySelectorAll(rootSelector);

  const glue = node => {
    // только текстовые узлы
    if (node.nodeType !== Node.TEXT_NODE) return;
    const before = node.nodeValue;
    const after = before.replace(re, (_, p1, p2) => `${p1}${p2}\u00A0`);
    if (after !== before) node.nodeValue = after;
  };

  const walk = el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let n; while ((n = walker.nextNode())) glue(n);
  };

  roots.forEach(walk);

  // Если Vue/i18n подменяет текст после загрузки — ловим изменения
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) walk(n);
          else if (n.nodeType === 3) glue(n);
        });
      } else if (m.type === 'characterData') {
        glue(m.target);
      }
    }
  });

  roots.forEach(el => mo.observe(el, {
    childList: true,
    characterData: true,
    subtree: true
  }));
});
