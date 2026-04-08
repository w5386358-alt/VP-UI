export default function CustomersModule(props: any) {
  const { customers, vipCustomers, filteredCustomers, SectionIntro, customerViewMode, customerScopeLabel, user } = props;
  const preview = filteredCustomers.slice(0, 4);

  return (
    <>
      <SectionIntro
        title="客戶資料"
        desc="依權限顯示完整資料或作業所需資訊。"
        stats={[`可見 ${customers.length}`, `VIP / 代理 ${vipCustomers}`, customerScopeLabel]}
      />

      <section className="customers-shell">
        <aside className="customers-side-stack">
          <div className="card customers-preview-card">
            <div className="panel-title">重點客戶預覽</div>
            <div className="customers-preview-list">
              {preview.map((item: any) => (
                <div key={item.id} className="customers-preview-row">
                  <div>
                    <div className="customers-preview-name">{item.name}</div>
                    <div className="customers-preview-meta">{item.phone}</div>
                  </div>
                  <span className="badge badge-soft">{item.level}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="card customers-main-card">
          <div className="customers-main-head">
            <div>
              <div className="panel-title">客戶列表</div>
                          </div>
            <span className="badge badge-role">{filteredCustomers.length} 筆</span>
          </div>

          <section className="record-grid customer-grid refined">
            {filteredCustomers.map((item: any) => (
              <div key={item.id} className="card data-card customer-permission-card refined-card">
                <div className="data-card-top">
                  <span className="badge badge-neutral">{customerViewMode === 'full' ? '完整' : '作業用'}</span>
                  <span className="badge badge-soft">{item.level}</span>
                </div>
                <div className="data-card-title">{item.name}</div>
                <div className="data-card-subtitle">電話：{item.phone}</div>
                <div className="customers-info-grid">
                  <div className="customers-info-box">
                    <span>負責人</span>
                    <strong>{customerViewMode === 'full' ? item.ownerName : '已隱藏'}</strong>
                  </div>
                  <div className="customers-info-box">
                    <span>登入 ID</span>
                    <strong>{customerViewMode === 'full' ? item.ownerLoginId : '作業用'}</strong>
                  </div>
                </div>
                <div className="data-chip-row">
                  {customerViewMode === 'full' ? (
                    <>
                      <span className="badge badge-neutral">可顯示完整客資</span>
                      <span className="badge badge-soft">供管理 / 對帳使用</span>
                    </>
                  ) : (
                    <>
                      <span className="badge badge-neutral">供訂單、對帳、出貨使用</span>
                      <span className="badge badge-neutral">已隱藏完整資料</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      </section>

      {!filteredCustomers.length && (
        <div className="card empty-order-state">
          「{user.name} / {customerScopeLabel}」目前沒有可顯示的客戶資料。
        </div>
      )}
    </>
  );
}
