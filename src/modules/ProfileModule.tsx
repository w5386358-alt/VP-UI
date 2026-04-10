import { ClipboardCheck, Sparkles, Vote, ShieldCheck, Lock, Medal, Send, UserRound, BarChart3 } from 'lucide-react';
import { useMemo, useState } from 'react';

const quarterOptions = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function ProfileModule(props: any) {
  const {
    user, getRankClass, priceTierLabel,
    evaluationQuarter, setEvaluationQuarter,
    evaluationTargets = [], evaluationSubmissions = [], evaluationNotice, submitEvaluation,
  } = props;

  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [draft, setDraft] = useState({ sales: 32, collaboration: 20, professional: 16, efficiency: 12 });

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

  return (
    <section className="evaluation-shell evaluation-shell-v2">
      <div className="card evaluation-hero-card evaluation-hero-card-v2">
        <div>
          <div className="evaluation-kicker">評鑑系統</div>
          <div className="evaluation-title">核心夥伴季度匿名評鑑</div>
          <div className="evaluation-desc">目前僅開放核心人員，且只能評鑑除自己以外的其他核心人員。送出後不可修改。</div>
        </div>
        <div className="evaluation-identity">
          <div className="evaluation-avatar">評</div>
          <div>
            <div className="evaluation-user">{user.name}</div>
            <div className="data-chip-row wrap">
              <span className="badge badge-role">帳號 / {user.loginId}</span>
              <span className={getRankClass(user.rank)}>階級 / {user.rank}</span>
              <span className="badge badge-neutral">價格層級 / {priceTierLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="evaluation-quarter-row">
        {quarterOptions.map((item) => (
          <button key={item} type="button" className={`dashboard-quarter-btn ${evaluationQuarter === item ? 'active' : ''}`} onClick={() => setEvaluationQuarter?.(item)}>{item}</button>
        ))}
      </div>

      {!canEvaluate && (
        <div className="card evaluation-lock-card">
          <Lock className="small-icon" />
          <div>
            <div className="evaluation-card-title">目前僅核心人員可評鑑</div>
            <div className="evaluation-card-subtitle">系統會依登入身分自動判斷，未來可再擴充其他階級。</div>
          </div>
        </div>
      )}

      {canEvaluate && (
        <>
          <div className="evaluation-target-grid">
            {evaluationTargets.map((item: any) => {
              const submitted = submittedTargetMap.has(item.loginId);
              return (
                <button
                  key={item.loginId}
                  type="button"
                  className={`card evaluation-target-card ${selectedTargetIdSafe === item.loginId ? 'active' : ''} ${submitted ? 'locked' : ''}`}
                  onClick={() => setSelectedTargetId(item.loginId)}
                >
                  <div className="evaluation-target-top">
                    <div className="evaluation-target-name"><UserRound className="tiny-icon" />{item.name}</div>
                    <span className={`badge ${submitted ? 'badge-success' : 'badge-soft'}`}>{submitted ? '已完成' : '待評鑑'}</span>
                  </div>
                  <div className="evaluation-target-meta">{item.loginId} / {item.role || '核心夥伴'}</div>
                </button>
              );
            })}
            {!evaluationTargets.length && <div className="card evaluation-empty-card">目前抓不到其他核心成員，請先確認人員資料。</div>}
          </div>

          <div className="evaluation-grid evaluation-form-grid-v2">
            <div className="card evaluation-card evaluation-form-card">
              <div className="evaluation-card-head"><Vote className="small-icon" /><span>匿名評分</span></div>
              <div className="evaluation-form-head">
                <div>
                  <div className="evaluation-card-title">評鑑對象：{selectedTarget?.name || '請先選擇'}</div>
                  <div className="evaluation-card-subtitle">本季：{evaluationQuarter} / 送出後不可修改</div>
                </div>
                <span className="badge badge-role">匿名制</span>
              </div>
              <div className="evaluation-score-grid">
                <label className="field-card"><span className="field-label">業績（0-40）</span><input type="number" min="0" max="40" value={draft.sales} onChange={(e) => updateField('sales', e.target.value, 40)} disabled={!selectedTarget || submittedTargetMap.has(selectedTargetIdSafe)} /></label>
                <label className="field-card"><span className="field-label">協作（0-25）</span><input type="number" min="0" max="25" value={draft.collaboration} onChange={(e) => updateField('collaboration', e.target.value, 25)} disabled={!selectedTarget || submittedTargetMap.has(selectedTargetIdSafe)} /></label>
                <label className="field-card"><span className="field-label">專業（0-20）</span><input type="number" min="0" max="20" value={draft.professional} onChange={(e) => updateField('professional', e.target.value, 20)} disabled={!selectedTarget || submittedTargetMap.has(selectedTargetIdSafe)} /></label>
                <label className="field-card"><span className="field-label">效率（0-15）</span><input type="number" min="0" max="15" value={draft.efficiency} onChange={(e) => updateField('efficiency', e.target.value, 15)} disabled={!selectedTarget || submittedTargetMap.has(selectedTargetIdSafe)} /></label>
              </div>
              <div className="evaluation-submit-row">
                <div className="evaluation-total-box">
                  <span>總分</span>
                  <strong>{draft.sales + draft.collaboration + draft.professional + draft.efficiency}</strong>
                </div>
                <button type="button" className="primary-button" disabled={!selectedTarget || submittedTargetMap.has(selectedTargetIdSafe)} onClick={handleSubmit}><Send className="small-icon" />送出評鑑</button>
              </div>
              {evaluationNotice && <div className={`inline-action-notice ${evaluationNotice.tone}`}><strong>{evaluationNotice.text}</strong></div>}
            </div>

            <div className="card evaluation-card">
              <div className="evaluation-card-head"><ClipboardCheck className="small-icon" /><span>本季規則</span></div>
              <div className="evaluation-bullets">
                <div>只有核心人員可進行評鑑</div>
                <div>目前只評其他核心人員，不可自評</div>
                <div>匿名送出，但系統保留送出紀錄用於防重覆</div>
                <div>送出後不可修改，會進入會計的評鑑分數頁</div>
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
              <div className="evaluation-card-head"><Medal className="small-icon" /><span>榮譽勳章</span></div>
              <div className="evaluation-bullets">
                <div>領航級：90-100 分</div>
                <div>專業級：70-89 分</div>
                <div>精進級：0-69 分</div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
