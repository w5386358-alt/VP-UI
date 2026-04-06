import { Package, Sparkles, FileText, Wallet, Boxes, PencilLine, Eye, Trash2, Image as ImageIcon } from 'lucide-react';

export default function ProductsModule(props: any) {
  const {
    products,
    enabledProducts,
    productNotice,
    selectedProductId,
    filteredProducts,
    openCreateProduct,
    openViewProduct,
    openEditProduct,
    toggleProductEnabled,
    deleteProduct,
    productEditorMode,
    productDraft,
    setProductDraft,
    saveProductDraft,
    selectedProduct,
    productCategories,
    SectionIntro,
    StatusBadge,
  } = props;

  return (
    <>
      <SectionIntro
        title="商品管理"
        desc="商品資料、價格、庫存與狀態。"
        stats={[`總數 ${products.length}`, `啟用 ${enabledProducts}`, `停用 ${products.length - enabledProducts}`]}
      />

      {productNotice && (
        <div className={`card product-notice-banner ${productNotice.tone}`}>
          <strong>{productNotice.text}</strong>
        </div>
      )}

      <section className="product-admin-layout">
        <div className="product-admin-main">
          <div className="card order-panel">
            <div className="panel-head">
              <div>
                <div className="panel-title">商品列表</div>
                <div className="panel-desc">查看商品、價格、庫存與狀態。</div>
              </div>
              <button type="button" className="primary-button" onClick={openCreateProduct}>
                <Package className="small-icon" />新增商品
              </button>
            </div>

            <div className="product-editor-chip-row">
              <span className="badge badge-neutral">商品列表</span>
              <span className="badge badge-soft">卡片檢視</span>
              <span className="badge badge-soft">編輯面板</span>
            </div>

            <div className="product-admin-grid">
              {filteredProducts.map((item: any) => (
                <div key={item.id} className={`card data-card product-admin-card ${selectedProductId === item.id ? 'selected' : ''}`}>
                  <div className="data-card-top">
                    <span className="data-code">{item.code}</span>
                    <StatusBadge enabled={item.enabled} />
                  </div>
                  <div className="product-image-slot">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="product-image" />
                    ) : (
                      <div className="product-image-placeholder">
                        <ImageIcon className="small-icon" />
                        <span>商品圖片</span>
                      </div>
                    )}
                  </div>
                  <div className="data-card-title">{item.name}</div>
                  <div className="data-card-subtitle">{item.category} / 條碼 {item.barcode || '未設定'}</div>
                  <div className="metric-row three">
                    <div className="metric-box"><span>VIP價</span><strong>${item.vipPrice ?? item.price}</strong></div>
                    <div className="metric-box"><span>代理價</span><strong>${item.agentPrice ?? item.price}</strong></div>
                    <div className="metric-box"><span>總代理</span><strong>${item.generalAgentPrice ?? item.price}</strong></div>
                  </div>
                  <div className="metric-row three product-stock-row">
                    <div className="metric-box"><span>目前狀態</span><strong>{item.enabled ? '可販售' : '停用'}</strong></div>
                    <div className="metric-box"><span>庫存</span><strong>{item.stock}</strong></div>
                    <div className="metric-box"><span>狀態</span><strong>{item.enabled ? '啟用' : '停用'}</strong></div>
                  </div>

                  <div className="product-card-actions">
                    <button type="button" className="ghost-button compact-btn" onClick={() => openViewProduct(item)}>
                      <Eye className="small-icon" />查看
                    </button>
                    <button type="button" className="ghost-button compact-btn" onClick={() => openEditProduct(item)}>
                      <PencilLine className="small-icon" />編輯
                    </button>
                    <button type="button" className={`ghost-button compact-btn ${item.enabled ? 'danger-ghost' : 'success-ghost'}`} onClick={() => toggleProductEnabled(item)}>
                      {item.enabled ? '停用' : '啟用'}
                    </button>
                    <button type="button" className="ghost-button compact-btn danger-ghost" onClick={() => deleteProduct(item)}>
                      <Trash2 className="small-icon" />刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="product-admin-side">
          <div className="card order-panel sticky-panel product-editor-panel">
            <div className="panel-head compact-head">
              <div>
                <div className="panel-title">{productEditorMode === 'create' ? '新增商品' : productEditorMode === 'edit' ? '商品編輯' : '商品詳情'}</div>
                <div className="panel-desc">在這裡編輯商品資料。</div>
              </div>
              <span className="badge badge-role">{productEditorMode === 'create' ? '新增' : productEditorMode === 'edit' ? '編輯' : '查看'}</span>
            </div>

            <div className="form-grid two-col form-gap-top">
              <label className="field-card">
                <span className="field-label"><Package className="small-icon" />商品編號</span>
                <input value={productDraft.code} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, code: e.target.value }))} readOnly={productEditorMode === 'view'} />
              </label>
              <label className="field-card">
                <span className="field-label"><Sparkles className="small-icon" />商品分類</span>
                <select value={productDraft.category} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, category: e.target.value }))} disabled={productEditorMode === 'view'}>
                  {productCategories.map((category: string) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="field-card">
                <span className="field-label"><FileText className="small-icon" />商品條碼</span>
                <input value={productDraft.barcode || ''} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, barcode: e.target.value }))} readOnly={productEditorMode === 'view'} placeholder="請輸入商品條碼" />
              </label>
              <label className="field-card field-span-2">
                <span className="field-label"><FileText className="small-icon" />商品名稱</span>
                <input value={productDraft.name} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, name: e.target.value }))} readOnly={productEditorMode === 'view'} />
              </label>
              <label className="field-card">
                <span className="field-label"><Wallet className="small-icon" />價格</span>
                <input type="number" min={0} value={productDraft.price} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, price: e.target.value }))} readOnly={productEditorMode === 'view'} />
              </label>
              <label className="field-card">
                <span className="field-label"><Boxes className="small-icon" />庫存</span>
                <input type="number" min={0} value={productDraft.stock} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, stock: e.target.value }))} readOnly={productEditorMode === 'view'} />
              </label>
            </div>

            <div className="product-editor-status">
              <span className={`badge ${productDraft.enabled ? 'badge-success' : 'badge-danger'}`}>{productDraft.enabled ? '啟用中' : '已停用'}</span>
              {productEditorMode !== 'view' && (
                <button type="button" className={`ghost-button compact-btn ${productDraft.enabled ? 'danger-ghost' : 'success-ghost'}`} onClick={() => setProductDraft((prev: any) => ({ ...prev, enabled: !prev.enabled }))}>
                  {productDraft.enabled ? '切換停用' : '切換啟用'}
                </button>
              )}
            </div>

            <div className="stack-list compact product-editor-notes">
              <div>商品資料編輯</div>
              <div>支援新增、編輯、查看與狀態切換</div>
              <div>圖片與資料同步</div>
            </div>

            <div className="accounting-action-row">
              {productEditorMode === 'view' ? (
                <button type="button" className="primary-button full-width" onClick={() => selectedProduct && openEditProduct(selectedProduct)}>
                  <PencilLine className="small-icon" />編輯商品
                </button>
              ) : (
                <>
                  <button type="button" className="primary-button" onClick={saveProductDraft}>
                    <Package className="small-icon" />{productEditorMode === 'create' ? '確認新增' : '確認更新'}
                  </button>
                  <button type="button" className="ghost-button" onClick={() => selectedProduct ? openViewProduct(selectedProduct) : null}>
                    <Eye className="small-icon" />返回明細
                  </button>
                  {productEditorMode === 'edit' && selectedProduct && (
                    <button type="button" className="ghost-button danger-ghost" onClick={() => deleteProduct(selectedProduct)}>
                      <Trash2 className="small-icon" />刪除商品
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
