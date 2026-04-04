export default function CustomersModule(props: any) {
  const { customers, vipCustomers, filteredCustomers, SectionIntro, customerViewMode, customerScopeLabel, user } = props;
  return (
    <>
      <SectionIntro
        title="客戶主資料"
        desc="這版開始套用權限規則：核心可看全部完整資料；倉儲 / 會計只看訂單必要資訊；其他可見範圍只保留自己客戶。"
        stats={[`可見 ${customers.length}`, `VIP / 代理 ${vipCustomers}`, customerScopeLabel]}
      />
      <section className="record-grid customer-grid">
        {filteredCustomers.map((item: any) => (
          <div key={item.id} className="card data-card customer-permission-card">
            <div className="data-card-top">
              <span className="badge badge-neutral">{customerViewMode === 'full' ? '完整資料' : '必要資訊'}</span>
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
                  <span className="badge badge-neutral">僅供訂單 / 對帳 / 出貨辨識</span>
                  <span className="badge badge-neutral">已隱藏完整客資</span>
                </>
              )}
            </div>
          </div>
        ))}
      </section>
      {!filteredCustomers.length && (
        <div className="card empty-order-state">
          目前在「{user.name} / {customerScopeLabel}」視角下，沒有可顯示的客戶資料。
        </div>
      )}
    </>
  );
}