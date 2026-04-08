import { useMemo, useState } from 'react';
import { UserCog, User, ShieldCheck, KeyRound, PencilLine, Eye, Sparkles, BadgeCheck, ChevronRight, ChevronLeft } from 'lucide-react';

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

  const [staffPage, setStaffPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / pageSize));
  const safePage = Math.min(staffPage, totalPages);
  const pagedStaff = useMemo(() => filteredStaff.slice((safePage - 1) * pageSize, safePage * pageSize), [filteredStaff, safePage]);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <>
      <SectionIntro
        title="人員管理"
        desc="管理人員名單、角色、階級與權限。"
        stats={[`總數 ${staff.length}`, `啟用中 ${activeStaff}`, '角色 / 階級 / 權限']}
      />

      <section className="staff-shell-v2">
        <div className="staff-command-card card">
          <div>
            <div className="staff-command-kicker"></div>
            <h3 className="staff-command-title">人員名單與資料設定。</h3>
          </div>
          <div className="staff-command-actions">
            <button type="button" className="primary-button" onClick={openCreateStaff}><UserCog className="small-icon" />新增人員</button>
            <div className="staff-command-pill"><span>啟用人員</span><strong>{activeStaff}</strong></div>
          </div>
        </div>

        <section className="staff-layout-v2">
          <div className="staff-main-v2">
            <div className="card order-panel staff-list-card-v2">
              <div className="panel-head">
                <div>
                  <div className="panel-title">人員列表</div>
                  <div className="panel-desc">人員名單。</div>
                </div>
                <span className="badge badge-role">人員名單</span>
              </div>
              <div className="staff-record-grid-v2">
                {pagedStaff.map((item: any) => (
                  <button key={item.id} type="button" className={`card data-card staff-person-card-v2 ${selectedStaffId === item.id ? 'selected' : ''}`} onClick={() => openViewStaff(item)}>
                    <div className="staff-person-top">
                      <div className="staff-person-avatar">{String(item.name || '?').slice(0, 1)}</div>
                      <div className="staff-person-meta"><div className="data-card-title">{item.name}</div><div className="data-card-subtitle">登入 ID：{item.loginId}</div></div>
                      <ChevronRight className="small-icon" />
                    </div>
                    <div className="staff-person-tags"><span className="badge badge-role">{item.role}</span><span className={getRankClass(item.rank)}>階級 / {item.rank}</span><StatusBadge enabled={item.enabled} /></div>
                    <div className="staff-person-foot"><span>{(item.permissions || []).length} 項權限</span><span>查看 / 編輯</span></div>
                  </button>
                ))}
              </div>
              <div className="pagination-row">
                <button type="button" className="ghost-button pagination-btn" onClick={() => setStaffPage((page) => Math.max(1, page - 1))} disabled={safePage === 1}><ChevronLeft className="small-icon" />上一頁</button>
                <div className="pagination-pages">
                  {pageNumbers.map((page) => (
                    <button key={page} type="button" className={`pagination-page ${safePage === page ? 'active' : ''}`} onClick={() => setStaffPage(page)}>{page}</button>
                  ))}
                </div>
                <button type="button" className="ghost-button pagination-btn" onClick={() => setStaffPage((page) => Math.min(totalPages, page + 1))} disabled={safePage === totalPages}>下一頁<ChevronRight className="small-icon" /></button>
              </div>
            </div>
          </div>

          <aside className="staff-side-v2">
            <div className="card order-panel sticky-panel staff-editor-panel-v2">
              <div className="panel-head compact-head">
                <div>
                  <div className="panel-title">{staffEditorMode === 'create' ? '新增人員' : staffEditorMode === 'edit' ? '編輯人員' : '人員詳情'}</div>
                  <div className="panel-desc">人員資料。</div>
                </div>
                <span className="badge badge-role">{staffEditorMode === 'create' ? '新增' : staffEditorMode === 'edit' ? '編輯' : '查看'}</span>
              </div>

              <div className="staff-editor-profile">
                <div className="staff-editor-avatar">{String(staffDraft.name || selectedStaff?.name || '新').slice(0,1)}</div>
                <div>
                  <div className="staff-editor-name">{staffDraft.name || '尚未命名'}</div>
                  <div className="staff-editor-sub">{staffDraft.loginId || '等待設定登入 ID'}</div>
                </div>
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
                  <span className="field-label"><BadgeCheck className="small-icon" />階級</span>
                  <select value={staffDraft.rank} onChange={(e) => updateStaffDraftField('rank', e.target.value)} disabled={staffEditorMode === 'view'}>
                    {staffRanks.map((rank: string) => <option key={rank} value={rank}>{rank}</option>)}
                  </select>
                </label>
                <label className="field-card field-span-2">
                  <span className="field-label"><KeyRound className="small-icon" />初始化密碼</span>
                  <input value={staffDraft.password} readOnly />
                </label>
              </div>

              <div className="staff-editor-state-row">
                <span className={`badge ${staffDraft.enabled ? 'badge-success' : 'badge-danger'}`}>{staffDraft.enabled ? '啟用中' : '已停用'}</span>
                {staffEditorMode !== 'view' && (
                  <>
                    <button type="button" className="ghost-button compact-btn" onClick={resetStaffPassword}><KeyRound className="small-icon" />初始化密碼</button>
                    <button type="button" className={`ghost-button compact-btn ${staffDraft.enabled ? 'danger-ghost' : 'success-ghost'}`} onClick={() => updateStaffDraftField('enabled', !staffDraft.enabled)}>{staffDraft.enabled ? '切換停用' : '切換啟用'}</button>
                  </>
                )}
              </div>

              <div className="staff-permission-card">
                <div className="staff-permission-head"><Sparkles className="small-icon" /><span>權限邏輯預覽</span></div>
                <div className="stack-list compact product-editor-notes">{staffPermissionPreview.map((item: string) => <div key={item}>{item}</div>)}</div>
              </div>

              {selectedStaff && staffEditorMode === 'view' && selectedStaff.permissions?.length ? (
                <div className="data-chip-row">{selectedStaff.permissions.map((item: string) => <span key={item} className="badge badge-soft">{item}</span>)}</div>
              ) : null}

              <div className="accounting-action-row">
                {staffEditorMode === 'view' ? (
                  <button type="button" className="primary-button full-width" onClick={() => selectedStaff && openEditStaff(selectedStaff)}><PencilLine className="small-icon" />編輯人員</button>
                ) : (
                  <>
                    <button type="button" className="primary-button" onClick={saveStaffDraft}><UserCog className="small-icon" />{staffEditorMode === 'create' ? '確認新增' : '確認更新'}</button>
                    <button type="button" className="ghost-button" onClick={() => selectedStaff ? openViewStaff(selectedStaff) : null}><Eye className="small-icon" />返回明細</button>
                  </>
                )}
              </div>
              {staffNotice && <div className={`inline-action-notice ${staffNotice.tone}`}><strong>{staffNotice.text}</strong></div>}
            </div>
          </aside>
        </section>
      </section>
    </>
  );
}
