import { UserCog, User, ShieldCheck, KeyRound, PencilLine, Eye } from 'lucide-react';

export default function StaffModule(props: any) {
  const {
    staff,
    activeStaff,
    filteredStaff,
    getRankClass,
    SectionIntro,
    StatusBadge,
    selectedStaffId,
    selectedStaff,
    staffEditorMode,
    staffDraft,
    staffNotice,
    staffRoles,
    staffRanks,
    staffPermissionPreview,
    openCreateStaff,
    openEditStaff,
    openViewStaff,
    updateStaffDraftField,
    resetStaffPassword,
    saveStaffDraft,
  } = props;

  return (
    <>
      <SectionIntro
        title="人員管理"
        desc="登入 ID、身分、階級與權限。"
        stats={[`總數 ${staff.length}`, `啟用中 ${activeStaff}`, '新增 / 編輯 / 啟用']}
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
                <div className="panel-desc">查看人員、身分、階級與啟用狀態。</div>
              </div>
              <button type="button" className="primary-button" onClick={openCreateStaff}>
                <UserCog className="small-icon" />新增人員
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
                  <div className="data-chip-row">
                    <span className={getRankClass(item.rank)}>階級 / {item.rank}</span>
                    <span className="badge badge-neutral">{(item.permissions || []).length} 項權限</span>
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
                <div className="panel-title">{staffEditorMode === 'create' ? '新增人員' : staffEditorMode === 'edit' ? '編輯人員' : '人員詳情'}</div>
                <div className="panel-desc">階級、身分、初始化密碼與權限邏輯。</div>
              </div>
              <span className="badge badge-role">{staffEditorMode === 'create' ? '新增' : staffEditorMode === 'edit' ? '編輯' : '查看'}</span>
            </div>

            <div className="form-grid two-col form-gap-top">
              <label className="field-card">
                <span className="field-label"><User className="small-icon" />姓名</span>
                <input value={staffDraft.name} onChange={(e) => updateStaffDraftField('name', e.target.value)} readOnly={staffEditorMode === 'view'} />
              </label>
              <label className="field-card">
                <span className="field-label"><UserCog className="small-icon" />登入 ID</span>
                <input value={staffDraft.loginId} onChange={(e) => updateStaffDraftField('loginId', e.target.value)} readOnly={staffEditorMode === 'view'} />
              </label>
              <label className="field-card">
                <span className="field-label"><ShieldCheck className="small-icon" />身分</span>
                <select value={staffDraft.role} onChange={(e) => updateStaffDraftField('role', e.target.value)} disabled={staffEditorMode === 'view'}>
                  {staffRoles.map((role: string) => <option key={role} value={role}>{role}</option>)}
                </select>
              </label>
              <label className="field-card">
                <span className="field-label"><ShieldCheck className="small-icon" />階級</span>
                <select value={staffDraft.rank} onChange={(e) => updateStaffDraftField('rank', e.target.value)} disabled={staffEditorMode === 'view'}>
                  {staffRanks.map((rank: string) => <option key={rank} value={rank}>{rank}</option>)}
                </select>
              </label>
              <label className="field-card field-span-2">
                <span className="field-label"><KeyRound className="small-icon" />初始化密碼</span>
                <input value={staffDraft.password} readOnly />
              </label>
            </div>

            <div className="product-editor-status">
              <span className={`badge ${staffDraft.enabled ? 'badge-success' : 'badge-danger'}`}>{staffDraft.enabled ? '啟用中' : '已停用'}</span>
              {staffEditorMode !== 'view' && (
                <>
                  <button type="button" className="ghost-button compact-btn" onClick={resetStaffPassword}>
                    <KeyRound className="small-icon" />初始化密碼
                  </button>
                  <button type="button" className={`ghost-button compact-btn ${staffDraft.enabled ? 'danger-ghost' : 'success-ghost'}`} onClick={() => updateStaffDraftField('enabled', !staffDraft.enabled)}>
                    {staffDraft.enabled ? '切換停用' : '切換啟用'}
                  </button>
                </>
              )}
            </div>

            <div className="stack-list compact product-editor-notes">
              <div>權限邏輯</div>
              {staffPermissionPreview.map((item: string) => <div key={item}>{item}</div>)}
            </div>

            {selectedStaff && staffEditorMode === 'view' && selectedStaff.permissions?.length ? (
              <div className="data-chip-row">
                {selectedStaff.permissions.map((item: string) => <span key={item} className="badge badge-soft">{item}</span>)}
              </div>
            ) : null}

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
