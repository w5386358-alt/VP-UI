<!DOCTYPE html>

<html lang="zh-Hant"><head>
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
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Manrope', sans-serif; background-color: #fdf8f9; }
        h1, h2, h3, .headline { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="text-on-surface">
<!-- SideNavBar Shell -->
<aside class="fixed left-0 top-0 h-screen w-64 rounded-r-[32px] bg-white/92 dark:bg-stone-900/92 backdrop-blur-xl flex flex-col py-8 gap-2 shadow-[20px_0_40px_rgba(219,166,185,0.1)] z-50">
<div class="px-8 mb-10">
<h1 class="text-2xl font-black text-[#a92759]">Velvet Pulse</h1>
<p class="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Enterprise Resource Planning</p>
</div>
<nav class="flex-1 space-y-1">
<!-- Navigation Items Mapping -->
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-4 transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-medium">總覽</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-4 transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined">shopping_cart</span>
<span class="font-medium">訂購</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-4 transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined">inventory_2</span>
<span class="font-medium">倉儲</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-4 transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined">account_balance_wallet</span>
<span class="font-medium">會計中心</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-4 transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined">inventory</span>
<span class="font-medium">商品</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-4 transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined">groups</span>
<span class="font-medium">客戶</span>
</a>
<!-- Active Tab: 人員 -->
<a class="bg-gradient-to-br from-[#a92759] to-[#ca4172] text-white rounded-full mx-4 py-3 px-6 shadow-lg flex items-center gap-4 transition-all duration-300" href="#">
<span class="material-symbols-outlined">badge</span>
<span class="font-bold">人員</span>
</a>
<a class="text-stone-600 dark:text-stone-400 mx-4 py-3 px-6 hover:text-[#a92759] flex items-center gap-4 transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined">account_circle</span>
<span class="font-medium">個人資料</span>
</a>
</nav>
<div class="px-6 mt-auto">
<button class="w-full py-4 bg-surface-container-high rounded-2xl flex items-center justify-center gap-2 text-primary font-bold hover:bg-secondary-fixed transition-colors">
<span class="material-symbols-outlined">add</span>
<span>New Entry</span>
</button>
</div>
</aside>
<!-- TopAppBar Shell -->
<header class="fixed top-0 right-0 w-full z-40 bg-[#fdf8f9] dark:bg-stone-950 flex justify-between items-center h-16 px-8 ml-64 shadow-[0_18px_50px_rgba(219,166,185,0.14)]" style="padding-left: 18rem;">
<div class="flex items-center gap-4">
<div class="relative">
<span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400">search</span>
<input class="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-80 focus:ring-2 focus:ring-primary/20 text-sm" placeholder="搜尋團隊成員..." type="text"/>
</div>
</div>
<div class="flex items-center gap-6">
<button class="material-symbols-outlined text-stone-500 hover:text-primary transition-colors">notifications</button>
<button class="material-symbols-outlined text-stone-500 hover:text-primary transition-colors">settings</button>
<div class="h-8 w-8 rounded-full bg-primary-fixed overflow-hidden ring-2 ring-surface-container-highest">
<img alt="Administrator Profile" class="h-full w-full object-cover" data-alt="professional male corporate executive with friendly expression wearing tailored suit in a modern office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfs5bsTEvoF6jc_TvCG1dAx7cesnYHqJGOOr1Gcdx-EUNCny_S2tSqMfyPhYMYNyQcwIvMLJ6fv0dLy2HZVsej27A3B3iwbajmSuvPpZH9f_JOy3fVqb9w4EQYme3VxicBpksLQU0N5Y8uzOjGLkA1_pJKk0CPyXO3gqNXWma8Nd4AfiPftKfcwaTrZDHVNAfzVZgF4zP5psqqKKCik8ywhnPNQFD_axRWsLwnogw5HOCO_reZTTWkm4u_giACFDVqoisFusXk7--s"/>
</div>
</div>
</header>
<!-- Main Canvas -->
<main class="ml-64 pt-24 px-8 pb-12 min-h-screen">
<div class="flex gap-8">
<!-- Left Side: Member List (Editorial Bento Grid) -->
<div class="flex-1">
<div class="mb-8 flex justify-between items-end">
<div>
<h2 class="text-3xl font-extrabold text-on-surface tracking-tight font-headline">團隊成員管理</h2>
<p class="text-stone-500 mt-1">目前共有 24 位成員，管理權限與職務分配。</p>
</div>
<div class="flex gap-2">
<button class="px-4 py-2 rounded-full border border-outline-variant text-sm font-medium hover:bg-white transition-colors">篩選職務</button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-sm font-medium hover:bg-white transition-colors">匯出報表</button>
</div>
</div>
<!-- Member Cards Grid -->
<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
<!-- Card 1 -->
<div class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_4px_20px_rgba(219,166,185,0.06)] hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
<div class="flex items-start justify-between">
<div class="flex gap-5">
<div class="w-16 h-16 rounded-2xl overflow-hidden shadow-inner">
<img alt="Team Member" class="w-full h-full object-cover" data-alt="headshot of smiling young woman with professional attire soft natural lighting high-end corporate photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJjWPp6ZnaQgbicL3eSv1q2txhw3IVCEH_zVRwpHchxGtydWdzG1K6D314mbzUc5tE9HJ7HKPUNqHdU-ksMImKkw4DCFroujnuTTnuMuP4SDSGvfNs0I0i7XPGkwXd_fiTWaMNhIN8ccjkr8buAcJHW3h640zrYw9mKG9KcdyphXYSMEdLl64osz_25MMJaN18CeIosRn1BcU9aiO2ZSC88fcZGioXR_lrDec7VrSrZkXYEBqORI9Po5sQlqZ0_EtsaYCEtL0LGniG"/>
</div>
<div>
<h3 class="text-lg font-bold font-headline">陳雅婷 Sofia Chen</h3>
<p class="text-sm text-stone-500">營運總監 / Operations Director</p>
<div class="mt-4 flex items-center gap-3">
<span class="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold uppercase tracking-wider">最高權限</span>
<span class="text-xs text-stone-400">登入於 2 小時前</span>
</div>
</div>
</div>
<button class="material-symbols-outlined text-stone-300 group-hover:text-primary transition-colors">more_vert</button>
</div>
</div>
<!-- Card 2 -->
<div class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_4px_20px_rgba(219,166,185,0.06)] hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
<div class="flex items-start justify-between">
<div class="flex gap-5">
<div class="w-16 h-16 rounded-2xl overflow-hidden shadow-inner">
<img alt="Team Member" class="w-full h-full object-cover" data-alt="professional portrait of a man in creative industry smart casual attire neutral grey background soft studio light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvaGzBwWYXO8kWiKuJa_8QBwxNPn-hnRAcQ8rfTwZo1vT5ryMYebjp1X6t45eFUvjo_8dvpFt3a40pSfBbEziYGjkt7viyYxjY6sbsiCsoR8JbWyDypAL8LbhdD_eCW09ki552adumS0b1ByN_Q1LF3UjYvJzRUwI-4xIwoE1OmeGv4w8ljNeM5vYZ0aTSU0vZBjCBajlf8sGGZD3Jhrupi4fVaQPGaWglj0B0B5w7dUBateQgVYnAn32m4wh_WUs5B9PfIReNxy5m"/>
</div>
<div>
<h3 class="text-lg font-bold font-headline">張志豪 Marcus Chang</h3>
<p class="text-sm text-stone-500">財務主管 / Financial Lead</p>
<div class="mt-4 flex items-center gap-3">
<span class="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold uppercase tracking-wider">財務編輯</span>
<span class="text-xs text-stone-400">登入於 1 天前</span>
</div>
</div>
</div>
<button class="material-symbols-outlined text-stone-300 group-hover:text-primary transition-colors">more_vert</button>
</div>
</div>
<!-- Card 3 -->
<div class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_4px_20px_rgba(219,166,185,0.06)] hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
<div class="flex items-start justify-between">
<div class="flex gap-5">
<div class="w-16 h-16 rounded-2xl overflow-hidden shadow-inner">
<img alt="Team Member" class="w-full h-full object-cover" data-alt="confident professional woman of color in modern office space blurred background high-end aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLg_vTR3QSHDhYB5h-CLBfyc2OWOiQwhguFTWsuKxNV3hjV1EzOVmJ13vY6AmcB2Ozog4Pg0TxgC46qx30sWbmj4pCrM-LowZb8glbWWeUPLJQxHFNHK6mQfPlUnDvBk2ON7ntb0gWQoJ1EzKMxFYkyLf2_XinjMjHT4_Qr16FbSsyNaiIyxBZ8VE25wqmDLEP4FC46NmbnlBPgM4wwPXYroHkrKalmPL3yvFtPm9m4jOlaDuHG-hMupklbt7tM52Pd4B1LuGDRREw"/>
</div>
<div>
<h3 class="text-lg font-bold font-headline">李佩玲 Emily Lee</h3>
<p class="text-sm text-stone-500">產品分析師 / Product Analyst</p>
<div class="mt-4 flex items-center gap-3">
<span class="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">唯讀權限</span>
<span class="text-xs text-stone-400">登入於 5 分鐘前</span>
</div>
</div>
</div>
<button class="material-symbols-outlined text-stone-300 group-hover:text-primary transition-colors">more_vert</button>
</div>
</div>
<!-- Card 4 (Add Member Placeholder) -->
<div class="border-2 border-dashed border-outline-variant p-8 rounded-lg flex flex-col items-center justify-center text-stone-400 hover:border-primary hover:text-primary transition-all cursor-pointer group">
<span class="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">person_add</span>
<p class="font-bold">新增團隊成員</p>
</div>
</div>
<!-- Detailed Statistics Section -->
<div class="mt-12 p-8 bg-surface-container-low rounded-lg">
<h3 class="text-xl font-bold font-headline mb-6">權限分布概覽</h3>
<div class="grid grid-cols-4 gap-4">
<div class="bg-white p-6 rounded-2xl">
<p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">系統管理員</p>
<p class="text-2xl font-bold text-primary">3 <span class="text-sm font-normal text-stone-500">名</span></p>
</div>
<div class="bg-white p-6 rounded-2xl">
<p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">財務編輯權</p>
<p class="text-2xl font-bold text-primary">5 <span class="text-sm font-normal text-stone-500">名</span></p>
</div>
<div class="bg-white p-6 rounded-2xl">
<p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">普通編輯</p>
<p class="text-2xl font-bold text-primary">12 <span class="text-sm font-normal text-stone-500">名</span></p>
</div>
<div class="bg-white p-6 rounded-2xl">
<p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">訪客唯讀</p>
<p class="text-2xl font-bold text-primary">4 <span class="text-sm font-normal text-stone-500">名</span></p>
</div>
</div>
</div>
</div>
<!-- Right Side: Action Panel (Glassmorphism inspired) -->
<div class="w-[420px]">
<div class="bg-white/80 backdrop-blur-xl sticky top-24 rounded-lg shadow-[0_18px_50px_rgba(219,166,185,0.14)] p-8">
<div class="flex items-center justify-between mb-8">
<h3 class="text-xl font-bold font-headline">新增成員資料</h3>
<button class="material-symbols-outlined text-stone-400">close</button>
</div>
<form class="space-y-6">
<!-- Basic Info -->
<div class="space-y-4">
<label class="block">
<span class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">中文全名</span>
<input class="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="例如：王小明" type="text"/>
</label>
<label class="block">
<span class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">電子郵件 / 帳號</span>
<input class="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="xiaoming.wang@velvetpulse.com" type="email"/>
</label>
</div>
<!-- Role Selection -->
<div>
<span class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 block">角色職務選取</span>
<div class="grid grid-cols-2 gap-3">
<button class="p-3 rounded-lg border-2 border-primary bg-primary-fixed/30 text-primary text-xs font-bold flex flex-col items-center gap-2" type="button">
<span class="material-symbols-outlined">admin_panel_settings</span>
                                    系統管理員
                                </button>
