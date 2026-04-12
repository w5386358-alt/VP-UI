import { useEffect, useMemo, useState } from 'react';
import { scanWithCamera } from '../utils/nativeScanner';
import { Package, Sparkles, FileText, Wallet, Boxes, PencilLine, Eye, Image as ImageIcon, ScanLine, X, Plus } from 'lucide-react';

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
    productEditorMode,
    productDraft,
    setProductDraft,
    saveProductDraft,
    selectedProduct,
    productCategories,
    handleProductImageUpload,
    productImageInputRef,
    SectionIntro,
    StatusBadge,
  } = props;

  const uploadSymbol = '/icons/upload-symbol.svg';
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobileViewport(window.innerWidth <= 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const disabledProducts = products.length - enabledProducts;
  const topProducts = filteredProducts.slice(0, 3);
  const [productPage, setProductPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(productPage, totalPages);
  const pagedProducts = useMemo(() => filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize), [filteredProducts, safePage]);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  async function handleScanBarcode() {
    const value = await scanWithCamera({ title: '商品條碼掃描', fallbackLabel: '商品條碼' });
    if (value) setProductDraft((prev: any) => ({ ...prev, barcode: value }));
  }

  function handleOpenCreateProduct() {
    openCreateProduct();
    if (isMobileViewport) setMobileEditorOpen(true);
  }

  function handleOpenViewProduct(item: any) {
    openViewProduct(item);
    if (isMobileViewport) setMobileEditorOpen(true);
  }

  function handleOpenEditProduct(item: any) {
    openEditProduct(item);
    if (isMobileViewport) setMobileEditorOpen(true);
  }

  function handleOpenSelectedEdit() {
    if (!selectedProduct) return;
    openEditProduct(selectedProduct);
    if (isMobileViewport) setMobileEditorOpen(true);
  }

  return (
    <>

      <section className="product-admin-layout products-stage-layout">
        <div className="product-admin-main">
          <div className="card order-panel products-board-card">
            <div className="panel-head">
              <div>
                <div className="panel-title">商品列表</div>
              </div>
              {!isMobileViewport && (<button type="button" className="primary-button" onClick={handleOpenCreateProduct}>
                <Package className="small-icon" />新增商品
              </button>)}
            </div>

            <div className="product-admin-grid products-card-grid">
              {pagedProducts.map((item: any) => (
                <div key={item.id} className={`card data-card product-admin-card products-feature-card ${selectedProductId === item.id ? 'selected' : ''} ${isMobileViewport ? 'mobile-edit-card' : ''}`} onClick={isMobileViewport ? () => handleOpenEditProduct(item) : undefined} role={isMobileViewport ? 'button' : undefined} tabIndex={isMobileViewport ? 0 : undefined} onKeyDown={isMobileViewport ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpenEditProduct(item); } } : undefined}>
                  <div className="data-card-top">
                    <span className="data-code">{item.code}</span>
                    <div className="product-card-top-actions">
                      <StatusBadge enabled={item.enabled} />

                    </div>
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
                  <div className="metric-row three products-metric-grid">
                    <div className="metric-box"><span>原價</span><strong>${item.price}</strong></div>
                    <div className="metric-box"><span>VIP價</span><strong>${item.vipPrice ?? item.price}</strong></div>
                    <div className="metric-box"><span>代理價</span><strong>${item.agentPrice ?? item.price}</strong></div>
                  </div>
                  <div className="metric-row three product-stock-row products-metric-grid">
                    <div className="metric-box"><span>總代理價</span><strong>${item.generalAgentPrice ?? item.price}</strong></div>
                    <div className="metric-box"><span>庫存</span><strong>{item.stock}</strong></div>
                    <div className="metric-box"><span>狀態</span><strong>{item.enabled ? '啟用' : '停用'}</strong></div>
                  </div>

                  <div className="product-card-actions">
                    {!isMobileViewport && (<>
                      <button type="button" className="ghost-button compact-btn" onClick={() => handleOpenViewProduct(item)}>
                        <Eye className="small-icon" />查看
                      </button>
                      <button type="button" className="ghost-button compact-btn" onClick={() => handleOpenEditProduct(item)}>
                        <PencilLine className="small-icon" />編輯
                      </button>
                    </>)}
                    <button type="button" className={`ui-switch ${item.enabled ? 'on' : 'off'}`} onClick={() => toggleProductEnabled(item)} aria-label={item.enabled ? '停用商品' : '啟用商品'} aria-pressed={item.enabled}>
                      <span className="ui-switch-track"><span className="ui-switch-thumb" /></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination-row pagination-row-minimal pagination-row-angle">
              <button type="button" className="ghost-button pagination-btn angle-only" onClick={() => setProductPage((page) => Math.max(1, page - 1))} disabled={safePage === 1} aria-label="上一頁">&lt;</button>
              <div className="pagination-pages">
                {pageNumbers.map((page) => (
                  <button key={page} type="button" className={`pagination-page ${safePage === page ? 'active' : ''}`} onClick={() => setProductPage(page)}>{page}</button>
                ))}
              </div>
            </div>
            {productNotice && <div className={`inline-action-notice ${productNotice.tone}`}><strong>{productNotice.text}</strong></div>}
          </div>
        </div>

        <aside className="product-admin-side">
          <div className={`card order-panel sticky-panel product-editor-panel products-editor-shell ${isMobileViewport ? 'mobile-editor-shell' : ''} ${mobileEditorOpen ? 'is-open' : ''}`}>
            {isMobileViewport && (
              <div className="mobile-editor-head">
                <div className="mobile-editor-title-wrap">
                  <div className="mobile-editor-kicker">商品操作卡</div>
                  <div className="mobile-editor-sub">新增、查看、編輯都集中在這裡</div>
                </div>
                <button type="button" className="mobile-editor-close" onClick={() => setMobileEditorOpen(false)} aria-label="關閉商品操作卡">
                  <X className="small-icon" />
                </button>
              </div>
            )}
            <div className="panel-head compact-head">
              <div>
                <div className="panel-title">{productEditorMode === 'create' ? '新增商品' : productEditorMode === 'edit' ? '商品編輯' : '商品詳情'}</div>
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
              <label className="field-card scanner-inline-card">
                <span className="field-label"><FileText className="small-icon" />商品條碼</span>
                <div className="scanner-input-wrap">
                  <input value={productDraft.barcode || ''} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, barcode: e.target.value }))} readOnly={productEditorMode === 'view'} placeholder="請輸入商品條碼" />
                  {productEditorMode !== 'view' && <button type="button" className="scan-inline-icon-btn" onClick={handleScanBarcode} aria-label="掃描商品條碼"><ScanLine className="small-icon" /></button>}
                </div>
              </label>
              <label className="field-card field-span-2">
                <span className="field-label"><FileText className="small-icon" />商品名稱</span>
                <input value={productDraft.name} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, name: e.target.value }))} readOnly={productEditorMode === 'view'} />
              </label>
              <label className="field-card">
                <span className="field-label"><Wallet className="small-icon" />原價</span>
                <input type="number" min={0} value={productDraft.price} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, price: e.target.value }))} readOnly={productEditorMode === 'view'} placeholder="請輸入原價" />
              </label>
              <label className="field-card">
                <span className="field-label"><Wallet className="small-icon" />VIP價</span>
                <input type="number" min={0} value={productDraft.vipPrice || ''} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, vipPrice: e.target.value }))} readOnly={productEditorMode === 'view'} placeholder="請輸入VIP價" />
              </label>
              <label className="field-card">
                <span className="field-label"><Wallet className="small-icon" />代理價</span>
                <input type="number" min={0} value={productDraft.agentPrice || ''} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, agentPrice: e.target.value }))} readOnly={productEditorMode === 'view'} placeholder="請輸入代理價" />
              </label>
              <label className="field-card">
                <span className="field-label"><Wallet className="small-icon" />總代理價</span>
                <input type="number" min={0} value={productDraft.generalAgentPrice || ''} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, generalAgentPrice: e.target.value }))} readOnly={productEditorMode === 'view'} placeholder="請輸入總代理價" />
              </label>
              <label className="field-card">
                <span className="field-label"><Boxes className="small-icon" />庫存</span>
                <input type="number" min={0} value={productDraft.stock} onChange={(e) => setProductDraft((prev: any) => ({ ...prev, stock: e.target.value }))} readOnly={productEditorMode === 'view'} />
              </label>
              <div className="field-card field-span-2 upload-field-card">
                <span className="field-label"><ImageIcon className="small-icon" />商品圖片</span>
                <div className="upload-panel">
                  <div className="upload-preview-box">
                    {productDraft.image ? <img src={productDraft.image} alt={productDraft.name || '商品圖片'} className="upload-preview-image" /> : <div className="upload-preview-empty">尚未上傳圖片</div>}
                  </div>
                  {productEditorMode !== 'view' && (
                    <>
                      <input ref={productImageInputRef} type="file" accept="image/*" className="hidden-file-input" onChange={(e) => handleProductImageUpload(e.target.files?.[0] || null)} />
                      <div className="upload-action-row">
                        <button type="button" className="ghost-button compact-btn upload-icon-button" onClick={() => productImageInputRef?.current?.click()}>
                          <img src={uploadSymbol} alt="上傳" className="upload-symbol-icon" />上傳商品圖片
                        </button>
                        {productDraft.image && <button type="button" className="ghost-button compact-btn" onClick={() => setProductDraft((prev: any) => ({ ...prev, image: '' }))}>移除圖片</button>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="product-editor-status product-editor-status-clean">
              <span className={`badge ${productDraft.enabled ? 'badge-success' : 'badge-danger'}`}>{productDraft.enabled ? '啟用中' : '已停用'}</span>
              {productEditorMode !== 'view' && (
                <button type="button" className={`ui-switch ${productDraft.enabled ? 'on' : 'off'}`} onClick={() => setProductDraft((prev: any) => ({ ...prev, enabled: !prev.enabled }))} aria-label={productDraft.enabled ? '停用商品' : '啟用商品'} aria-pressed={productDraft.enabled}>
                  <span className="ui-switch-track"><span className="ui-switch-thumb" /></span>
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
                <button type="button" className="primary-button full-width" onClick={handleOpenSelectedEdit}>
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
                </>
              )}
            </div>
            {productNotice && <div className={`inline-action-notice ${productNotice.tone}`}><strong>{productNotice.text}</strong></div>}
          </div>
        </aside>
      </section>

      {isMobileViewport && !mobileEditorOpen && (
        <button type="button" className="mobile-product-fab" onClick={handleOpenCreateProduct} aria-label="新增商品">
          <Plus className="small-icon" />
        </button>
      )}

      {isMobileViewport && mobileEditorOpen && <div className="mobile-editor-backdrop" onClick={() => setMobileEditorOpen(false)} />}
    </>
  );
}
