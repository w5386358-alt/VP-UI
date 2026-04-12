import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomersModule(props: any) {
  const { filteredCustomers, customerViewMode, customerScopeLabel, user } = props;
  const [customerPage, setCustomerPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safePage = Math.min(customerPage, totalPages);
  const pagedCustomers = useMemo(() => filteredCustomers.slice((safePage - 1) * pageSize, safePage * pageSize), [filteredCustomers, safePage]);

  return (
    <>
      <section className="product-admin-layout customers-sync-layout">
        <div className="product-admin-main">
          <div className="card order-panel products-board-card customers-main-card customers-main-card-full">
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
          <div className="pagination-row pagination-row-chevron">
            <button type="button" className="ghost-button pagination-btn pagination-chevron-btn" onClick={() => setCustomerPage((page) => Math.max(1, page - 1))} disabled={safePage === 1} aria-label="上一頁"><ChevronLeft className="small-icon" /></button>
            <div className="pagination-pages pagination-pages-single">
              <span className="pagination-page active">{safePage}</span>
            </div>
            <button type="button" className="ghost-button pagination-btn pagination-chevron-btn" onClick={() => setCustomerPage((page) => Math.min(totalPages, page + 1))} disabled={safePage === totalPages} aria-label="下一頁"><ChevronRight className="small-icon" /></button>
          </div>
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
