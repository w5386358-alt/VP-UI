import { ClipboardCheck, Vote, Lock, Medal, Send, ArrowUpRight, ArrowDownRight, ChevronRight, X, KeyRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const quarterOptions = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function ProfileModule(props: any) {
  const {
    user, getRankClass, priceTierLabel,
    evaluationQuarter, setEvaluationQuarter,
    evaluationTargets = [], evaluationSubmissions = [], evaluationNotice, submitEvaluation,
    dashboardRadarMetrics = [], myEvaluationQuarterResult, evaluationResults = [],
    profileViewMode = 'evaluation', passwordDraft, setPasswordDraft, passwordNotice, passwordSaving, submitPasswordChange,
  } = props;

  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [draft, setDraft] = useState({ sales: 32, collaboration: 20, professional: 16, efficiency: 12 });
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileEvaluationOpen, setMobileEvaluationOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobileViewport(window.innerWidth <= 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedTarget = useMemo(
    () => evaluationTargets.find((item: any) => item.loginId === selectedTargetId) || evaluationTargets[0] || null,
    [evaluationTargets, selectedTargetId]
  );

  const selectedTargetIdSafe = selectedTarget?.loginId || '';
  const submittedTargetMap = useMemo(() => new Set(
    evaluationSubmissions
      .filter((item: any) => item.quarter === evaluationQuarter && item.evaluatorLoginId === user.loginId)
      .map((item: any) => item.targetLoginId)
  ), [evaluationSubmissions, evaluationQuarter, user.loginId]);

  function updateField(key: 'sales' | 'collaboration' | 'professional' | 'efficiency', value: string, max: number) {
    const next = Number(value || 0);
    setDraft((prev) => ({ ...prev, [key]: Math.max(0, Math.min(max, Math.round(next))) }));
  }

  function handleSubmit() {
    if (!selectedTargetIdSafe) return;
    const ok = submitEvaluation?.(selectedTargetIdSafe, draft);
    if (ok) {
      setDraft({ sales: 32, collaboration: 20, professional: 16, efficiency: 12 });
    }
  }

  const canEvaluate = user.rankKey === 'core';
  const rankingTree = dashboardRadarMetrics.length ? dashboardRadarMetrics : [
    { label: '業績', value: 0 },
    { label: '協作', value: 0 },
    { label: '專業', value: 0 },
    { label: '效率', value: 0 },
  ];
  const averageScore = myEvaluationQuarterResult?.total || 0;
  const medal = myEvaluationQuarterResult?.medal || '精進級';

  const quarterIndex = quarterOptions.indexOf(evaluationQuarter);
  const previousQuarter = quarterIndex > 0 ? quarterOptions[quarterIndex - 1] : null;
  const previousQuarterResult = useMemo(
    () => previousQuarter ? evaluationResults.find((item: any) => item.quarter === previousQuarter && item.loginId === user.loginId) || null : null,
    [evaluationResults, previousQuarter, user.loginId]
  );
  const radarLevels = [1, 0.75, 0.5, 0.25];
  const svgSize = 360;
  const center = svgSize / 2;
  const outerRadius = 92;
  const labelRadius = 136;
  const radarPoints = rankingTree.map((item: any, index: number) => {
    const angle = (-90 + index * (360 / rankingTree.length)) * Math.PI / 180;
    const radius = outerRadius * ((item.value || 0) / 100);
    const axisX = center + Math.cos(angle) * outerRadius;
    const axisY = center + Math.sin(angle) * outerRadius;
    const labelX = center + Math.cos(angle) * labelRadius;
    const labelY = center + Math.sin(angle) * labelRadius;
    return {
      ...item,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      axisX,
      axisY,
      labelX,
      labelY,
      textAnchor: index === 1 ? 'start' : index === 3 ? 'end' : 'middle',
      labelOffsetY: index === 0 ? -8 : index === 2 ? 10 : -2,
      scoreOffsetY: index === 0 ? 18 : index === 2 ? 36 : 20,
    };
  });
  const radarPolygon = radarPoints.map((item: any) => `${item.x},${item.y}`).join(' ');

  return (
    <section className="evaluation-shell evaluation-shell-v2">
      {profileViewMode === 'password' && (
        <div className="card order-panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">變更密碼</div>
              <div className="panel-desc">輸入舊密碼與新密碼後，直接更新中央帳號並同步 Firebase。</div>
            </div>
            <span className="badge badge-role">中央帳號</span>
          </div>
          <div className="form-grid two-col form-gap-top">
            <label className="field-card">
              <span className="field-label"><KeyRound className="small-icon" />舊密碼</span>
              <input type="password" value={passwordDraft?.currentPassword || ''} onChange={(e) => setPasswordDraft?.((prev: any) => ({ ...prev, currentPassword: e.target.value }))} autoComplete="current-password" />
            </label>
            <label className="field-card">
              <span className="field-label"><KeyRound className="small-icon" />新密碼</span>
              <input type="password" value={passwordDraft?.nextPassword || ''} onChange={(e) => setPasswordDraft?.((prev: any) => ({ ...prev, nextPassword: e.target.value }))} autoComplete="new-password" />
            </label>
            <label className="field-card field-card-span-2">
              <span className="field-label"><KeyRound className="small-icon" />確認新密碼</span>
              <input type="password" value={passwordDraft?.confirmPassword || ''} onChange={(e) => setPasswordDraft?.((prev: any) => ({ ...prev, confirmPassword: e.target.value }))} autoComplete="new-password" />
            </label>
          </div>
          <div className="accounting-action-row">
            <button type="button" className="primary-button" onClick={() => submitPasswordChange?.()} disabled={!!passwordSaving}>{passwordSaving ? '更新中...' : '確認更新密碼'}</button>
          </div>
          {passwordNotice && <div className={`inline-action-notice ${passwordNotice.tone}`}><strong>{passwordNotice.text}</strong></div>}
        </div>
      )}


      {profileViewMode !== 'password' && (
        <>
      {!canEvaluate && (
        <div className="card evaluation-lock-card evaluation-lock-card-wide">
          <Lock className="small-icon" />
          <div>
            <div className="evaluation-card-title">目前僅核心人員可進入評鑑專區</div>
            <div className="evaluation-card-subtitle">非核心身分會自動隱藏評鑑入口，避免誤進與誤操作。</div>
          </div>
        </div>
      )}

      {canEvaluate && (
        <>
          <div className="evaluation-quarter-row">
            {quarterOptions.map((item) => (
              <button key={item} type="button" className={`dashboard-quarter-btn ${evaluationQuarter === item ? 'active' : ''}`} onClick={() => setEvaluationQuarter?.(item)}>{item}</button>
            ))}
          </div>

          <div className="evaluation-radar-shell">
            <div className="card evaluation-radar-card">
              <div className="panel-head">
                <div>
                  <div className="panel-title">個人評鑑雷達能力圖</div>
                  <div className="panel-desc">能力項目已整合為業績、協作、專業、效率，直接集中在評鑑模組查看。</div>
                </div>
                <span className="badge badge-soft">{evaluationQuarter}</span>
              </div>
              <div className="dashboard-tree-layout radar-layout evaluation-radar-layout">
                <div className="dashboard-tree-visual radar-visual">
                  <svg className="dashboard-radar-svg" viewBox={`0 0 ${svgSize} ${svgSize}`} aria-label="個人評鑑雷達能力圖">
                    {radarLevels.map((level) => {
                      const points = rankingTree.map((_: any, index: number) => {
                        const angle = (-90 + index * (360 / rankingTree.length)) * Math.PI / 180;
                        const radius = outerRadius * level;
                        const x = center + Math.cos(angle) * radius;
                        const y = center + Math.sin(angle) * radius;
                        return `${x},${y}`;
                      }).join(' ');
                      return <polygon key={level} points={points} className="dashboard-radar-grid" />;
                    })}
                    {radarPoints.map((item: any) => (
                      <line key={item.label} x1={center} y1={center} x2={item.axisX} y2={item.axisY} className="dashboard-radar-axis" />
                    ))}
                    <polygon points={radarPolygon} className="dashboard-radar-shape" />
                    {radarPoints.map((item: any) => (
                      <circle key={item.label} cx={item.x} cy={item.y} r="5.5" className="dashboard-radar-point" />
                    ))}
                    <g className="dashboard-radar-center-group">
                      <circle cx={center} cy={center} r="30" className="dashboard-radar-center-disc" />
                      <text x={center} y={center - 4} textAnchor="middle" className="dashboard-radar-center-title">綜合評分</text>
                      <text x={center} y={center + 18} textAnchor="middle" className="dashboard-radar-center-score">{averageScore}</text>
                    </g>
                    {radarPoints.map((item: any) => (
                      <g key={item.label} className="dashboard-radar-label-group">
                        <text x={item.labelX} y={item.labelY + item.labelOffsetY} textAnchor={item.textAnchor as any} className="dashboard-radar-svg-label">{item.label}</text>
                        <text x={item.labelX} y={item.labelY + item.scoreOffsetY} textAnchor={item.textAnchor as any} className="dashboard-radar-svg-score">{item.value}</text>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="dashboard-tree-score-grid radar-summary-grid evaluation-radar-summary-grid">
                  {rankingTree.map((item: any) => {
                    const previousValue = previousQuarterResult
                      ? (item.label === '業績' ? previousQuarterResult.sales : item.label === '協作' ? previousQuarterResult.collaboration : item.label === '專業' ? previousQuarterResult.professional : previousQuarterResult.efficiency)
                      : null;
                    const delta = previousValue === null ? null : item.value - previousValue;
                    const improved = delta !== null && delta >= 0;
                    return (
                      <div key={item.label} className="dashboard-tree-score-card summary-card-lite radar-summary-card evaluation-radar-summary-card">
                        <span className="dashboard-tree-label">{item.label}</span>
                        <strong className="dashboard-tree-score">{item.value}</strong>
                        <small className="dashboard-tree-mini-desc">{evaluationQuarter} 能力得分</small>
                        <div className={`evaluation-delta-row ${delta === null ? 'neutral' : improved ? 'up' : 'down'}`}>
                          {delta === null ? (
                            <span>尚無前季資料</span>
                          ) : improved ? (
                            <>
                              <ArrowUpRight className="tiny-icon" />
                              <span>比 {previousQuarter} +{delta}</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="tiny-icon" />
                              <span>比 {previousQuarter} {delta}</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card evaluation-radar-side-card">
              <div className="evaluation-card-head"><Radar className="small-icon" /><span>本季總覽</span></div>
              <div className="evaluation-bullets">
                <div>季度：{evaluationQuarter}</div>
                <div>綜合評分：{averageScore}</div>
                <div>榮譽稱號：{medal}</div>
                <div>評鑑對象：{evaluationTargets.length} 位核心人員</div>
              </div>
            </div>
          </div>

          <div className="evaluation-target-grid">
            {evaluationTargets.map((item: any) => {
              const submitted = submittedTargetMap.has(item.loginId);
              return (
                <div
                  key={item.loginId}
                  className={`card evaluation-target-card ${selectedTargetIdSafe === item.loginId ? 'active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTargetId(item.loginId)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedTargetId(item.loginId); } }}
                >
                  <div className="evaluation-target-top">
                    <div className="evaluation-target-name"><UserRound className="tiny-icon" />{item.name}</div>
                    <div className="evaluation-target-top-actions">
                      <span className={`badge ${submitted ? 'badge-success' : 'badge-soft'}`}>{submitted ? '已送出' : '待評鑑'}</span>
                      <button type="button" className="mobile-row-action-trigger evaluation-target-trigger" aria-label={`評分 ${item.name}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedTargetId(item.loginId); if (isMobileViewport) setMobileEvaluationOpen(true); }}>›</button>
                    </div>
                  </div>
                  <div className="evaluation-target-meta">{item.loginId} / {item.role || '核心夥伴'}</div>
                </div>
              );
            })}
            {!evaluationTargets.length && <div className="card evaluation-empty-card">目前抓不到其他核心成員，請先確認人員資料。</div>}
          </div>

          <div className="evaluation-grid evaluation-form-grid-v2">
            <div className={`card evaluation-card evaluation-form-card mobile-modal-shell mobile-shared-layer-panel mobile-evaluation-editor ${isMobileViewport ? 'mobile-evaluation-card' : ''} ${mobileEvaluationOpen ? 'is-mobile-open' : ''}`}>
              {isMobileViewport && (
                <div className="mobile-editor-head">
                  <div className="mobile-editor-title-wrap">
                    <div className="mobile-editor-kicker">匿名評分</div>
                    <div className="mobile-editor-sub">由人員列表操作入口直接開啟</div>
                  </div>
                  <button type="button" className="mobile-editor-close" onClick={() => setMobileEvaluationOpen(false)} aria-label="關閉匿名評分">
                    <X className="small-icon" />
                  </button>
                </div>
              )}
              <div className="mobile-modal-body evaluation-modal-body">
                <div className="evaluation-card-head"><Vote className="small-icon" /><span>匿名評分</span></div>
                <div className="evaluation-form-head">
                  <div>
                    <div className="evaluation-card-title">評鑑對象：{selectedTarget?.name || '請先選擇'}</div>
                    <div className="evaluation-card-subtitle">本季：{evaluationQuarter} / 測試期間可重複送出</div>
                  </div>
                  <span className="badge badge-role">匿名制</span>
                </div>
                <div className="evaluation-score-grid">
                  <label className="field-card"><span className="field-label">業績（0-40）</span><input type="number" min="0" max="40" value={draft.sales} onChange={(e) => updateField('sales', e.target.value, 40)} disabled={!selectedTarget} /></label>
                  <label className="field-card"><span className="field-label">協作（0-25）</span><input type="number" min="0" max="25" value={draft.collaboration} onChange={(e) => updateField('collaboration', e.target.value, 25)} disabled={!selectedTarget} /></label>
                  <label className="field-card"><span className="field-label">專業（0-20）</span><input type="number" min="0" max="20" value={draft.professional} onChange={(e) => updateField('professional', e.target.value, 20)} disabled={!selectedTarget} /></label>
                  <label className="field-card"><span className="field-label">效率（0-15）</span><input type="number" min="0" max="15" value={draft.efficiency} onChange={(e) => updateField('efficiency', e.target.value, 15)} disabled={!selectedTarget} /></label>
                </div>
                <div className="evaluation-submit-row">
                  <div className="evaluation-total-box">
                    <span>總分</span>
                    <strong>{draft.sales + draft.collaboration + draft.professional + draft.efficiency}</strong>
                  </div>
                  <button type="button" className="primary-button" disabled={!selectedTarget} onClick={handleSubmit}><Send className="small-icon" />送出評鑑</button>
                </div>
                {evaluationNotice && <div className={`inline-action-notice ${evaluationNotice.tone}`}><strong>{evaluationNotice.text}</strong></div>}
              </div>
            </div>

            <div className="card evaluation-card">
              <div className="evaluation-card-head"><ClipboardCheck className="small-icon" /><span>本季規則</span></div>
              <div className="evaluation-bullets">
                <div>只有核心人員可進行評鑑</div>
                <div>目前只評其他核心人員，不可自評</div>
                <div>匿名送出，但系統保留送出紀錄用於防重覆</div>
                <div>測試期間暫時解除鎖定，可重複送出驗證流程</div>
              </div>
            </div>

            <div className="card evaluation-card">
              <div className="evaluation-card-head"><BarChart3 className="small-icon" /><span>能力維度</span></div>
              <div className="evaluation-bullets">
                <div>業績：結果導向與回款效率</div>
                <div>協作：跨部支援與團隊整合</div>
                <div>專業：SOP、知識沉澱、避險能力</div>
                <div>效率：追蹤、落地、時效與品質</div>
              </div>
            </div>

            <div className="card evaluation-card accent">
              <div className="evaluation-card-head"><Medal className="small-icon" /><span>榮譽稱號</span></div>
              <div className="evaluation-bullets">
                <div>領航級：90-100 分</div>
                <div>專業級：70-89 分</div>
                <div>精進級：0-69 分</div>
              </div>
            </div>
          </div>
        </>
      )}

      {isMobileViewport && mobileEvaluationOpen && <div className="mobile-editor-backdrop" onClick={() => setMobileEvaluationOpen(false)} />}
        </>
      )}
    </section>
  );
}
