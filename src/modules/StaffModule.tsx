import { UserCog, Plus, Eye, PencilLine, KeyRound, ShieldCheck, UserRound } from 'lucide-react';

const ROLE_OPTIONS = ['系統', '銷售', '會計', '倉儲'];
const RANK_OPTIONS = ['核心人員', '菁英成員', '高級銷售', '普通銷售'];

export default function StaffModule(props: any) {
  const {
    staff,
    activeStaff,
    filteredStaff,
    getRankClass,
    SectionIntro,
    StatusBadge,
    staffNotice,
    selectedStaffId,
    openCreateStaff,
    openViewStaff,
    openEditStaff,
    staffEditorMode,
    staffDraft,
    updateStaffDraftField,
    saveStaffDraft,
    selectedStaff,
  } = props;

  const permissionNote = staffDraft?.role === '系統'
    ? '全模組管理 / 最高權限'
    : staffDraft?.role === '會計'
      ? '可看收退款 / 依階級套用權限'
      : staffDraft?.role === '倉儲'
        ? '可看出入庫 / 依階級套用權限'
        : '可看自己的客戶與訂單 / 依階級套用權限';

  return (
    <>
      <SectionIntro
        title="人員管理"
        desc="新增、編輯、階級、身分與初始化密碼。"
        stats={[`總數 ${staff.length}`, `啟用中 ${activeStaff}`, '角色 / 階級 / 權限']}
      />

      {staffNotice && (
        <div className={`card product-notice-banner ${staffNotice.tone}`}>
          <strong>{staffNotice.text}</strong>
        </div>
      )}

      <section className="product-admin-layout">
        <div className="product-admin-main">
          <div className="card order-panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">人員列表</div>
                <div className="panel-desc">查看登入 ID、身分、階級、啟用與權限資訊。</div>
              </div>
              <button type="button" className="primary-button" onClick={openCreateStaff}>
                <Plus className="small-icon" />新增人員
              </button>
            </div>

            <section className="record-grid staff-grid">
              {filteredStaff.map((item: any) => (
                <div key={item.id} className={`card data-card ${selectedStaffId === item.id ? 'selected' : ''}`}>
                  <div className="data-card-top">
                    <span className="badge badge-role">{item.role}</span>
                    <StatusBadge enabled={item.enabled} />
                  </div>
                  <div className="data-card-title">{item.name}</div>
                  <div className="data-card-subtitle">登入 ID：{item.loginId}</div>
                  <div className="data-chip-row compact-wrap">
                    <span className={getRankClass(item.rank)}>階級 / {item.rank}</span>
                    <span className="badge badge-neutral">{item.permissionNote || '依角色套用權限'}</span>
                  </div>
                  <div className="data-chip-row compact-wrap">
                    <span className="badge badge-soft">初始化密碼 {item.initialPassword || `${item.loginId}@123`}</span>
                  </div>
                  <div className="product-card-actions">
                    <button type="button" className="ghost-button compact-btn" onClick={() => openViewStaff(item)}>
                      <Eye className="small-icon" />查看
                    </button>
                    <button type="button" className="ghost-button compact-btn" onClick={() => openEditStaff(item)}>
                      <PencilLine className="small-icon" />編輯
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>

        <aside className="product-admin-side">
          <div className="card order-panel sticky-panel product-editor-panel">
            <div className="panel-head compact-head">
              <div>
                <div className="panel-title">{staffEditorMode === 'create' ? '新增人員' : staffEditorMode === 'edit' ? '人員編輯' : '人員詳情'}</div>
                <div className="panel-desc">身分、階級、權限與初始化密碼一起管理。</div>
              </div>
              <span className="badge badge-role">{staffEditorMode === 'create' ? '新增' : staffEditorMode === 'edit' ? '編輯' : '查看'}</span>
            </div>

            <div className="form-grid two-col form-gap-top">
              <label className="field-card field-span-2">
                <span className="field-label"><UserRound className="small-icon" />姓名</span>
                <input value={staffDraft.name} onChange={(e) => updateStaffDraftField('name', e.target.value)} readOnly={staffEditorMode === 'view'} placeholder="輸入姓名" />
              </label>
              <label className="field-card">
                <span className="field-label"><UserCog className="small-icon" />登入 ID</span>
                <input value={staffDraft.loginId} onChange={(e) => updateStaffDraftField('loginId', e.target.value)} readOnly={staffEditorMode === 'view'} placeholder="例如 vp001" />
              </label>
              <label className="field-card">
                <span className="field-label"><KeyRound className="small-icon" />初始化密碼</span>
                <input value={staffDraft.initialPassword} readOnly />
              </label>
              <label className="field-card">
                <span className="field-label"><ShieldCheck className="small-icon" />身分</span>
                <select value={staffDraft.role} onChange={(e) => updateStaffDraftField('role', e.target.value)} disabled={staffEditorMode === 'view'}>
                  {ROLE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="field-card">
                <span className="field-label"><ShieldCheck className="small-icon" />階級</span>
                <select value={staffDraft.rank} onChange={(e) => updateStaffDraftField('rank', e.target.value)} disabled={staffEditorMode === 'view'}>
                  {RANK_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <div className="product-editor-status">
              <span className={`badge ${staffDraft.enabled ? 'badge-success' : 'badge-danger'}`}>{staffDraft.enabled ? '啟用中' : '已停用'}</span>
              {staffEditorMode !== 'view' && (
                <button type="button" className={`ghost-button compact-btn ${staffDraft.enabled ? 'danger-ghost' : 'success-ghost'}`} onClick={() => updateStaffDraftField('enabled', !staffDraft.enabled)}>
                  {staffDraft.enabled ? '切換停用' : '切換啟用'}
                </button>
              )}
            </div>

            <div className="stack-list compact product-editor-notes">
              <div>身分與階級都採下拉選單</div>
              <div>初始化密碼會依登入 ID 自動產生</div>
              <div>{permissionNote}</div>
            </div>

            <div className="accounting-sync-card">
              <div className="accounting-sync-title">權限邏輯</div>
              <div className="accounting-sync-desc">{selectedStaff?.permissionNote || permissionNote}</div>
            </div>

            <div className="accounting-action-row">
              {staffEditorMode === 'view' ? (
                <button type="button" className="primary-button full-width" onClick={() => selectedStaff && openEditStaff(selectedStaff)}>
                  <PencilLine className="small-icon" />編輯人員
                </button>
              ) : (
                <>
                  <button type="button" className="primary-button" onClick={saveStaffDraft}>
                    <UserCog className="small-icon" />{staffEditorMode === 'create' ? '確認新增' : '確認更新'}
                  </button>
                  <button type="button" className="ghost-button" onClick={() => selectedStaff ? openViewStaff(selectedStaff) : null}>
                    <Eye className="small-icon" />返回明細
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
