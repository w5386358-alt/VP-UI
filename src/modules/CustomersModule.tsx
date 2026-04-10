import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomersModule(props: any) {
  const { filteredCustomers, customerViewMode, customerScopeLabel, user } = props;
  const [customerPage, setCustomerPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safePage = Math.min(customerPage, totalPages);
  const pagedCustomers = useMemo(() => filteredCustomers.slice((safePage - 1) * pageSize, safePage * pageSize), [filteredCustomers, safePage]);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <>
      <section className="customers-shell customers-shell-clean">
        <div className="card customers-main-card customers-main-card-full">
          <div className="customers-main-head">
            <div>
              <div className="panel-title">客戶列表</div>
            </div>
            <span className="badge badge-role">{filteredCustomers.length} 筆</span>
          </div>

          <section className="record-grid customer-grid refined">
            {pagedCustomers.map((item: any) => (
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
          <div className="pagination-row">
            <button type="button" className="ghost-button pagination-btn" onClick={() => setCustomerPage((page) => Math.max(1, page - 1))} disabled={safePage === 1}><ChevronLeft className="small-icon" />上一頁</button>
            <div className="pagination-pages">
              {pageNumbers.map((page) => (
                <button key={page} type="button" className={`pagination-page ${safePage === page ? 'active' : ''}`} onClick={() => setCustomerPage(page)}>{page}</button>
              ))}
            </div>
            <button type="button" className="ghost-button pagination-btn" onClick={() => setCustomerPage((page) => Math.min(totalPages, page + 1))} disabled={safePage === totalPages}>下一頁<ChevronRight className="small-icon" /></button>
          </div>
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
