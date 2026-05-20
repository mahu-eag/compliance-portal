import React, { useState, useMemo, useRef, useEffect } from 'react';
import { getRelevantMeasures } from '../data/measures';

// ─── Design Tokens ────────────────────────────────────────────────────────
const C = {
  red: '#e30613', redDark: '#b9000d', redSoft: '#fff1f2',
  black: '#1f1f1f', dark: '#2b2b2b', gray: '#6f6f6f',
  lightGray: '#f4f4f4', border: '#e2e2e2', white: '#ffffff',
};
const PRIORITY_COLOR = { high: C.red, medium: '#d97706', low: '#16a34a' };
const typeLabels     = { tech: '🛠 Technisch', org: '📋 Organisatorisch', change: '👥 Change & Adoption' };
const priorityLabels = { high: 'Hoch', medium: 'Mittel', low: 'Niedrig' };
const deliveryLabels = { intern: '🏠 Intern', extern: '🤝 Extern', both: '🏠🤝 Intern & Extern' };

// ─── Styles ───────────────────────────────────────────────────────────────
const S = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1.5rem 3rem', fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color: C.black },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' },
  toolbarRight: { display: 'flex', gap: '0.5rem' },
  btnBack: { padding: '0.6rem 1.2rem', border: `2px solid ${C.red}`, background: C.white, color: C.red, borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  btnPrint: { padding: '0.6rem 1.2rem', background: C.black, color: C.white, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
  hero: { background: `linear-gradient(135deg,${C.black} 0%,${C.dark} 100%)`, color: C.white, borderRadius: 14, padding: '2rem 2.5rem', marginBottom: '2rem' },
  heroBadge: { display: 'inline-block', background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: C.white, fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: 999, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.75rem' },
  heroTitle: { margin: '0 0 0.5rem', fontSize: '1.7rem', fontWeight: 700 },
  heroLead:  { margin: '0 0 1.5rem', opacity: 0.85, fontSize: '1rem', lineHeight: 1.6 },
  statsRow:  { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  statCard:  { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', padding: '0.9rem 1.4rem', borderRadius: 10, minWidth: 110, border: '1px solid rgba(255,255,255,0.15)' },
  statValue: { display: 'block', fontSize: '1.9rem', fontWeight: 700 },
  statLabel: { fontSize: '0.82rem', opacity: 0.8 },
  filters:   { display: 'flex', flexWrap: 'wrap', gap: '1.5rem', background: C.lightGray, borderRadius: 10, padding: '1rem 1.2rem', marginBottom: '1.5rem', border: `1px solid ${C.border}` },
  filterGroup: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' },
  filterLabel: { fontSize: '0.82rem', fontWeight: 700, color: C.gray, marginRight: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.4px' },
  filterBtnBase:   { padding: '0.35rem 0.85rem', border: `1px solid ${C.border}`, background: C.white, borderRadius: 999, cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.15s', fontWeight: 500 },
  filterBtnActive: { background: C.red, color: C.white, borderColor: C.red },
  sectionCard:   { background: C.white, borderRadius: 12, marginBottom: '0.85rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden', border: `1px solid ${C.border}` },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.1rem 1.4rem', cursor: 'pointer', userSelect: 'none', gap: '1rem' },
  sectionHeaderLeft: { display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 },
  sectionStripe: { width: 5, borderRadius: 4, alignSelf: 'stretch', flexShrink: 0 },
  sectionMeta:   { minWidth: 0 },
  sectionCat:    { fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.gray, marginBottom: '0.15rem' },
  sectionTitle:  { margin: 0, fontSize: '1.05rem', fontWeight: 700, color: C.black },
  sectionSub:    { fontSize: '0.82rem', color: C.gray, marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  sectionRight:  { display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 },
  prioChip: p => ({ padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, background: PRIORITY_COLOR[p]+'18', color: PRIORITY_COLOR[p], border: `1px solid ${PRIORITY_COLOR[p]}44` }),
  chevron: open => ({ width: 22, height: 22, borderRadius: '50%', background: C.lightGray, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }),
  countBadge:   { background: C.lightGray, color: C.gray, fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: 999, fontWeight: 600 },
  scoreBar:     { height: 4, background: C.border, borderRadius: 4, overflow: 'hidden', width: 80, flexShrink: 0 },
  scoreBarFill: (pct,p) => ({ height: '100%', width: `${pct}%`, background: PRIORITY_COLOR[p], borderRadius: 4 }),
  sectionBody:  { borderTop: `1px solid ${C.border}`, padding: '1rem 1.4rem 1.4rem' },
  measureGrid:  { display: 'grid', gap: '0.65rem' },
  measureItem: t => { const bc = t==='tech'?'#3b82f6':t==='org'?'#8b5cf6':'#ec4899'; return { background: C.lightGray, borderRadius: 8, borderLeft: `3px solid ${bc}`, padding: '0.85rem 1rem' }; },
  measureTags:  { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' },
  tag: (col=C.border) => ({ fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: 4, background: col+'22', color: C.gray, border: `1px solid ${col}44`, fontWeight: 500 }),
  measureTitle: { margin: '0.1rem 0 0.25rem', fontSize: '0.95rem', fontWeight: 700, color: C.black },
  measureDesc:  { margin: 0, fontSize: '0.87rem', color: C.gray, lineHeight: 1.55 },
  measureDeps:  { margin: '0.4rem 0 0', fontSize: '0.78rem', color: '#94a3b8' },
  empty: { textAlign: 'center', padding: '3rem 2rem', background: '#ecfdf5', borderRadius: 12, color: '#065f46' },
};

// ─── Gantt scheduling ─────────────────────────────────────────────────────
function buildGanttData(relevantMeasures) {
  // Flatten with section reference
  const allMeasures = [];
  relevantMeasures.forEach(section =>
    section.measures.forEach(m =>
      allMeasures.push({ ...m, sectionTopic: section.topic, sectionId: section.questionId, sectionPriority: section.sectionPriority })
    )
  );

  // Topological scheduling
  const scheduled = {};
  allMeasures.forEach(m => { scheduled[m.title] = 0; });
  for (let pass = 0; pass < allMeasures.length * 2; pass++) {
    let changed = false;
    allMeasures.forEach(m => {
      const depEnd = (m.dependsOn || []).reduce((max, dep) => {
        const depM = allMeasures.find(x => x.title === dep);
        if (!depM) return max;
        return Math.max(max, (scheduled[dep] ?? 0) + (depM.durationWeeks || 2));
      }, 0);
      if (depEnd !== scheduled[m.title]) { scheduled[m.title] = depEnd; changed = true; }
    });
    if (!changed) break;
  }

  const rows = allMeasures.map(m => ({
    ...m,
    startWeek: scheduled[m.title] ?? 0,
    endWeek:   (scheduled[m.title] ?? 0) + (m.durationWeeks || 2),
  }));

  // Build grouped sections: each section gets a summary row + child rows
  const groups = relevantMeasures.map(section => {
    const children = rows.filter(r => r.sectionId === section.questionId);
    const groupStart = Math.min(...children.map(r => r.startWeek));
    const groupEnd   = Math.max(...children.map(r => r.endWeek));
    const totalPT    = children.reduce((s, r) => s + (r.effortPT || 0), 0);
    return { sectionId: section.questionId, topic: section.topic, sectionPriority: section.sectionPriority, groupStart, groupEnd, totalPT, children };
  });

  const totalWeeks = Math.max(...rows.map(r => r.endWeek), 12);
  return { groups, totalWeeks };
}

// ─── Gantt Chart ──────────────────────────────────────────────────────────
function GanttChart({ relevantMeasures }) {
  const { groups, totalWeeks } = useMemo(() => buildGanttData(relevantMeasures), [relevantMeasures]);
  const containerRef   = useRef(null);
  const [containerW, setContainerW] = useState(900);
  // Track which groups are expanded
  const [expanded, setExpanded] = useState({});

  const toggle = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const expandAll   = () => { const s={}; groups.forEach(g => s[g.sectionId]=true);  setExpanded(s); };
  const collapseAll = () => setExpanded({});
  const anyOpen     = groups.some(g => expanded[g.sectionId]);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      if (w > 0) setContainerW(w);
    });
    obs.observe(containerRef.current);
    setContainerW(containerRef.current.offsetWidth);
    return () => obs.disconnect();
  }, []);

  const LABEL_W = Math.min(270, containerW * 0.23);
  const cellW   = Math.max(18, Math.floor((containerW - LABEL_W - 2) / totalWeeks));
  const weeks   = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const months = [];
  for (let w = 1; w <= totalWeeks; w += 4)
    months.push({ label: `M ${Math.ceil(w / 4)}`, span: Math.min(4, totalWeeks - w + 1) });

  const thBase = { background: '#f4f4f4', fontWeight: 600, border: 'none', borderBottom: '2px solid #e2e2e2', position: 'sticky', top: 0, zIndex: 2 };

  // Renders the coloured bar spanning a week range
  const Bar = ({ startWeek, endWeek, color, height = 16, opacity = 0.82, radius = 4 }) =>
    weeks.map(w => {
      const active  = w > startWeek && w <= endWeek;
      const isStart = w === startWeek + 1;
      const isEnd   = w === endWeek;
      return (
        <td key={w} style={{ padding: 0, borderBottom: `1px solid ${C.border}`, borderLeft: w % 4 === 1 ? `1px solid ${C.border}` : '1px solid #f0f0f0' }}>
          {active && (
            <div style={{
              height, margin: '3px 0', background: color, opacity,
              borderRadius: isStart && isEnd ? radius : isStart ? `${radius}px 0 0 ${radius}px` : isEnd ? `0 ${radius}px ${radius}px 0` : 0,
            }} />
          )}
        </td>
      );
    });

  return (
    <div ref={containerRef} style={{ background: C.white, borderRadius: 14, marginTop: '2.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: `1px solid ${C.border}`, overflow: 'hidden', width: '100%' }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.black},${C.dark})`, color: C.white, padding: '1.2rem 1.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 700 }}>📅 Umsetzungs-Zeitplan (Gantt)</h3>
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
            {Object.entries(PRIORITY_COLOR).map(([p, col]) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', opacity: 0.85 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: col }} />
                <span>{priorityLabels[p]}</span>
              </div>
            ))}
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>PT = Personentage</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.75, textAlign: 'right' }}>
            Gesamtdauer: <strong>{totalWeeks} Wochen</strong> ({Math.round(totalWeeks / 4)} Monate)
          </div>
          {/* Expand / Collapse all */}
          <button onClick={anyOpen ? collapseAll : expandAll} style={{ padding: '0.3rem 0.9rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, color: C.white, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
            {anyOpen ? '▲ Alle einklappen' : '▼ Alle ausklappen'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed', minWidth: LABEL_W + totalWeeks * 18 }}>
          <colgroup>
            <col style={{ width: LABEL_W }} />
            {weeks.map(w => <col key={w} style={{ width: cellW }} />)}
          </colgroup>
          <thead>
            <tr>
              <th style={{ ...thBase, textAlign: 'left', padding: '0.35rem 0.8rem', fontSize: '0.72rem', color: C.gray }}>
                Handlungsfeld / Maßnahme
              </th>
              {months.map((m, i) => (
                <th key={i} colSpan={m.span} style={{ ...thBase, textAlign: 'center', borderLeft: `1px solid ${C.border}`, fontSize: '0.7rem', color: C.gray, padding: '0.35rem 0', background: i % 2 === 0 ? '#f4f4f4' : '#eef0f3' }}>
                  {m.label}
                </th>
              ))}
            </tr>
            <tr>
              <th style={{ ...thBase, padding: '0.2rem 0.8rem', fontSize: '0.68rem', color: '#aaa', background: '#fafafa' }}>KW →</th>
              {weeks.map(w => (
                <th key={w} style={{ ...thBase, fontSize: '0.6rem', color: '#bbb', textAlign: 'center', borderLeft: '1px solid #f0f0f0', padding: '0.2rem 0', background: '#fafafa' }}>
                  {cellW >= 24 || w % 2 === 1 ? w : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map(group => {
              const isOpen = !!expanded[group.sectionId];
              const prio   = group.sectionPriority;
              const color  = PRIORITY_COLOR[prio];
              const spanW  = group.groupEnd - group.groupStart;

              return (
                <React.Fragment key={group.sectionId}>
                  {/* ── Group summary row ── */}
                  <tr
                    onClick={() => toggle(group.sectionId)}
                    style={{ background: '#f0f2f5', cursor: 'pointer', borderTop: `2px solid ${color}33` }}
                  >
                    <td style={{ padding: '0.5rem 0.8rem', borderBottom: `1px solid ${C.border}`, verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Colour stripe */}
                        <div style={{ width: 4, height: 28, borderRadius: 3, background: color, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {group.topic}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: C.gray, display: 'flex', gap: '0.5rem', marginTop: 1 }}>
                            <span>{group.children.length} Maßnahmen</span>
                            <span>·</span>
                            <span style={{ color }}>{group.totalPT} PT</span>
                            <span>·</span>
                            <span>Wo. {group.groupStart + 1}–{group.groupEnd}</span>
                          </div>
                        </div>
                        {/* Chevron */}
                        <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: C.gray, transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>▶</div>
                      </div>
                    </td>
                    {/* Summary span bar */}
                    {weeks.map(w => {
                      const active  = w > group.groupStart && w <= group.groupEnd;
                      const isStart = w === group.groupStart + 1;
                      const isEnd   = w === group.groupEnd;
                      return (
                        <td key={w} style={{ padding: 0, borderBottom: `1px solid ${C.border}`, borderLeft: w % 4 === 1 ? `1px solid ${C.border}` : '1px solid #f0f0f0', background: '#f0f2f5' }}>
                          {active && (
                            <div style={{
                              height: 10, margin: '6px 0',
                              background: color, opacity: 0.35,
                              borderRadius: isStart && isEnd ? 4 : isStart ? '4px 0 0 4px' : isEnd ? '0 4px 4px 0' : 0,
                            }} />
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* ── Child measure rows (collapsible) ── */}
                  {isOpen && group.children.map((row, ci) => (
                    <tr key={row.title} style={{ background: ci % 2 === 0 ? '#fafafa' : C.white }}>
                      <td style={{ padding: '0.38rem 0.8rem 0.38rem 1.6rem', borderBottom: `1px solid ${C.border}`, verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {/* indent line */}
                          <div style={{ width: 2, height: 20, borderRadius: 2, background: color, opacity: 0.4, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.76rem', color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {row.title}
                            </div>
                            <div style={{ fontSize: '0.66rem', color: C.gray, display: 'flex', gap: '0.3rem' }}>
                              <span style={{ color: PRIORITY_COLOR[row.priority] }}>{priorityLabels[row.priority]}</span>
                              <span>· {row.effortPT} PT</span>
                              <span>· {row.durationWeeks} Wo.</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      {weeks.map(w => {
                        const active  = w > row.startWeek && w <= row.endWeek;
                        const isStart = w === row.startWeek + 1;
                        const isEnd   = w === row.endWeek;
                        return (
                          <td key={w} style={{ padding: 0, borderBottom: `1px solid ${C.border}`, borderLeft: w % 4 === 1 ? `1px solid ${C.border}` : '1px solid #f0f0f0' }}>
                            {active && (
                              <div style={{
                                height: 14, margin: '4px 1px',
                                background: PRIORITY_COLOR[row.priority],
                                opacity: 0.75,
                                borderRadius: isStart && isEnd ? 4 : isStart ? '4px 0 0 4px' : isEnd ? '0 4px 4px 0' : 0,
                              }} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '0.9rem 1.6rem', borderTop: `1px solid ${C.border}`, background: '#fafafa', fontSize: '0.8rem', color: C.gray }}>
        <span>📋 <strong>{groups.reduce((s,g)=>s+g.children.length,0)}</strong> Maßnahmen in <strong>{groups.length}</strong> Bereichen</span>
        <span>📅 <strong>{totalWeeks}</strong> Wochen Gesamtlaufzeit</span>
        <span>⏱ <strong>{groups.reduce((s,g)=>s+g.totalPT,0)}</strong> Personentage gesamt</span>
        <span style={{ marginLeft: 'auto', opacity: 0.55, fontStyle: 'italic' }}>Bereiche anklicken zum Auf-/Einklappen</span>
      </div>
    </div>
  );
}

// ─── Accordion Section Card ────────────────────────────────────────────────
function SectionCard({ section, idx, filterFn }) {
  const [open, setOpen] = useState(false);
  const filtered = section.measures.filter(filterFn);
  if (filtered.length === 0) return null;

  const scorePct = Math.round((section.achievedScore / section.maxScore) * 100);
  const prio     = section.sectionPriority;

  return (
    <div style={S.sectionCard}>
      <div style={S.sectionHeader} onClick={() => setOpen(o => !o)}>
        <div style={S.sectionHeaderLeft}>
          <div style={{ ...S.sectionStripe, background: PRIORITY_COLOR[prio], minHeight: 44 }} />
          <div style={S.sectionMeta}>
            <div style={S.sectionCat}>{section.category}</div>
            <h3 style={S.sectionTitle}>
              <span style={{ display: 'inline-block', background: C.lightGray, color: C.gray, fontSize: '0.75rem', padding: '0.05rem 0.4rem', borderRadius: 4, marginRight: '0.4rem', fontWeight: 600 }}>#{idx + 1}</span>
              {section.topic}
            </h3>
            <div style={S.sectionSub}>Aktuell: <em>{section.currentAnswer}</em> &nbsp;·&nbsp; {section.achievedScore}/{section.maxScore} Punkte</div>
          </div>
        </div>
        <div style={S.sectionRight}>
          <div style={{ textAlign: 'right' }}>
            <div style={S.scoreBar}><div style={S.scoreBarFill(scorePct, prio)} /></div>
            <div style={{ fontSize: '0.7rem', color: C.gray, marginTop: 2 }}>{scorePct}% erreicht</div>
          </div>
          <div style={S.prioChip(prio)}>{priorityLabels[prio]}</div>
          <span style={S.countBadge}>{filtered.length} Maßnahmen</span>
          <div style={S.chevron(open)}>▼</div>
        </div>
      </div>

      {open && (
        <div style={S.sectionBody}>
          <div style={S.measureGrid}>
            {filtered.map((m, i) => (
              <div key={i} style={S.measureItem(m.type)}>
                <div style={S.measureTags}>
                  <span style={{ ...S.tag('#3b82f6'), color: m.type==='tech'?'#1d4ed8':m.type==='org'?'#6d28d9':'#be185d' }}>{typeLabels[m.type]}</span>
                  <span style={{ ...S.tag(PRIORITY_COLOR[m.priority]), color: PRIORITY_COLOR[m.priority] }}>{priorityLabels[m.priority]}</span>
                  <span style={S.tag('#555')}>{deliveryLabels[m.delivery]}</span>
                  <span style={S.tag('#555')}>⏱ {m.effortPT} PT</span>
                  <span style={S.tag('#555')}>📅 {m.durationWeeks} Wo.</span>
                </div>
                <div style={S.measureTitle}>{m.title}</div>
                <p style={S.measureDesc}>{m.description}</p>
                {m.dependsOn?.length > 0 && <p style={S.measureDeps}>⛓ Voraussetzung: {m.dependsOn.join(' → ')}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function MeasuresView({ questions, answers, onBack, onExport }) {
  const [filterType,      setFilterType]     = useState('all');
  const [filterPriority,  setFilterPriority] = useState('all');
  const [showGantt,       setShowGantt]      = useState(true);

  const relevantMeasures = useMemo(() => getRelevantMeasures(questions, answers), [questions, answers]);

  const filterFn = m =>
    (filterType     === 'all' || m.type     === filterType) &&
    (filterPriority === 'all' || m.priority === filterPriority);

  const totalMeasures     = relevantMeasures.reduce((s, sec) => s + sec.measures.length, 0);
  const highPriorityCount = relevantMeasures.filter(s => s.sectionPriority === 'high').length;
  const totalEffort       = relevantMeasures.reduce((s, sec) => s + sec.measures.reduce((ss, m) => ss + (m.effortPT || 0), 0), 0);

  const FilterBtn = ({ value, label, active, onClick }) => (
    <button style={{ ...S.filterBtnBase, ...(active ? S.filterBtnActive : {}) }} onClick={onClick}>{label}</button>
  );

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color: C.black }}>

      {/* ── Constrained content ── */}
      <div style={S.page}>
        <div style={S.toolbar} className="no-print">
          <button style={S.btnBack} onClick={onBack}>← Zurück zum Ergebnis</button>
          <div style={S.toolbarRight}>
            <button style={S.btnPrint} onClick={() => window.print()}>🖨 Drucken / PDF</button>
            {onExport && <button style={S.btnPrint} onClick={onExport}>📄 Export</button>}
          </div>
        </div>

        <header style={S.hero}>
          <div style={S.heroBadge}>⭐ Premium</div>
          <h1 style={S.heroTitle}>🛡️ Ihr individueller Maßnahmenkatalog</h1>
          <p style={S.heroLead}>Basierend auf Ihren Assessment-Antworten haben wir Handlungsempfehlungen zusammengestellt – priorisiert nach Risikorelevanz und differenziert nach Maßnahmentyp. Klicken Sie auf einen Bereich, um die Maßnahmen einzusehen.</p>
          <div style={S.statsRow}>
            {[
              { value: relevantMeasures.length, label: 'Handlungsfelder' },
              { value: totalMeasures,           label: 'Maßnahmen gesamt' },
              { value: highPriorityCount,        label: 'Hohe Priorität', red: true },
              { value: `${totalEffort} PT`,      label: 'Gesamtaufwand' },
            ].map((s, i) => (
              <div key={i} style={S.statCard}>
                <span style={{ ...S.statValue, color: s.red ? '#fca5a5' : C.white }}>{s.value}</span>
                <span style={S.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </header>

        {relevantMeasures.length === 0 ? (
          <div style={S.empty}><h2>🎉 Hervorragend!</h2><p>In den bewerteten Bereichen wurde überall die optimale Antwort gegeben.</p></div>
        ) : (
          <>
            <div style={S.filters} className="no-print">
              <div style={S.filterGroup}>
                <span style={S.filterLabel}>Typ:</span>
                {[{v:'all',l:'Alle'},{v:'tech',l:'🛠 Technisch'},{v:'org',l:'📋 Organisatorisch'},{v:'change',l:'👥 Change'}].map(({v,l}) => (
                  <FilterBtn key={v} value={v} label={l} active={filterType===v} onClick={()=>setFilterType(v)} />
                ))}
              </div>
              <div style={S.filterGroup}>
                <span style={S.filterLabel}>Priorität:</span>
                {[{v:'all',l:'Alle'},{v:'high',l:'🔴 Hoch'},{v:'medium',l:'🟡 Mittel'},{v:'low',l:'🟢 Niedrig'}].map(({v,l}) => (
                  <FilterBtn key={v} value={v} label={l} active={filterPriority===v} onClick={()=>setFilterPriority(v)} />
                ))}
              </div>
            </div>

            <section>
              {relevantMeasures.map((section, idx) => (
                <SectionCard key={section.questionId} section={section} idx={idx} filterFn={filterFn} />
              ))}
            </section>
          </>
        )}
      </div>

      {/* ── Gantt: full-width outside constrained container ── */}
      {relevantMeasures.length > 0 && (
        <div style={{ padding: '0 1.5rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0 0 1rem' }} className="no-print">
            <button
              style={{ ...S.btnBack, background: showGantt ? C.red : C.white, color: showGantt ? C.white : C.red }}
              onClick={() => setShowGantt(g => !g)}
            >
              {showGantt ? '▲ Zeitplan ausblenden' : '▼ Zeitplan anzeigen'}
            </button>
            <span style={{ fontSize: '0.85rem', color: C.gray }}>
              Gantt · {totalMeasures} Maßnahmen in {relevantMeasures.length} Bereichen · Bereiche anklicken zum Aufklappen
            </span>
          </div>
          {showGantt && <GanttChart relevantMeasures={relevantMeasures} />}
        </div>
      )}

      <div style={{ padding: '1rem 1.5rem 2rem' }} className="no-print">
        <button style={S.btnBack} onClick={onBack}>← Zurück zum Ergebnis</button>
      </div>
    </div>
  );
}
