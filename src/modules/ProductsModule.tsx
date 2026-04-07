<html lang="zh-Hant"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          "colors": {
            "on-primary-fixed-variant": "#8c0a44",
            "error-container": "#ffdad6",
            "on-secondary": "#ffffff",
            "on-tertiary": "#ffffff",
            "tertiary-fixed-dim": "#b8cbc0",
            "on-error-container": "#93000a",
            "on-error": "#ffffff",
            "surface-bright": "#fdf8f9",
            "primary-fixed-dim": "#ffb1c4",
            "primary-container": "#ca4172",
            "inverse-on-surface": "#f4eff0",
            "secondary-container": "#feadc8",
            "on-background": "#1c1b1c",
            "on-surface": "#1c1b1c",
            "on-primary-container": "#fffbff",
            "background": "#fdf8f9",
            "primary": "#a92759",
            "tertiary-fixed": "#d3e7dc",
            "primary-fixed": "#ffd9e1",
            "tertiary": "#4e6057",
            "on-secondary-fixed": "#39071f",
            "outline-variant": "#ddbfc5",
            "on-primary-fixed": "#3f001a",
            "secondary": "#8b4a62",
            "on-secondary-container": "#7a3d54",
            "surface-dim": "#ddd9da",
            "error": "#ba1a1a",
            "on-surface-variant": "#574146",
            "surface-variant": "#e6e1e2",
            "on-tertiary-container": "#f5fff7",
            "inverse-surface": "#313031",
            "inverse-primary": "#ffb1c4",
            "surface-container-low": "#f7f2f3",
            "on-tertiary-fixed-variant": "#394b42",
            "surface-container-lowest": "#ffffff",
            "outline": "#8a7076",
            "surface-tint": "#ad2a5c",
            "surface-container-highest": "#e6e1e2",
            "on-secondary-fixed-variant": "#6f334a",
            "on-tertiary-fixed": "#0e1f18",
            "surface-container-high": "#ece7e8",
            "tertiary-container": "#66796f",
            "surface": "#fdf8f9",
            "secondary-fixed-dim": "#ffb0ca",
            "on-primary": "#ffffff",
            "surface-container": "#f1edee",
            "secondary-fixed": "#ffd9e3"
          },
          "borderRadius": {
            "DEFAULT": "1rem",
            "lg": "2rem",
            "xl": "3rem",
            "full": "9999px"
          },
          "fontFamily": {
            "headline": ["Plus Jakarta Sans"],
            "body": ["Manrope"],
            "label": ["Manrope"]
          }
        },
      },
    }
  </script>
