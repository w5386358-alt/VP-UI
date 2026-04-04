export default function CustomersModule(props: any) {
  const { customers, vipCustomers, filteredCustomers, SectionIntro } = props;
  return (
    <>
      <SectionIntro
        title="客戶主資料"
        desc="先把客戶姓名、電話與客戶層級整理成較易閱讀的卡片模式，後續可直接接地址、收件方式、歷史訂單。"
        stats={[`總數 ${customers.length}`, `VIP / 代理 ${vipCustomers}`, '可延伸地址 / 配送資訊']}
      />
      <section className="record-grid customer-grid">
        {filteredCustomers.map((item: any) => (
          <div key={item.id} className="card data-card">
            <div className="data-card-top">
              <span className="badge badge-neutral">客戶資料</span>
              <span className="badge badge-soft">{item.level}</span>
            </div>
            <div className="data-card-title">{item.name}</div>
            <div className="data-card-subtitle">電話：{item.phone}</div>
            <div className="data-chip-row">
              <span className="badge badge-neutral">地址欄位待接</span>
              <span className="badge badge-neutral">歷史訂單待接</span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
