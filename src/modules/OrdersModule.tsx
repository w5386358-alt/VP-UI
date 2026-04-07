<!DOCTYPE html>

<html class="light" lang="zh-Hant"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
        }
      }
    </script>
<style>
        body { font-family: 'Manrope', sans-serif; background-color: #fdf8f9; }
        .font-headline { font-family: 'Plus Jakarta Sans', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-sidebar { background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(20px); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="text-on-surface">
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-screen w-64 rounded-r-xl glass-sidebar shadow-[20px_0_40px_rgba(219,166,185,0.1)] z-50 flex flex-col py-8 gap-2 font-['Manrope'] tracking-wide">
<div class="px-8 mb-8">
<h1 class="text-2xl font-black text-[#a92759]">Velvet Pulse</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-bold">Enterprise Resource Planning</p>
</div>
<nav class="flex-1 space-y-1">
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-[#f7f2f3] rounded-full" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-medium">總覽</span>
</a>
<a class="bg-gradient-to-br from-[#a92759] to-[#ca4172] text-white rounded-full mx-4 py-3 px-6 shadow-lg flex items-center gap-3 transition-all duration-300 ease-in-out" href="#">
<span class="material-symbols-outlined">shopping_cart</span>
<span class="font-medium">訂購</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-[#f7f2f3] rounded-full" href="#">
<span class="material-symbols-outlined">inventory_2</span>
<span class="font-medium">倉儲</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-[#f7f2f3] rounded-full" href="#">
<span class="material-symbols-outlined">account_balance_wallet</span>
<span class="font-medium">會計中心</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-[#f7f2f3] rounded-full" href="#">
<span class="material-symbols-outlined">inventory</span>
<span class="font-medium">商品</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-[#f7f2f3] rounded-full" href="#">
<span class="material-symbols-outlined">groups</span>
<span class="font-medium">客戶</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-[#f7f2f3] rounded-full" href="#">
<span class="material-symbols-outlined">badge</span>
<span class="font-medium">人員</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-3 transition-all duration-300 ease-in-out hover:bg-[#f7f2f3] rounded-full" href="#">
<span class="material-symbols-outlined">account_circle</span>
<span class="font-medium">個人資料</span>
</a>
</nav>
<div class="px-6 mt-auto">
<button class="w-full py-4 bg-primary-fixed text-on-primary-fixed-variant rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-md transition-shadow">
<span class="material-symbols-outlined">add</span>
                New Entry
            </button>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="ml-64 min-h-screen pr-[400px]">
<!-- TopNavBar -->
<header class="fixed top-0 right-0 w-full z-40 bg-[#fdf8f9] flex justify-between items-center h-16 px-8 ml-64 shadow-[0_18px_50px_rgba(219,166,185,0.14)] font-['Plus_Jakarta_Sans']">
<div class="flex items-center gap-4 flex-1">
<div class="relative w-full max-w-md">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input class="w-full bg-surface-container-high border-none rounded-full py-2 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm" placeholder="搜尋商品代碼或名稱..." type="text"/>
</div>
</div>
<div class="flex items-center gap-6">
<div class="flex items-center gap-2">
<button class="p-2 text-stone-500 hover:bg-[#f7f2f3] rounded-full transition-colors"><span class="material-symbols-outlined">notifications</span></button>
<button class="p-2 text-stone-500 hover:bg-[#f7f2f3] rounded-full transition-colors"><span class="material-symbols-outlined">settings</span></button>
</div>
<div class="flex items-center gap-3 border-l border-outline-variant/30 pl-6">
<div class="text-right">
<p class="text-sm font-bold text-on-surface">Admin User</p>
<p class="text-[10px] text-on-surface-variant">Administrator</p>
</div>
<img class="w-10 h-10 rounded-full border-2 border-white shadow-sm" data-alt="professional portrait of a business administrator in a modern office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhJ95KpwRtFU_thTka52xgsijX2xGM0thPVohik7sBO9anndkIUnQx1XxJTLuY7vU-G57_yxWRu6_EEZ45IqTovcn9C2CiM4DPMFYUsYvZISEbGAtVeU8eZIdfsFeo5xoEZ5-fiNpCfoqViybOo0Xj1w4_DBYk4C7hxOhbVB2ytSicH0oergGStWOqY36IuXwrmRJSfEpEbIYI8DtDy2Q1Wr_hmvfdoV22dkcnYoQrAzapwdomvL2XVdHxlAzbJrvVWovbjHTyLME5"/>
</div>
</div>
</header>
<!-- Page Header & Filters -->
<div class="pt-24 px-10 pb-8">
<div class="flex justify-between items-end mb-8">
<div>
<h2 class="text-4xl font-headline font-extrabold text-on-surface tracking-tight">商品訂購中心</h2>
<p class="text-on-surface-variant mt-2">選擇商品並加入購物車以建立新訂單</p>
</div>
<div class="flex gap-2 p-1 bg-surface-container-low rounded-full">
<button class="px-6 py-2 bg-white shadow-sm rounded-full text-sm font-bold text-primary">全部商品</button>
<button class="px-6 py-2 hover:bg-white/50 rounded-full text-sm font-medium text-on-surface-variant transition-all">保健食品</button>
<button class="px-6 py-2 hover:bg-white/50 rounded-full text-sm font-medium text-on-surface-variant transition-all">美容保養</button>
<button class="px-6 py-2 hover:bg-white/50 rounded-full text-sm font-medium text-on-surface-variant transition-all">日常用品</button>
</div>
</div>
<!-- Products Bento Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
<!-- Product Card 1 -->
<div class="group bg-surface-container-lowest rounded-lg p-6 shadow-sm hover:shadow-[0_18px_50px_rgba(219,166,185,0.14)] transition-all duration-500 flex flex-col gap-4 relative overflow-hidden">
<div class="flex justify-between items-start">
<span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded-full uppercase tracking-wider">In Stock</span>
<p class="text-primary-container font-headline font-bold text-sm">VP-HLT-001</p>
</div>
<div class="aspect-square rounded-md overflow-hidden bg-surface-container-low">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="minimalist aesthetic photo of a white supplement bottle on a soft pink silk background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdhsDroNWoqQjSm-ZsHFEWXDRdO2YuRNMz7k0CgzZHIq0U1b9tHHzQ6U9IP82ovlt55RWjEoZXCHNnkogq7I6rlzhDUbuUCekz47CDliG6ZrkWKdcM5TSlL3XbAbDyx3-aTtEjv9fZ-4UKP6zF5SynqlgumxGoRsBf7o1vBgQGh13z-sVROXGfiumnaNmOLlXybC7DGohvKhliRYm2NNyJG6QH-2esSAaYKyRBnvRMV8V4FFjXhi4af-CDeXf8KCfrsUjkVTau8jat"/>
</div>
<div>
<h3 class="text-lg font-headline font-bold text-on-surface">高濃度深海魚油膠囊</h3>
<p class="text-sm text-on-surface-variant mt-1">Omega-3 濃度達 90% 以上，支持日常健康</p>
</div>
<div class="flex flex-col gap-2 border-t border-outline-variant/10 pt-4">
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">零售價 (Tier A)</span>
<span class="font-bold text-on-surface">$1,280</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">批發價 (Tier B)</span>
<span class="font-bold text-primary">$1,050</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high hover:bg-primary hover:text-white transition-all rounded-full flex items-center justify-center gap-2 group/btn">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span class="text-sm font-bold">加入購物車</span>
</button>
</div>
<!-- Product Card 2 -->
<div class="group bg-surface-container-lowest rounded-lg p-6 shadow-sm hover:shadow-[0_18px_50px_rgba(219,166,185,0.14)] transition-all duration-500 flex flex-col gap-4 relative overflow-hidden">
<div class="flex justify-between items-start">
<span class="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold rounded-full uppercase tracking-wider">Low Stock</span>
<p class="text-primary-container font-headline font-bold text-sm">VP-BEU-024</p>
</div>
<div class="aspect-square rounded-md overflow-hidden bg-surface-container-low">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="premium glass skincare dropper bottle with rose gold cap against a soft focus botanical background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmq7lmEQfiVyRMpuSDUqWrDQoCFyhDYoHwUUoNLEWtil52NQwWAfdg0wURdcxwzPjMak9B4ph-_VNkR3jsLWoZ3RrxsmyJLRxpBIfaojuWQrmJNwK5YvtObWvMf2EhBeqF5pgZ3OQJbJiH4ZmTuAnbruAmE5kI7w3h8ra7-bg7b2X7FE0DYuhq-aHcK5gzpcnDn3LCUpX2kcAQw0eEehM3m7uXrlZmPgGjW2rTZODY-6Yq5ygwl23CTzYJm5PVw95hTysx58gmY1QJ"/>
</div>
<div>
<h3 class="text-lg font-headline font-bold text-on-surface">玫瑰精粹抗老精華</h3>
<p class="text-sm text-on-surface-variant mt-1">頂級大馬士革玫瑰萃取，深層鎖水修護</p>
</div>
<div class="flex flex-col gap-2 border-t border-outline-variant/10 pt-4">
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">零售價 (Tier A)</span>
<span class="font-bold text-on-surface">$2,450</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">批發價 (Tier B)</span>
<span class="font-bold text-primary">$1,980</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high hover:bg-primary hover:text-white transition-all rounded-full flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span class="text-sm font-bold">加入購物車</span>
</button>
</div>
<!-- Product Card 3 -->
<div class="group bg-surface-container-lowest rounded-lg p-6 shadow-sm hover:shadow-[0_18px_50px_rgba(219,166,185,0.14)] transition-all duration-500 flex flex-col gap-4 relative overflow-hidden">
<div class="flex justify-between items-start">
<span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded-full uppercase tracking-wider">In Stock</span>
<p class="text-primary-container font-headline font-bold text-sm">VP-HLT-008</p>
</div>
<div class="aspect-square rounded-md overflow-hidden bg-surface-container-low">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="vibrant effervescent vitamin c tablets dissolving in glass of water with artistic splash and soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9zn1FxHW5J4ZiMgyRgzgM3yB9yq2MYTB5nGaB7_ZRxBbq8uVMxiRkeVkNKnJx93B-0AcUtJ4cuwmK7l_YzsBb7O4M7pms5Z_-1sNIGXzIFoew3mSAQ9ahwsRbMWbhA7c8HGxCuRsxcBTkYfHhIrT_onzvCCDzFR7Azfxomjfwd-qDK2ZWm7IpN39kaHvNpyybtbK5X50I9BNpNyQmFtydt9Ce7B-nO1CXRu3NipI96GZA6jyEPUaLtUU77E3LqCicnn4qdK1iu7aD"/>
</div>
<div>
<h3 class="text-lg font-headline font-bold text-on-surface">維他命C發泡錠</h3>
<p class="text-sm text-on-surface-variant mt-1">德國製原裝進口，每日活力來源</p>
</div>
<div class="flex flex-col gap-2 border-t border-outline-variant/10 pt-4">
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">零售價 (Tier A)</span>
<span class="font-bold text-on-surface">$450</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">批發價 (Tier B)</span>
<span class="font-bold text-primary">$320</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high hover:bg-primary hover:text-white transition-all rounded-full flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span class="text-sm font-bold">加入購物車</span>
</button>
</div>
<!-- Product Card 4 -->
<div class="group bg-surface-container-lowest rounded-lg p-6 shadow-sm hover:shadow-[0_18px_50px_rgba(219,166,185,0.14)] transition-all duration-500 flex flex-col gap-4 relative overflow-hidden">
<div class="flex justify-between items-start">
<span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded-full uppercase tracking-wider">In Stock</span>
<p class="text-primary-container font-headline font-bold text-sm">VP-BEU-012</p>
</div>
<div class="aspect-square rounded-md overflow-hidden bg-surface-container-low">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="luxury skincare cream jar open with silky texture swirled inside on a warm neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALVYIah-JTnOE5wvPu_X3_Z6Pba5MgXFBCJAgYD-wggj5AQsjMhxbGpABkG7JQJ2aBHebsTdl-EQkKOnRIYHJxn_oO-7Mu_spX5VNpgQqshWpouWxRcdM82UD1L8kL30NsBTrg7SSTIccncql9Usjukbg4sQT8BiE_KfXpHam93WKWA1IYd4aOgBzz44VtqLzXwLCHIo8Shxy1Wd5hVQx6mFkbmElJfp1uFQXeNFKOp4eF3Niz67Jrke6EyNZS4ufSGL_tJYU31kwN"/>
</div>
<div>
<h3 class="text-lg font-headline font-bold text-on-surface">水漾晶透保濕面霜</h3>
<p class="text-sm text-on-surface-variant mt-1">玻尿酸分子保濕科技，打造晶透膚質</p>
</div>
<div class="flex flex-col gap-2 border-t border-outline-variant/10 pt-4">
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">零售價 (Tier A)</span>
<span class="font-bold text-on-surface">$1,880</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">批發價 (Tier B)</span>
<span class="font-bold text-primary">$1,520</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high hover:bg-primary hover:text-white transition-all rounded-full flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span class="text-sm font-bold">加入購物車</span>
</button>
</div>
<!-- Product Card 5 -->
<div class="group bg-surface-container-lowest rounded-lg p-6 shadow-sm hover:shadow-[0_18px_50px_rgba(219,166,185,0.14)] transition-all duration-500 flex flex-col gap-4 relative overflow-hidden">
<div class="flex justify-between items-start">
<span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded-full uppercase tracking-wider">In Stock</span>
<p class="text-primary-container font-headline font-bold text-sm">VP-HLT-015</p>
</div>
<div class="aspect-square rounded-md overflow-hidden bg-surface-container-low">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="selection of herbal tea leaves and dried botanicals in ceramic bowls with soft warm lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnk-W1fDX2ZnEDcWxNSZNCGsuyK_VuOE5xMvONkR9N-SBIzoTqQJ8DF3-5QTAGSPuaVGmIT89SHqi7V9pTF_oppKP4s--J8fof1c8q_IUYFkxopil3deuOfqIF4hkVxzFDzvLaPJpQ1hZbG-UmfdeGUdWlcPeXgHjnEaX_BWRhYn3UvHNl378ynPg_wW-qVVaoqEbAeRkYn7gNm1XlfeIjQqAlX9q6DX5VOAmqho5CzeEBVwtRu4EIiDRGBIOhh7VDSqwTYUlirPKx"/>
</div>
<div>
<h3 class="text-lg font-headline font-bold text-on-surface">夜間舒眠草本茶</h3>
<p class="text-sm text-on-surface-variant mt-1">舒緩壓力，幫助提升夜間睡眠品質</p>
</div>
<div class="flex flex-col gap-2 border-t border-outline-variant/10 pt-4">
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">零售價 (Tier A)</span>
<span class="font-bold text-on-surface">$580</span>
</div>
<div class="flex justify-between items-center text-sm">
<span class="text-on-surface-variant">批發價 (Tier B)</span>
<span class="font-bold text-primary">$420</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high hover:bg-primary hover:text-white transition-all rounded-full flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span class="text-sm font-bold">加入購物車</span>
</button>
</div>
</div>
</div>
</main>
<!-- Shopping Cart Drawer (Right Slide-out) -->
<aside class="fixed top-0 right-0 h-full w-[400px] glass-sidebar z-[60] shadow-[-20px_0_40px_rgba(219,166,185,0.1)] flex flex-col p-8 overflow-hidden">
<div class="flex items-center justify-between mb-8">
<div class="flex items-center gap-3">
<div class="w-10 h-10 bg-primary-container/10 text-primary flex items-center justify-center rounded-full">
<span class="material-symbols-outlined">shopping_basket</span>
</div>
<h3 class="text-xl font-headline font-extrabold text-on-surface">訂購清單</h3>
</div>
<button class="p-2 hover:bg-surface-container-low rounded-full transition-colors">
<span class="material-symbols-outlined text-stone-400">close</span>
</button>
</div>
<div class="flex-1 overflow-y-auto pr-2 hide-scrollbar space-y-8">
<!-- Customer Section -->
<section>
<label class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">客戶選擇</label>
<div class="bg-surface-container-low p-4 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-white transition-all group">
<div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">L</div>
<div class="flex-1">
<p class="text-sm font-bold text-on-surface">林曉平 (VIP 會員)</p>
<p class="text-[11px] text-on-surface-variant">ID: CUST-880293</p>
</div>
<span class="material-symbols-outlined text-stone-400 group-hover:text-primary transition-colors">edit</span>
</div>
</section>
<!-- Order Items -->
<section>
<div class="flex justify-between items-center mb-4">
<label class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">商品內容</label>
<span class="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">2 項商品</span>
</div>
<div class="space-y-4">
<div class="flex gap-4">
<img class="w-16 h-16 rounded-md object-cover" data-alt="close up product shot of a medicine bottle on clean surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7pghKz6p4eN9BrgsDTs435yzSgNjVOBYxuVWDivP57jmYleZLBoilhhdg3cBIB7f1ezNXX6g1lv9oUWSgSylHhAnf7y65L8QmJEYVDyuXeM08NpP-BXC4cyoEso2cyZgicf9AxrWrvE0eXWoyTg3qdoCtOCjhOjGAr4bzJC_3Z99uT58LAXG5RawDjH6fJtlBeqVBBO5nucCftlTNBI7BNsXA4t2FM7D-pkUAb7aFTW4xIiuSiy_phg1pyY_UIwaJJzWdQ5-mRzo5"/>
<div class="flex-1">
<p class="text-sm font-bold text-on-surface">高濃度深海魚油膠囊</p>
<div class="flex justify-between items-center mt-1">
<p class="text-xs text-primary font-bold">$1,050 <span class="text-on-surface-variant font-normal">x 2</span></p>
<div class="flex items-center gap-3">
<button class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs">-</button>
<span class="text-xs font-bold">2</span>
<button class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs">+</button>
</div>
</div>
</div>
</div>
<div class="flex gap-4">
<img class="w-16 h-16 rounded-md object-cover" data-alt="close up product shot of a beauty serum bottle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCelzESKJTxHMMBImbWr-scDeI-er0tG8vTypvw3ypChnov8t9U2h3aXCXTRypN3OhSV0lhpZZW5LPl6KJ6OK93bGLEnM1nBjv1lFzZJuQfDas3jcv2I2pYQt-KBw_X949c2IPSgqMah2dQb_tnnETySluXa_fZivW4g9hrP0CGn128bHepAoMxTdi1tRcBmmCP0FOlawmtqNq76CYj6_xHZbufhnJ3ZR0KjJX_jVAVrBFoyew02CHQ0zyGuhemmdEET73VXLkjj7Vi"/>
<div class="flex-1">
<p class="text-sm font-bold text-on-surface">玫瑰精粹抗老精華</p>
<div class="flex justify-between items-center mt-1">
<p class="text-xs text-primary font-bold">$1,980 <span class="text-on-surface-variant font-normal">x 1</span></p>
<div class="flex items-center gap-3">
<button class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs">-</button>
<span class="text-xs font-bold">1</span>
<button class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs">+</button>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Delivery & Discount -->
<section class="grid grid-cols-2 gap-4">
<div>
<label class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">配送方式</label>
<select class="w-full bg-surface-container-low border-none rounded-lg text-xs font-medium py-3 focus:ring-primary/20">
<option>宅配到府</option>
<option>超商取貨</option>
<option>門市自取</option>
</select>
</div>
<div>
<label class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">折扣優惠</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-sm">sell</span>
<input class="w-full bg-surface-container-low border-none rounded-lg text-xs font-medium py-3 pl-9 focus:ring-primary/20" placeholder="輸入代碼" type="text"/>
</div>
</div>
</section>
<!-- Notes -->
<section>
<label class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">訂單備註</label>
<textarea class="w-full bg-surface-container-low border-none rounded-lg text-xs p-4 focus:ring-primary/20 resize-none" placeholder="請輸入任何特殊需求..." rows="2"></textarea>
</section>
</div>
<!-- Summary & Checkout -->
<div class="mt-8 pt-8 border-t border-outline-variant/30">
<div class="space-y-2 mb-6">
<div class="flex justify-between text-sm">
<span class="text-on-surface-variant">商品小計</span>
<span class="text-on-surface font-medium">$4,080</span>
</div>
<div class="flex justify-between text-sm">
<span class="text-on-surface-variant">運費</span>
<span class="text-on-surface font-medium">$100</span>
</div>
<div class="flex justify-between text-lg font-headline font-black mt-4">
<span class="text-on-surface">總計</span>
<span class="text-primary">$4,180</span>
</div>
</div>
<button class="w-full py-4 bg-gradient-to-br from-[#a92759] to-[#ca4172] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all scale-100 active:scale-95 flex items-center justify-center gap-2">
                確認建立訂單
                <span class="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</aside>
</body></html>