<style>
    body { background-color: #fdf8f9; font-family: 'Manrope', sans-serif; }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    .perspective-glass { background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(20px); }
  </style>
</head>
<body class="text-on-surface">
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-screen w-64 rounded-r-[32px] bg-white/92 backdrop-blur-xl flex flex-col py-8 gap-2 shadow-[20px_0_40px_rgba(219,166,185,0.1)] z-50">
<div class="px-8 mb-8">
<div class="text-2xl font-black text-[#a92759] font-headline">Velvet Pulse</div>
<div class="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-label">Enterprise Resource Planning</div>
</div>
<nav class="flex-1 space-y-1">
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-medium">總覽</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">shopping_cart</span>
<span class="font-medium">訂購</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">inventory_2</span>
<span class="font-medium">倉儲</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">account_balance_wallet</span>
<span class="font-medium">會計中心</span>
</a>
<!-- Active Item: 商品 -->
<a class="bg-gradient-to-br from-[#a92759] to-[#ca4172] text-white rounded-full mx-4 py-3 px-6 shadow-lg flex items-center gap-3" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">inventory</span>
<span class="font-bold">商品</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">groups</span>
<span class="font-medium">客戶</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">badge</span>
<span class="font-medium">人員</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">account_circle</span>
<span class="font-medium">個人資料</span>
</a>
</nav>
<div class="px-8 mt-auto">
<button class="w-full bg-primary text-white py-4 rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
<span class="material-symbols-outlined">add</span>
        New Entry
      </button>
</div>
</aside>
<!-- TopNavBar -->
<header class="fixed top-0 right-0 w-full z-40 bg-[#fdf8f9] flex justify-between items-center h-16 px-8 ml-64 shadow-[0_18px_50px_rgba(219,166,185,0.14)]">
<div class="flex items-center gap-4 flex-1">
<div class="relative w-96">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">search</span>
<input class="w-full pl-12 pr-4 py-2 bg-surface-container-high border-none rounded-full focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" placeholder="搜尋商品名稱或編碼..." type="text"/>
</div>
</div>
<div class="flex items-center gap-6">
<button class="text-stone-500 hover:text-primary transition-colors">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-stone-500 hover:text-primary transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
<div class="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
<div class="text-right">
<p class="text-sm font-bold text-on-surface">Admin User</p>
<p class="text-[10px] text-stone-500 uppercase tracking-wider">Administrator</p>
</div>
<img alt="Administrator Profile" class="w-10 h-10 rounded-full border-2 border-primary-container" data-alt="professional headshot of a person with a clean background and soft studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2G6J1byVucX8AQkJTHFr8PsXf8d_y2kgv4KUPXjEzIxy7liZHDt6seNqcXfWeqLpDF_1bnIGShmuSpUMRdGEk7LWye6kry24jgPhDGUmxoVVep7m7GwmN_daxbTugSAIWeq7DSparSrDV_rWceceCO586PconIAekOFo3J06c9T4Pn0a2hi7_zvTM-pZ90nIhF70EfUR0eZujfMTgoHN42d6ocC_EHvuRkCoGPc-v4esbewn9Qnv5zc1v4Net8SUH5mAykaf6IUpd"/>
</div>
</div>
</header>
<!-- Main Content Area -->
<main class="ml-64 pt-24 px-8 pb-12 grid grid-cols-12 gap-8">
<!-- Left: Products Grid Section -->
<section class="col-span-12 lg:col-span-8">
<div class="flex justify-between items-end mb-8">
<div>
<h1 class="text-3xl font-headline font-extrabold text-on-surface tracking-tight">商品管理</h1>
<p class="text-stone-500 font-body">當前共有 128 項庫存商品</p>
</div>
<div class="flex gap-2 bg-surface-container-low p-1 rounded-full">
<button class="p-2 bg-white text-primary rounded-full shadow-sm">
<span class="material-symbols-outlined">grid_view</span>
</button>
<button class="p-2 text-stone-400 hover:text-primary transition-colors">
<span class="material-symbols-outlined">list</span>
</button>
</div>
</div>
<!-- Filters Row -->
<div class="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
<button class="px-6 py-2 bg-primary text-white rounded-full whitespace-nowrap">全部商品</button>
<button class="px-6 py-2 bg-white text-stone-600 rounded-full hover:bg-surface-container-low transition-colors border border-outline-variant/10 whitespace-nowrap">臉部護理</button>
<button class="px-6 py-2 bg-white text-stone-600 rounded-full hover:bg-surface-container-low transition-colors border border-outline-variant/10 whitespace-nowrap">身體精油</button>
<button class="px-6 py-2 bg-white text-stone-600 rounded-full hover:bg-surface-container-low transition-colors border border-outline-variant/10 whitespace-nowrap">限量套組</button>
<button class="px-6 py-2 bg-white text-stone-600 rounded-full hover:bg-surface-container-low transition-colors border border-outline-variant/10 whitespace-nowrap">促銷中</button>
</div>
<!-- Bento Grid / Product Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
<!-- Product Card 1 -->
<div class="group bg-white rounded-lg p-6 shadow-[0_4px_20px_rgba(219,166,185,0.06)] hover:shadow-xl transition-all duration-300 cursor-pointer border border-outline-variant/5">
<div class="relative mb-4 aspect-square rounded-md overflow-hidden bg-surface-container-low">
<img alt="Product Image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="minimalist glass bottle of skin serum on a neutral beige background with soft shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEIh0owLluW2nawNswxO-_cXCCsvyV14Z08iND-17seWOfFuF1ILufTHQP7T6Xe3LlSzM2HZY_IoqyxbLGyrb5WqoEhXvHQMOjn4Q9p0ZBVCfxCtwsF3eO6Hh_yglS6PyCKBh1DTVN_ZYz3b8qXDTW_2lHeDuLug-Pv71_sH667P-R9ysHG7GMRDTMS7IBmzUfjv8BZ_fhKGjf4Hn1q3cbgB6VS2C3P7zj2QN0LZXe22viYidQJxPmdCY1TwQvBSabXUGVCgqAMoYp"/>
<div class="absolute top-3 left-3 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary">VP-F01</div>
</div>
<div class="flex justify-between items-start mb-2">
<h3 class="font-headline font-bold text-lg">極緻修復精華液</h3>
<span class="text-primary-container font-bold">$1,280</span>
</div>
<p class="text-xs text-stone-400 mb-4 font-body leading-relaxed">深層修復受損肌膚，維持全天候水嫩透亮感。</p>
<div class="flex justify-between items-center pt-4 border-t border-outline-variant/10">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-tertiary">inventory</span>
<span class="text-sm font-medium text-stone-600">庫存: 42</span>
</div>
<button class="text-stone-300 hover:text-primary transition-colors">
<span class="material-symbols-outlined">edit_square</span>
</button>
</div>
</div>
<!-- Product Card 2 -->
<div class="group bg-white rounded-lg p-6 shadow-[0_4px_20px_rgba(219,166,185,0.06)] hover:shadow-xl transition-all duration-300 cursor-pointer border border-outline-variant/5">
<div class="relative mb-4 aspect-square rounded-md overflow-hidden bg-surface-container-low">
<img alt="Product Image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="luxury candle in a dark glass jar surrounded by lavender sprigs on a rustic wooden table" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrosNL0twJKqdICZEgtBaqKvYbNHWWaEN7xIgbAW8YEjej3B2-Trmdllvpe-GtlAB5-ZHpJ35mlG_b8XJYUBn_eKqop1RRzWHRT6l9Pkt2wHGDDTj5Lgf8-lv1Foogv3-cCQ5CFE3Gi2r3mMpSTv7rafhhw-ki9NK5yC0NdumKL1FHsNx5YK8pGpms6nqHm4u0Dz8Ul5J0MkmzKGNfeZ_MAHe-mBHnK0SYUabyDvOC4CFvWaJxc2QCtl1nxfxrWM-UzcYgnhIglca-"/>
<div class="absolute top-3 left-3 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary">VP-B05</div>
</div>
<div class="flex justify-between items-start mb-2">
<h3 class="font-headline font-bold text-lg">薰衣草舒緩按摩油</h3>
<span class="text-primary-container font-bold">$850</span>
</div>
<p class="text-xs text-stone-400 mb-4 font-body leading-relaxed">選用頂級法國薰衣草，釋放整日壓力與疲憊。</p>
<div class="flex justify-between items-center pt-4 border-t border-outline-variant/10">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-tertiary">inventory</span>
<span class="text-sm font-medium text-stone-600">庫存: 18</span>
</div>
<button class="text-stone-300 hover:text-primary transition-colors">
<span class="material-symbols-outlined">edit_square</span>
</button>
</div>
</div>
<!-- Product Card 3 -->
<div class="group bg-white rounded-lg p-6 shadow-[0_4px_20px_rgba(219,166,185,0.06)] hover:shadow-xl transition-all duration-300 cursor-pointer border border-outline-variant/5">
<div class="relative mb-4 aspect-square rounded-md overflow-hidden bg-surface-container-low">
<img alt="Product Image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="organic facial cream in a white tub on a green leaf with bright natural morning sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW7Ce0TUgkaqF-5Jfp3a33faqoF8nQqL3iUDHV9Ii4YnTj3HpLlbhz3crzY74ncszY6pKfvNdolnU3xe8K-Xg41THUBpGR-WZsZZJzRIX1nPo_YjF-FdJhcEmqYmldaudtfnlp4mOmn6VsV81h-kaII6gMDMwYmaLuHFW1qP3pOKfZiWk1CkOHct0j4bL3NWgT1xjSnnCJfknNq4lpr-rqz0H3APr6bbu6gj9ESAoAtT-Lcy-eO3lfPnFdgqKFHhOgHV8V4dOgHBHa"/>
<div class="absolute top-3 left-3 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary">VP-F22</div>
</div>
<div class="flex justify-between items-start mb-2">
<h3 class="font-headline font-bold text-lg">海洋胜肽緊緻霜</h3>
<span class="text-primary-container font-bold">$3,600</span>
</div>
<p class="text-xs text-stone-400 mb-4 font-body leading-relaxed">富含深海活性成分，精確對抗歲月痕跡。</p>
<div class="flex justify-between items-center pt-4 border-t border-outline-variant/10">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-tertiary">inventory</span>
<span class="text-sm font-medium text-stone-600">庫存: 5</span>
</div>
<button class="text-stone-300 hover:text-primary transition-colors">
<span class="material-symbols-outlined">edit_square</span>
</button>
</div>
</div>
<!-- Product Card 4 -->
<div class="group bg-white rounded-lg p-6 shadow-[0_4px_20px_rgba(219,166,185,0.06)] hover:shadow-xl transition-all duration-300 cursor-pointer border border-outline-variant/5">
<div class="relative mb-4 aspect-square rounded-md overflow-hidden bg-surface-container-low">
<img alt="Product Image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="collection of small aromatherapy oil bottles with cork stoppers on a dark stone surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKchl2PNeh_EGnD2A6Kj2IAxir99N2PyvEDYtSpn2SP5xjYNg8wQN7eejJuIF9czXSsWOzSxZz2mgC-E5CrPO2eOMLNrYQjvm_GpeJuGZvyyl6FnH5knvD0U9vWbcpDdpZk0DHcUURWHTgR_acnYrOMXkA-w2KnHkhpYnESVFGOsm2QXZr69Su2PLeXOg_CjX_oN1qs4fStzTMrcA8xMFtDvc4QZ62EGAiNOCK-XA5yic4b32svbAXcWHMQ0rsEKkfiJKAz6byDPQz"/>
<div class="absolute top-3 left-3 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary">VP-K09</div>
</div>
<div class="flex justify-between items-start mb-2">
<h3 class="font-headline font-bold text-lg">晨曦活力精油組</h3>
<span class="text-primary-container font-bold">$2,100</span>
</div>
<p class="text-xs text-stone-400 mb-4 font-body leading-relaxed">三款精選提神精油，喚醒肌膚與感官活力。</p>
<div class="flex justify-between items-center pt-4 border-t border-outline-variant/10">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-tertiary">inventory</span>
<span class="text-sm font-medium text-stone-600">庫存: 88</span>
</div>
<button class="text-stone-300 hover:text-primary transition-colors">
<span class="material-symbols-outlined">edit_square</span>
</button>
</div>
</div>
<!-- New Product Placeholder -->
<div class="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 flex flex-col items-center justify-center text-stone-400 hover:border-primary/40 hover:text-primary transition-all cursor-pointer bg-surface-container-low/30">
<span class="material-symbols-outlined text-4xl mb-2">add_circle</span>
<p class="font-bold">新增商品項目</p>
</div>
</div>
</section>
<!-- Right: Detailed Edit Panel -->
<aside class="col-span-12 lg:col-span-4">
<div class="bg-white rounded-lg p-8 shadow-[0_18px_50px_rgba(219,166,185,0.14)] sticky top-24">
<div class="flex justify-between items-center mb-8">
<h2 class="text-xl font-headline font-bold text-on-surface">編輯詳細資訊</h2>
<button class="text-stone-400 hover:text-error transition-colors">
<span class="material-symbols-outlined">delete</span>
</button>
</div>
<!-- Image Upload/Preview Section -->
<div class="mb-8">
<label class="block text-[10px] font-label uppercase tracking-widest text-stone-400 mb-3">商品圖片預覽</label>
<div class="relative group aspect-video rounded-lg overflow-hidden bg-surface-container-high border-2 border-dashed border-outline-variant/20 flex items-center justify-center">
<img alt="Current Product" class="w-full h-full object-cover" data-alt="detailed product shot of a high-end skincare serum bottle in warm soft focus" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAeRka2nDFVl_uUCaatVR1ui3LRLTprZxb1AYDN8to_GZ1slEMoPQrTZ8ZvTIDttMnNVIEkh5d5ymB_thJ0J826vxL0ML4EixCQQZu8XmDxr6C_Spp_61LGO5HMcIVPS5bOKdQoCrEysd1EDkyIn0E4GeICn_4xq3Mm8xGQmrhTMmNLXe0gffClFD460uaEnDru3IrWxaFuuwOVMI-i_18pu5z-H5GL4XgN4tkhlAzVnbeEt7U5JnoYnexqJAcPM2Yvy7peXNDJrs7"/>
<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
<button class="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-primary">cloud_upload</span>
</button>
<button class="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-stone-600">visibility</span>
</button>
</div>
</div>
</div>
<!-- Form Fields -->
<div class="space-y-6">
<div class="grid grid-cols-2 gap-4">
<div>
<label class="block text-[10px] font-label uppercase tracking-widest text-stone-400 mb-2">商品代碼</label>
<input class="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm" type="text" value="VP-F01"/>
</div>
<div>
<label class="block text-[10px] font-label uppercase tracking-widest text-stone-400 mb-2">當前庫存</label>
<input class="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" type="number" value="42"/>
</div>
</div>
<div>
<label class="block text-[10px] font-label uppercase tracking-widest text-stone-400 mb-2">商品名稱</label>
<input class="w-full bg-surface-container-high border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all font-medium" type="text" value="極緻修復精華液"/>
</div>
<!-- Multi-tier Pricing Section -->
<div class="bg-surface-container-low rounded-lg p-4">
<label class="block text-[10px] font-label uppercase tracking-widest text-stone-400 mb-4">價格體系設定</label>
<div class="space-y-4">
<div class="flex items-center justify-between gap-4">
<span class="text-xs font-bold text-stone-600 w-16">VIP 價</span>
<div class="relative flex-1">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
<input class="w-full bg-white border-none rounded-md pl-7 pr-4 py-2 text-sm text-right focus:ring-1 focus:ring-primary/40" type="text" value="1,150"/>
</div>
</div>
<div class="flex items-center justify-between gap-4">
<span class="text-xs font-bold text-stone-600 w-16">代理價</span>
<div class="relative flex-1">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
<input class="w-full bg-white border-none rounded-md pl-7 pr-4 py-2 text-sm text-right focus:ring-1 focus:ring-primary/40" type="text" value="980"/>
</div>
</div>
<div class="flex items-center justify-between gap-4">
<span class="text-xs font-bold text-stone-600 w-16">總代價</span>
<div class="relative flex-1">
<span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
<input class="w-full bg-white border-none rounded-md pl-7 pr-4 py-2 text-sm text-right focus:ring-1 focus:ring-primary/40" type="text" value="750"/>
</div>
</div>
</div>
</div>
<div class="pt-6 flex gap-4">
<button class="flex-1 bg-primary text-white py-4 rounded-full font-bold shadow-lg hover:bg-primary-container transition-colors active:scale-95 duration-200">
              儲存變更
            </button>
<button class="px-6 py-4 rounded-full border border-outline-variant text-stone-500 hover:bg-surface-container-low transition-colors">
              取消
            </button>
</div>
</div>
</div>
</aside>
</main>
<!-- Floating Action Button for Mobile Context -->
<div class="fixed bottom-8 right-8 md:hidden z-50">
<button class="bg-primary text-white p-4 rounded-full shadow-2xl scale-110 active:scale-90 transition-transform">
<span class="material-symbols-outlined">add</span>
</button>
</div>
</body></html>