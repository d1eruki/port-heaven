const EPS = 0.75;

export function getViewportMetrics({ offset, centerBiasPx }) {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const center = Math.max(0, offset) + (vh - offset) / 2 + (centerBiasPx | 0);
  return { top: offset, bottom: vh, height: vh, center };
}

export function measureSections(sections, viewport) {
  return sections.map((section) => {
    const rect = section.getBoundingClientRect();
    const visTop = Math.max(rect.top, viewport.top);
    const visBot = Math.min(rect.bottom, viewport.bottom);

    return {
      id: section.id,
      rect,
      visible: Math.max(0, visBot - visTop),
      center: rect.top + rect.height / 2,
    };
  });
}

export function chooseActiveSectionId({ metrics, viewport, activeId, scrollDir, cfg }) {
  const anyVis = metrics.some((metric) => metric.visible > 0);
  if (!anyVis) return "";

  let best = metrics[0];
  for (const metric of metrics) {
    if (metric.visible - EPS > best.visible) best = metric;
  }

  if (best.visible < cfg.minActivateVisiblePx) return "";
  if (!activeId) return best.id;

  const cur = metrics.find((metric) => metric.id === activeId) || best;
  const lead = best.visible - cur.visible;

  if (lead < cfg.switchThresholdPx) {
    if (cfg.centerAssist) {
      const crossedDown =
        scrollDir > 0 && cur.center < viewport.center && best.center >= viewport.center;
      const crossedUp =
        scrollDir < 0 && cur.center > viewport.center && best.center <= viewport.center;
      if (crossedDown || crossedUp) return best.id;
    }
    return activeId;
  }

  return best.id;
}
