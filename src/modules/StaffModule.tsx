import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { UserCog, User, ShieldCheck, KeyRound, PencilLine, Eye, Sparkles, BadgeCheck, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';

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
    modulePermissionLabels,
    subpagePermissionGroups,
    actionPermissionGroups,
    openCreateStaff,
    openEditStaff,
    openViewStaff,
    updateStaffDraftField,
    updateStaffPermission,
    resetStaffPassword,
    saveStaffDraft,
  } = props;

  const [staffPage, setStaffPage] = useState(1);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);
  const portalRoot = typeof document !== 'undefined' ? document.body : null;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobileViewport(window.innerWidth <= 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!(isMobileViewport && mobileEditorOpen)) return;
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isMobileViewport, mobileEditorOpen]);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / pageSize));
  const safePage = Math.min(staffPage, totalPages);
  const pagedStaff = useMemo(() => filteredStaff.slice((safePage - 1) * pageSize, safePage * pageSize), [filteredStaff, safePage]);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  function handleOpenCreateStaff() {
    openCreateStaff();
    if (isMobileViewport) setMobileEditorOpen(true);
  }

  function handleOpenEditStaff(item: any) {
    openEditStaff(item);
    if (isMobileViewport) setMobileEditorOpen(true);
  }

  function handleOpenViewStaff(item: any) {
    openViewStaff(item);
    if (isMobileViewport) setMobileEditorOpen(true);
  }


  const staffEditorPanel = (
    <div className={`card order-panel sticky-panel staff-editor-panel-v2 mobile-modal-shell mobile-shared-layer-panel mobile-staff-editor ${mobileEditorOpen ? 'is-mobile-open' : ''}`}>
      {isMobileViewport && (
        <div className="mobile-editor-head">
          <div className="mobile-editor-title-wrap">
            <div className="mobile-editor-kicker">人員操作卡</div>
            <div className="mobile-editor-sub">新增與編輯都從這裡完成</div>
          </div>
          <button type="button" className="mobile-editor-close" onClick={() => setMobileEditorOpen(false)} aria-label="關閉人員操作卡">
            <X className="small-icon" />
          </button>
        </div>
      )}
      <div className="mobile-modal-body staff-editor-body">
        <div className="panel-head compact-head">
          <div>
            <div className="panel-title">{staffEditorMode === 'create' ? '新增中央帳號' : staffEditorMode === 'edit' ? '編輯中央帳號' : '中央帳號詳情'}</div>
            <div className="panel-desc">以中央帳號統一管理新增、停權、密碼重設與可進系統。</div>
          </div>
          <span className="badge badge-role">{staffEditorMode === 'create' ? '新增' : staffEditorMode === 'edit' ? '編輯' : '查看'}</span>
        </div>

        <div className="staff-editor-profile">
        <div className="staff-editor-avatar">{String(staffDraft.name || selectedStaff?.name || '新').slice(0,1)}</div>
        <div>
          <div className="staff-editor-name">{staffDraft.name || '尚未命名'}</div>
          <div className="staff-editor-sub">{staffDraft.email || staffDraft.loginId || '等待設定 Email'}</div>
        </div>
      </div>

      <div className="form-grid two-col form-gap-top">
        <label className="field-card">
          <span className="field-label"><User className="small-icon" />姓名</span>
          <input value={staffDraft.name} onChange={(e) => updateStaffDraftField('name', e.target.value)} readOnly={staffEditorMode === 'view'} />
        </label>
        <label className="field-card">
          <span className="field-label"><UserCog className="small-icon" />Email</span>
          <input type="email" value={staffDraft.email} onChange={(e) => updateStaffDraftField('email', e.target.value)} readOnly={staffEditorMode === 'view' || staffEditorMode === 'edit'} placeholder="登入 Email" />
        </label>
        <label className="field-card">
          <span className="field-label"><UserCog className="small-icon" />登入 ID</span>
          <input value={staffDraft.loginId} onChange={(e) => updateStaffDraftField('loginId', e.target.value)} readOnly={staffEditorMode === 'view'} placeholder="顯示用登入代號" />
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
          <span className="field-label"><KeyRound className="small-icon" />{staffEditorMode === 'create' ? '起始密碼' : '重設密碼'}</span>
          <input value={staffEditorMode === 'create' ? staffDraft.password : '••••••••'} onChange={(e) => updateStaffDraftField('password', e.target.value)} readOnly={staffEditorMode !== 'create'} placeholder={staffEditorMode === 'create' ? '至少 6 碼' : '將改為寄送重設密碼信'} />
        </label>
      </div>

      <div className="staff-editor-state-row">
        <span className={`badge ${staffDraft.enabled ? 'badge-success' : 'badge-danger'}`}>{staffDraft.enabled ? '啟用中' : '已停用'}</span>
        {staffEditorMode !== 'view' && (
          <>
            <button type="button" className="ghost-button compact-btn" onClick={resetStaffPassword}><KeyRound className="small-icon" />寄送重設密碼信</button>
            <button type="button" className={`ui-switch ${staffDraft.enabled ? 'on' : 'off'}`} onClick={() => updateStaffDraftField('enabled', !staffDraft.enabled)} aria-label={staffDraft.enabled ? '停用人員' : '啟用人員'} aria-pressed={staffDraft.enabled}>
              <span className="ui-switch-track"><span className="ui-switch-thumb" /></span>
            </button>
          </>
        )}
      </div>

      <div className="staff-permission-block">
        <div className="staff-permission-block-title">可進系統切換</div>
        <div className="staff-permission-switch-grid compact">
          <button type="button" className={`permission-switch-card ${staffDraft.apps?.vp ? 'active' : ''}`} onClick={() => staffEditorMode !== 'view' && updateStaffDraftField('apps', { ...(staffDraft.apps || { vp: true, campus: false }), vp: !staffDraft.apps?.vp })} disabled={staffEditorMode === 'view'}>
            <span>VP 系統</span>
            <span className={`mini-toggle ${staffDraft.apps?.vp ? 'on' : 'off'}`} />
          </button>
          <button type="button" className={`permission-switch-card ${staffDraft.apps?.campus ? 'active' : ''}`} onClick={() => staffEditorMode !== 'view' && updateStaffDraftField('apps', { ...(staffDraft.apps || { vp: true, campus: false }), campus: !staffDraft.apps?.campus })} disabled={staffEditorMode === 'view'}>
            <span>校園徵才</span>
            <span className={`mini-toggle ${staffDraft.apps?.campus ? 'on' : 'off'}`} />
          </button>
        </div>
      </div>

      <div className="staff-permission-card">
        <div className="staff-permission-head"><Sparkles className="small-icon" /><span>權限邏輯預覽</span></div>
        <div className="stack-list compact product-editor-notes">{staffPermissionPreview.map((item: string) => <div key={item}>{item}</div>)}</div>
      </div>

      <div className="staff-permission-manager">
        <div className="staff-permission-block">
          <div className="staff-permission-block-title">主模組權限</div>
          <div className="staff-permission-switch-grid">
            {modulePermissionLabels.map((item: any) => (
              <button key={item.key} type="button" className={`permission-switch-card ${staffDraft.permissionConfig?.modules?.[item.key] ? 'active' : ''}`} onClick={() => staffEditorMode !== 'view' && updateStaffPermission('modules', item.key, !staffDraft.permissionConfig?.modules?.[item.key])} disabled={staffEditorMode === 'view'}>
                <span>{item.label}</span>
                <span className={`mini-toggle ${staffDraft.permissionConfig?.modules?.[item.key] ? 'on' : 'off'}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="staff-permission-block">
          <div className="staff-permission-block-title">子頁權限</div>
          <div className="staff-permission-group-list">
            {subpagePermissionGroups.map((group: any) => (
              <div key={group.title} className="staff-permission-group">
                <div className="staff-permission-group-title">{group.title}</div>
                <div className="staff-permission-switch-grid compact">
                  {group.items.map((item: any) => (
                    <button key={item.key} type="button" className={`permission-switch-card ${staffDraft.permissionConfig?.subpages?.[item.key] ? 'active' : ''}`} onClick={() => staffEditorMode !== 'view' && updateStaffPermission('subpages', item.key, !staffDraft.permissionConfig?.subpages?.[item.key])} disabled={staffEditorMode === 'view'}>
                      <span>{item.label}</span>
                      <span className={`mini-toggle ${staffDraft.permissionConfig?.subpages?.[item.key] ? 'on' : 'off'}`} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="staff-permission-block">
          <div className="staff-permission-block-title">操作權限</div>
          <div className="staff-permission-group-list">
            {actionPermissionGroups.map((group: any) => (
              <div key={group.title} className="staff-permission-group">
                <div className="staff-permission-switch-grid compact">
                  {group.items.map((item: any) => (
                    <button key={item.key} type="button" className={`permission-switch-card ${staffDraft.permissionConfig?.actions?.[item.key] ? 'active' : ''}`} onClick={() => staffEditorMode !== 'view' && updateStaffPermission('actions', item.key, !staffDraft.permissionConfig?.actions?.[item.key])} disabled={staffEditorMode === 'view'}>
                      <span>{item.label}</span>
                      <span className={`mini-toggle ${staffDraft.permissionConfig?.actions?.[item.key] ? 'on' : 'off'}`} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedStaff && staffEditorMode === 'view' && selectedStaff.permissions?.length ? (
        <div className="data-chip-row">{selectedStaff.permissions.map((item: string) => <span key={item} className="badge badge-soft">{item}</span>)}</div>
      ) : null}

      <div className="accounting-action-row staff-editor-actions">
        {staffEditorMode === 'view' ? (
          <button type="button" className="primary-button full-width" onClick={() => selectedStaff && handleOpenEditStaff(selectedStaff)}><PencilLine className="small-icon" />編輯人員</button>
        ) : (
          <>
            <button type="button" className="primary-button" onClick={saveStaffDraft}><UserCog className="small-icon" />{staffEditorMode === 'create' ? '確認新增' : '確認更新'}</button>
            <button type="button" className="ghost-button" onClick={() => selectedStaff ? openViewStaff(selectedStaff) : null}><Eye className="small-icon" />返回明細</button>
          </>
        )}
      </div>
      {staffNotice && <div className={`inline-action-notice ${staffNotice.tone}`}><strong>{staffNotice.text}</strong></div>}
      </div>
    </div>
  );

  return (
    <>
      
      <section className="staff-shell-v2 staff-shell-v3">

        <section className="staff-layout-v2 staff-layout-v3">
          <div className="staff-main-v2">
            <div className="card order-panel staff-list-card-v2">
              <div className="panel-head staff-list-head-v3">
                <div>
                  <div className="panel-title">人員列表</div>
                  <div className="panel-desc">人員名單。</div>
                </div>
                <div className="staff-list-head-actions">
                  <span className="badge badge-role">啟用 {activeStaff}</span>
                  {!isMobileViewport && <button type="button" className="primary-button compact-add-button" onClick={handleOpenCreateStaff}><UserCog className="small-icon" />新增人員</button>}
                </div>
              </div>
              <div className="staff-record-grid-v2">
                {pagedStaff.map((item: any) => (
                  <div key={item.id} className={`card data-card staff-person-card-v2 ${selectedStaffId === item.id ? 'selected' : ''}`}>
                    <button type="button" className="staff-person-card-main" onClick={() => handleOpenViewStaff(item)}>
                    <div className="staff-person-top">
                      <div className="staff-person-avatar">{String(item.name || '?').slice(0, 1)}</div>
                      <div className="staff-person-meta"><div className="data-card-title">{item.name}</div><div className="data-card-subtitle">{item.email || `登入 ID：${item.loginId}`}</div></div>
                    </div>
                    <div className="staff-person-tags"><span className="badge badge-role">{item.role}</span><span className={getRankClass(item.rank)}>階級 / {item.rank}</span><StatusBadge enabled={item.enabled} /></div>
                    <div className="staff-person-foot"><span>{(item.permissions || []).length} 項權限</span><span>{item.apps?.vp ? 'VP' : '-'} / {item.apps?.campus ? 'Campus' : '-'}</span></div>
                    </button>
                    <button type="button" className="mobile-row-action-trigger staff-mobile-edit-trigger" aria-label={`編輯 ${item.name}`} onClick={() => handleOpenEditStaff(item)}>›</button>
                  </div>
                ))}
              </div>
              <div className="pagination-row pagination-row-minimal pagination-row-angle">
                <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setStaffPage((page) => Math.max(1, page - 1))} disabled={safePage === 1} aria-label="上一頁">&lt;</button>
                <div className="pagination-pages">
                  {pageNumbers.map((page) => (
                    <button key={page} type="button" className={`pagination-page ${safePage === page ? 'active' : ''}`} onClick={() => setStaffPage(page)}>{page}</button>
                  ))}
                </div>
                <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setStaffPage((page) => Math.min(totalPages, page + 1))} disabled={safePage === totalPages} aria-label="下一頁">&gt;</button>
              </div>
            </div>
          </div>

          <aside className="staff-side-v2">
            {!isMobileViewport && staffEditorPanel}
          </aside>
        </section>
      </section>
      {isMobileViewport && !mobileEditorOpen && portalRoot && createPortal(
        <button type="button" className="mobile-product-fab mobile-staff-fab" onClick={handleOpenCreateStaff} aria-label="新增人員">
          <Plus className="small-icon" />
        </button>,
        portalRoot,
      )}
      {isMobileViewport && mobileEditorOpen && portalRoot && createPortal(
        <>
          <div className="mobile-editor-backdrop shared-layer-backdrop" onClick={() => setMobileEditorOpen(false)} />
          {staffEditorPanel}
        </>,
        portalRoot,
      )}
    </>
  );
}
