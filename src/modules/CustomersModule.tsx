export default function CustomersModule(props: any) {
  const { customers, vipCustomers, filteredCustomers, SectionIntro, customerViewMode, customerScopeLabel, user } = props;
  return (
    <>
      <SectionIntro
        title="客戶資料"
        desc="依角色顯示完整或作業所需資料。"
        stats={[`可見 ${customers.length}`, `VIP / 代理 ${vipCustomers}`, customerScopeLabel]}
      />
      <section className="record-grid customer-grid">
        {filteredCustomers.map((item: any) => (
          <div key={item.id} className="card data-card customer-permission-card">
            <div className="data-card-top">
              <span className="badge badge-neutral">{customerViewMode === 'full' ? '完整' : '作業用'}</span>
              <span className="badge badge-soft">{item.level}</span>
            </div>
            <div className="data-card-title">{item.name}</div>
            <div className="data-card-subtitle">電話：{item.phone}</div>
            <div className="data-chip-row">
              {customerViewMode === 'full' ? (
                <>
                  <span className="badge badge-neutral">負責人 / {item.ownerName}</span>
                  <span className="badge badge-neutral">登入ID / {item.ownerLoginId}</span>
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
      {!filteredCustomers.length && (
        <div className="card empty-order-state">
          「{user.name} / {customerScopeLabel}」目前沒有可顯示的客戶資料。
        </div>
      )}
    </>
  );
}
