import { ClipboardCheck, Sparkles, Vote, ShieldCheck } from 'lucide-react';

export default function ProfileModule(props: any) {
  const { user, getRankClass, priceTierLabel } = props;

  return (
    <section className="evaluation-shell">
      <div className="card evaluation-hero-card">
        <div>
          <div className="evaluation-kicker">評鑑模組</div>
          <div className="evaluation-title">個人資料區後續改為評鑑與投票機制</div>
          <div className="evaluation-desc">這一區先切換成評鑑模組定位，下一版再依你提供的詳細投票規則補齊內容與流程。</div>
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

      <div className="evaluation-grid">
        <div className="card evaluation-card">
          <div className="evaluation-card-head"><Vote className="small-icon" /><span>投票機制預留</span></div>
          <div className="evaluation-bullets">
            <div>候選人 / 評分項目 / 票數統計</div>
            <div>支援身分與權限控管</div>
            <div>之後可接評鑑結果與排行</div>
          </div>
        </div>
        <div className="card evaluation-card">
          <div className="evaluation-card-head"><ClipboardCheck className="small-icon" /><span>評鑑流程預留</span></div>
          <div className="evaluation-bullets">
            <div>發起評鑑</div>
            <div>投票中</div>
            <div>結果彙整 / 歷史紀錄</div>
          </div>
        </div>
        <div className="card evaluation-card">
          <div className="evaluation-card-head"><ShieldCheck className="small-icon" /><span>權限預留</span></div>
          <div className="evaluation-bullets">
            <div>建立投票</div>
            <div>審核結果</div>
            <div>限制可見範圍</div>
          </div>
        </div>
        <div className="card evaluation-card accent">
          <div className="evaluation-card-head"><Sparkles className="small-icon" /><span>下一步</span></div>
          <div className="evaluation-bullets">
            <div>你提供評鑑規則後</div>
            <div>我直接把 UI 與互動補完整</div>
            <div>再依需求接資料流</div>
          </div>
        </div>
      </div>
    </section>
  );
}
