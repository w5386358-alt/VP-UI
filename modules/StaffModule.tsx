export default function StaffModule(props: any) {
  const { staff, activeStaff, filteredStaff, getRankClass, SectionIntro, StatusBadge } = props;
  return (
    <>
      <SectionIntro
        title="人員管理"
        desc="承接你原本人員管理表的邏輯，這版先整理登入 ID、角色、階級與啟用狀態的視覺層級。"
        stats={[`總數 ${staff.length}`, `啟用中 ${activeStaff}`, '角色 / 階級 / 權限骨架']}
      />
      <section className="record-grid staff-grid">
        {filteredStaff.map((item: any) => (
          <div key={item.id} className="card data-card">
            <div className="data-card-top">
              <span className="badge badge-role">{item.role}</span>
              <StatusBadge enabled={item.enabled} />
            </div>
            <div className="data-card-title">{item.name}</div>
            <div className="data-card-subtitle">登入 ID：{item.loginId}</div>
            <div className="data-chip-row">
              <span className={getRankClass(item.rank)}>階級 / {item.rank}</span>
              <span className="badge badge-neutral">權限模組待接</span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}