<button class="p-3 rounded-lg border-2 border-transparent bg-surface-container-high text-stone-500 text-xs font-bold flex flex-col items-center gap-2 hover:bg-surface-container-highest transition-colors" type="button">
<span class="material-symbols-outlined">payments</span>
                                    財務人員
                                </button>
<button class="p-3 rounded-lg border-2 border-transparent bg-surface-container-high text-stone-500 text-xs font-bold flex flex-col items-center gap-2 hover:bg-surface-container-highest transition-colors" type="button">
<span class="material-symbols-outlined">inventory</span>
                                    倉儲物流
                                </button>
<button class="p-3 rounded-lg border-2 border-transparent bg-surface-container-high text-stone-500 text-xs font-bold flex flex-col items-center gap-2 hover:bg-surface-container-highest transition-colors" type="button">
<span class="material-symbols-outlined">support_agent</span>
                                    客服業務
                                </button>
</div>
</div>
<!-- Level Settings -->
<div>
<span class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 block">職位階級設定</span>
<select class="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all">
<option>L1 - 初階專員 (Junior)</option>
<option>L2 - 資深專員 (Senior)</option>
<option>L3 - 團隊主管 (Lead)</option>
<option>L4 - 部門經理 (Manager)</option>
<option>L5 - 執行總監 (Director)</option>
</select>
</div>
<!-- Password Init -->
<div>
<span class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 block">初始化密碼</span>
<div class="relative">
<input class="w-full bg-surface-container-high border-none rounded-lg p-3 text-sm pr-10" type="password" value="VP2024!Admin"/>
<button class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400 text-sm" type="button">visibility</button>
</div>
<p class="text-[10px] text-stone-400 mt-2">成員首次登入後將被要求強制更改密碼。</p>
</div>
<!-- Permissions Preview -->
<div class="p-4 bg-surface-container-low rounded-2xl space-y-3">
<span class="text-xs font-bold text-primary uppercase tracking-widest block">權限預覽 (根據選擇角色)</span>
<div class="flex items-center gap-2 text-xs text-stone-600">
<span class="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                                可訪問所有財務報表與成本數據
                            </div>
<div class="flex items-center gap-2 text-xs text-stone-600">
<span class="material-symbols-outlined text-sm text-tertiary">check_circle</span>
                                可新增/刪除團隊成員帳號
                            </div>
<div class="flex items-center gap-2 text-xs text-stone-600">
<span class="material-symbols-outlined text-sm text-stone-300">block</span>
                                禁止修改全域伺服器設定
                            </div>
</div>
<div class="pt-4 flex gap-3">
<button class="flex-1 py-4 bg-surface-container-high text-stone-600 rounded-full font-bold hover:bg-stone-200 transition-colors" type="button">取消</button>
<button class="flex-[2] py-4 bg-gradient-to-br from-[#a92759] to-[#ca4172] text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" type="submit">確認新增成員</button>
</div>
</form>
</div>
</div>
</div>
</main>
</body></html>