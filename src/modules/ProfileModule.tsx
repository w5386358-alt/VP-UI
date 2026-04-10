import { ClipboardCheck, ShieldCheck, Vote, Lock, Sparkles } from 'lucide-react';

export default function ProfileModule(props: any) {
  const {
    user,
    getRankClass,
    priceTierLabel,
    evaluationQuarter,
    setEvaluationQuarter,
    evaluationTargets = [],
    selectedEvaluateeLoginId,
    setSelectedEvaluateeLoginId,
    selectedEvaluatee,
    evaluationDraft,
    updateEvaluationDraftField,
    evaluationNotice,
    saveEvaluationSubmission,
    hasSubmittedSelectedEvaluation,
    evaluationMetricMeta = [],
    evaluationSubmissions = [],
  } = props;

  const mySubmittedCount = evaluationSubmissions.filter((item: any) => item.evaluatorLoginId === user.loginId).length;
  const quarterSubmittedCount = evaluationSubmissions.filter((item: any) => item.evaluatorLoginId === user.loginId && item.quarter === evaluationQuarter).length;
  const isCore = user.rank?.includes('核心') || user.rankKey === 'core';

  return (
    <section className="evaluation-shell">
      <div className="card evaluation-hero-card">
        <div>
          <div className="evaluation-kicker">評鑑</div>
          <div className="evaluation-title">核心夥伴匿名評鑑系統</div>
          <div className="evaluation-desc">目前第一版規則：只有核心人員可評鑑，且只能評鑑除自己以外的核心人員；送出後不可修改。</div>
        </div>
        <div className="evaluation-identity">
          <div className="evaluation-avatar">評</div>
          <div>
            <div className="evaluation-user">{user.name}</div>
            <div className="data-chip-row">
              <span className="badge badge-role">帳號 / {user.loginId}</span>
              <span className={getRankClass(user.rank)}>階級 / {user.rank}</span>
              <span className="badge badge-neutral">價格層級 / {priceTierLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="evaluation-quarter-row">
        {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
          <button key={quarter} type="button" className={`evaluation-quarter-btn ${evaluationQuarter === quarter ? 'active' : ''}`} onClick={() => setEvaluationQuarter(quarter)}>{quarter}</button>
        ))}
      </div>

      {!isCore ? (
        <div className="evaluation-grid one-col">
          <div className="card evaluation-card accent">
            <div className="evaluation-card-head"><ShieldCheck className="small-icon" /><span>目前不可評鑑</span></div>
            <div className="evaluation-bullets">
              <div>目前只有核心人員可進入評鑑流程</div>
              <div>系統已預留未來擴充其他階級的評鑑模組</div>
              <div>你目前仍可在儀表板查看自己的季度能力雷達</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="evaluation-voting-layout">
          <div className="card evaluation-vote-card">
            <div className="evaluation-card-head"><Vote className="small-icon" /><span>{evaluationQuarter} 匿名評鑑</span></div>
            <div className="evaluation-vote-grid">
              <label className="field-card field-span-2">
                <span className="field-label">評鑑對象</span>
                <select value={selectedEvaluateeLoginId} onChange={(e) => setSelectedEvaluateeLoginId(e.target.value)} disabled={hasSubmittedSelectedEvaluation}>
                  {evaluationTargets.map((item: any) => <option key={item.loginId} value={item.loginId}>{item.name} / {item.loginId}</option>)}
                </select>
              </label>

              {evaluationMetricMeta.map((item: any) => (
                <label key={item.key} className="field-card field-span-2 evaluation-score-card">
                  <span className="field-label">{item.label}（滿分 {item.max}）</span>
                  <div className="evaluation-score-row">
                    <input type="range" min="0" max={item.max} value={evaluationDraft[item.key]} onChange={(e) => updateEvaluationDraftField(item.key, Number(e.target.value))} disabled={hasSubmittedSelectedEvaluation} />
                    <strong>{evaluationDraft[item.key]}</strong>
                  </div>
                  <small>{item.desc}</small>
                </label>
              ))}
            </div>

            <div className="evaluation-lock-tip">
              <Lock className="small-icon" />
              <span>匿名送出後不可修改，系統不對外顯示評分者身分。</span>
            </div>

            <div className="accounting-action-row">
              <button type="button" className="primary-button" onClick={saveEvaluationSubmission} disabled={!selectedEvaluatee || hasSubmittedSelectedEvaluation}><ClipboardCheck className="small-icon" />確認送出評鑑</button>
            </div>
            {evaluationNotice && <div className={`inline-action-notice ${evaluationNotice.tone}`}><strong>{evaluationNotice.text}</strong></div>}
          </div>

          <div className="evaluation-grid side">
            <div className="card evaluation-card">
              <div className="evaluation-card-head"><Sparkles className="small-icon" /><span>本季規則</span></div>
              <div className="evaluation-bullets">
                <div>只可評鑑其他核心人員</div>
                <div>採匿名送出，後台只顯示公式結果</div>
                <div>四大項：業績、協作、專業、效率</div>
              </div>
            </div>
            <div className="card evaluation-card">
              <div className="evaluation-card-head"><ShieldCheck className="small-icon" /><span>送出狀態</span></div>
              <div className="evaluation-bullets">
                <div>本季已送出：{quarterSubmittedCount} 份</div>
                <div>累計已送出：{mySubmittedCount} 份</div>
                <div>目前對象：{selectedEvaluatee?.name || '尚未選擇'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
