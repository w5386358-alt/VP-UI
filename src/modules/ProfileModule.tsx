<!DOCTYPE html>

<html class="light" lang="zh-Hant"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>個人資料 - Velvet Pulse ERP</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
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
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-sidebar { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .perspective-shadow { shadow-[0_18px_50px_rgba(219,166,185,0.14)] }
    </style>
</head>
<body class="bg-surface text-on-surface">
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-screen w-64 rounded-r-[32px] bg-white/92 backdrop-blur-xl flex flex-col py-8 gap-2 shadow-[20px_0_40px_rgba(219,166,185,0.1)] z-50 glass-sidebar">
<div class="px-8 mb-10">
<h1 class="text-2xl font-black text-primary font-headline">Velvet Pulse</h1>
<p class="text-xs text-on-surface-variant/70 tracking-widest font-label">Enterprise Resource Planning</p>
</div>
<nav class="flex-1 space-y-1">
<!-- Navigation Items Mapping from JSON -->
<a class="text-stone-600 mx-4 py-3 px-6 hover:bg-[#f7f2f3] rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-medium">總覽</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:bg-[#f7f2f3] rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">shopping_cart</span>
<span class="font-medium">訂購</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:bg-[#f7f2f3] rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">inventory_2</span>
<span class="font-medium">倉儲</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:bg-[#f7f2f3] rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">account_balance_wallet</span>
<span class="font-medium">會計中心</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:bg-[#f7f2f3] rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">inventory</span>
<span class="font-medium">商品</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:bg-[#f7f2f3] rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">groups</span>
<span class="font-medium">客戶</span>
</a>
<a class="text-stone-600 mx-4 py-3 px-6 hover:bg-[#f7f2f3] rounded-full flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined">badge</span>
<span class="font-medium">人員</span>
</a>
<!-- Active State: 個人資料 -->
<a class="bg-gradient-to-br from-[#a92759] to-[#ca4172] text-white rounded-full mx-4 py-3 px-6 shadow-lg flex items-center gap-3 transition-all duration-300" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">account_circle</span>
<span class="font-medium">個人資料</span>
</a>
</nav>
<div class="mt-auto px-6">
<button class="w-full py-4 bg-secondary-container text-on-secondary-container rounded-full font-bold flex items-center justify-center gap-2 hover:scale-95 transition-transform">
<span class="material-symbols-outlined">add</span>
<span>New Entry</span>
</button>
</div>
</aside>
<!-- TopNavBar -->
<header class="fixed top-0 right-0 w-full z-40 bg-[#fdf8f9] flex justify-between items-center h-16 px-8 ml-64 shadow-[0_18px_50px_rgba(219,166,185,0.14)]" style="padding-left: calc(16rem + 2rem);">
<div class="flex items-center bg-surface-container-low rounded-full px-4 py-2 w-96">
<span class="material-symbols-outlined text-stone-400">search</span>
<input class="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-stone-400" placeholder="搜尋個人報表或訂單..." type="text"/>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-stone-500 hover:bg-surface-container-low rounded-full transition-colors relative">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
</button>
<button class="p-2 text-stone-500 hover:bg-surface-container-low rounded-full transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
<div class="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
<div class="flex items-center gap-3">
<div class="text-right hidden md:block">
<p class="text-xs font-bold text-on-surface">林雅婷</p>
<p class="text-[10px] text-on-surface-variant uppercase tracking-tighter">Administrator</p>
</div>
<img alt="Administrator Profile" class="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" data-alt="professional portrait of a confident woman in business attire with warm studio lighting and soft rose background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRtecSXF_Y16nnzgpRJ90fHs4K4NwzQ6WFompnhuCdS13qiQrV4gyYq2D5Ktip63O_icc62DtCrDCkpCXHJcfmbSkUKRdvMLYwjvGPOfnb6FNvseBC2WXVKPbPr6kp2szkj8wOMA6Sw_nKwafcD4ejcTu7FF2pUHds8kLCrcr1AiiDFA4FuOAzAggn8vYmz_pkmzr7T2Mr_yu7Ko-53Kvp7ic54vZkfIiiGQzRLu_IaBN_ub1jEvAtmR2lAAoTfePWeTfTxG2WGfB-"/>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="pt-24 pl-72 pr-8 pb-12 min-h-screen space-y-8">
<!-- Header Section -->
<section class="flex flex-col md:flex-row gap-8">
<!-- Identity Card -->
<div class="flex-1 bg-surface-container-lowest rounded-lg p-8 shadow-[0_18px_50px_rgba(219,166,185,0.1)] flex items-center gap-8 relative overflow-hidden">
<div class="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
<div class="relative">
<img alt="User Profile" class="w-32 h-32 rounded-xl object-cover shadow-xl ring-4 ring-white" data-alt="close up professional portrait of a modern business professional woman smiling softly in warm elegant lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvHp7G_y4I5YTTxYrRZLFKr-tJcutm0-3e8aYpIafuYmxpgqHzb3V4qmpH-OUyy4O3stdX9-upOagPLKWWncpnUtC42hm6ZSWIp46HyemPO7Ub1_scxYmbL9KHgBzaVcbND8tVLXypkzdEZY0mopMj13biYK7q9pZ-JGEFrwCilQBLE3P7sf8HSgp1KPz6w-FmbkTr1zeMz0tu9eMYK61_pjsW-gd3muY8CegENdZCeLwtHJap2ZZSymP7bqYYJDvsJPPLTeQm1x5i"/>
<div class="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-lg shadow-lg">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
</div>
</div>
<div class="flex-1">
<div class="flex items-center justify-between">
<div>
<h2 class="text-3xl font-bold font-headline text-on-surface">林雅婷 <span class="text-base font-normal text-on-surface-variant ml-2">(Tina Lin)</span></h2>
<p class="text-primary font-bold mt-1">高級業務經理</p>
</div>
<div class="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1 rounded-full text-xs font-bold tracking-wider">
                            金級會員
                        </div>
</div>
<div class="mt-6 flex gap-6 text-sm">
<div>
<p class="text-on-surface-variant text-[10px] font-label uppercase tracking-widest mb-1">員工編號</p>
<p class="font-bold">VP-ERP-2024-8892</p>
</div>
<div class="h-8 w-[1px] bg-outline-variant/50"></div>
<div>
<p class="text-on-surface-variant text-[10px] font-label uppercase tracking-widest mb-1">入職日期</p>
<p class="font-bold">2021年11月15日</p>
</div>
<div class="h-8 w-[1px] bg-outline-variant/50"></div>
<div>
<p class="text-on-surface-variant text-[10px] font-label uppercase tracking-widest mb-1">直屬部門</p>
<p class="font-bold">全通路行銷部</p>
</div>
</div>
</div>
<!-- QR Code Representation -->
<div class="w-24 h-24 bg-surface-container-high rounded-lg p-2 flex items-center justify-center flex-col gap-1 border border-outline-variant/20">
<span class="material-symbols-outlined text-4xl text-on-surface-variant opacity-50">qr_code_2</span>
<span class="text-[8px] font-bold text-on-surface-variant uppercase">Verify Identity</span>
</div>
</div>
</section>
<!-- Bento Grid: Analytics & Performance -->
<section class="grid grid-cols-1 md:grid-cols-12 gap-8">
<!-- Key Metric: Sales Dashboard -->
<div class="md:col-span-8 bg-surface-container-lowest rounded-lg p-8 shadow-[0_18px_50px_rgba(219,166,185,0.08)]">
<div class="flex justify-between items-center mb-8">
<div>
<h3 class="text-xl font-bold font-headline text-on-surface">本年度業績總覽</h3>
<p class="text-sm text-on-surface-variant">數據更新於：2024年5月22日 14:30</p>
</div>
<div class="flex gap-2">
<span class="px-3 py-1 bg-surface-container-low rounded-full text-xs font-bold text-on-surface-variant cursor-pointer">季報表</span>
<span class="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary cursor-pointer">月報表</span>
</div>
</div>
<div class="grid grid-cols-3 gap-6 mb-8">
<div class="bg-surface-container-low p-6 rounded-2xl">
<p class="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-2">累計銷售額</p>
<h4 class="text-2xl font-bold font-headline text-on-surface">NT$ 12,850,000</h4>
<div class="flex items-center gap-1 text-tertiary mt-2 text-xs font-bold">
<span class="material-symbols-outlined text-sm">trending_up</span>
<span>+12.5%</span>
</div>
</div>
<div class="bg-surface-container-low p-6 rounded-2xl">
<p class="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-2">成交訂單</p>
<h4 class="text-2xl font-bold font-headline text-on-surface">1,248 筆</h4>
<div class="flex items-center gap-1 text-tertiary mt-2 text-xs font-bold">
<span class="material-symbols-outlined text-sm">trending_up</span>
<span>+4.2%</span>
</div>
</div>
<div class="bg-surface-container-low p-6 rounded-2xl border-2 border-primary/10">
<p class="text-primary text-xs font-label uppercase tracking-widest mb-2">目前個人排名</p>
<h4 class="text-2xl font-bold font-headline text-primary">NO. 08</h4>
<p class="text-on-surface-variant text-[10px] mt-2">全公司 350+ 名業務</p>
</div>
</div>
<!-- Visual Graph Placeholder -->
<div class="h-48 w-full bg-surface-container-low rounded-2xl flex flex-col justify-end p-4 relative overflow-hidden">
<div class="absolute inset-0 flex items-center justify-center">
<span class="text-on-surface-variant/20 font-bold tracking-widest uppercase text-4xl">Performance Trend</span>
</div>
<!-- Mock bar chart -->
<div class="flex items-end gap-3 h-full relative z-10 px-4">
<div class="flex-1 bg-primary-fixed-dim/40 rounded-t-lg h-[40%]"></div>
<div class="flex-1 bg-primary-fixed-dim/40 rounded-t-lg h-[60%]"></div>
<div class="flex-1 bg-primary-fixed-dim/40 rounded-t-lg h-[55%]"></div>
<div class="flex-1 bg-primary-fixed-dim/40 rounded-t-lg h-[80%]"></div>
<div class="flex-1 bg-primary rounded-t-lg h-[95%]"></div>
<div class="flex-1 bg-primary-fixed-dim/40 rounded-t-lg h-[70%]"></div>
<div class="flex-1 bg-primary-fixed-dim/40 rounded-t-lg h-[85%]"></div>
</div>
</div>
</div>
<!-- Side Card: Quick Stats -->
<div class="md:col-span-4 flex flex-col gap-8">
<div class="bg-gradient-to-br from-primary to-primary-container p-8 rounded-lg text-white shadow-xl relative overflow-hidden">
<div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
<h3 class="text-xl font-bold mb-6 font-headline relative z-10">晉升進度</h3>
<div class="mb-4">
<div class="flex justify-between text-sm mb-2">
<span>當前：金級</span>
<span>目標：鑽石級</span>
</div>
<div class="w-full h-2 bg-white/20 rounded-full overflow-hidden">
<div class="w-[75%] h-full bg-white rounded-full"></div>
</div>
</div>
<p class="text-xs text-white/80 leading-relaxed">
                        距離鑽石級晉升還需完成 <strong>NT$ 2,150,000</strong> 業績。您目前表現優於 92% 的同儕。
                    </p>
<button class="mt-6 w-full py-3 bg-white text-primary rounded-full font-bold text-sm hover:bg-white/90 transition-colors">查看晉升細則</button>
</div>
<div class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_18px_50px_rgba(219,166,185,0.08)]">
<h3 class="text-lg font-bold mb-4 font-headline text-on-surface">我的成就</h3>
<div class="flex flex-wrap gap-4">
<div class="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center" title="業績達人">
<span class="material-symbols-outlined text-on-tertiary-fixed">military_tech</span>
</div>
<div class="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center" title="百萬經紀人">
<span class="material-symbols-outlined text-on-secondary-fixed">workspace_premium</span>
</div>
<div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center" title="服務楷模">
<span class="material-symbols-outlined text-on-primary-fixed">volunteer_activism</span>
</div>
<div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-stone-400" title="尚未解鎖">
<span class="material-symbols-outlined">lock</span>
</div>
</div>
</div>
</div>
</section>
<!-- History Orders Section -->
<section class="bg-surface-container-lowest rounded-lg shadow-[0_18px_50px_rgba(219,166,185,0.08)] overflow-hidden">
<div class="p-8 flex justify-between items-center border-b border-outline-variant/10">
<div>
<h3 class="text-xl font-bold font-headline text-on-surface">歷史訂單紀錄</h3>
<p class="text-sm text-on-surface-variant">管理與追蹤您的所有歷史成交案件</p>
</div>
<button class="flex items-center gap-2 text-primary font-bold text-sm">
<span>導出報表 (Excel)</span>
<span class="material-symbols-outlined text-sm">download</span>
</button>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low/50">
<th class="px-8 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">訂單編號</th>
<th class="px-8 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">日期</th>
<th class="px-8 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">客戶名稱</th>
<th class="px-8 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">總金額</th>
<th class="px-8 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">狀態</th>
<th class="px-8 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant text-right">操作</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/10">
<!-- Table Row 1 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-8 py-5 font-bold text-sm">#ORD-2024-5501</td>
<td class="px-8 py-5 text-sm">2024-05-20</td>
<td class="px-8 py-5 text-sm flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-secondary-container text-[10px] font-bold flex items-center justify-center text-on-secondary-container">TH</div>
<span>泰合創意設計</span>
</td>
<td class="px-8 py-5 text-sm font-bold">NT$ 450,000</td>
<td class="px-8 py-5">
<span class="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-xs font-bold">已完成</span>
</td>
<td class="px-8 py-5 text-right">
<button class="text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
<!-- Table Row 2 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-8 py-5 font-bold text-sm">#ORD-2024-5489</td>
<td class="px-8 py-5 text-sm">2024-05-18</td>
<td class="px-8 py-5 text-sm flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary-fixed text-[10px] font-bold flex items-center justify-center text-on-primary-fixed">MS</div>
<span>名紳貿易集團</span>
</td>
<td class="px-8 py-5 text-sm font-bold">NT$ 1,280,000</td>
<td class="px-8 py-5">
<span class="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-xs font-bold">處理中</span>
</td>
<td class="px-8 py-5 text-right">
<button class="text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
<!-- Table Row 3 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-8 py-5 font-bold text-sm">#ORD-2024-5432</td>
<td class="px-8 py-5 text-sm">2024-05-12</td>
<td class="px-8 py-5 text-sm flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-outline-variant/30 text-[10px] font-bold flex items-center justify-center text-on-surface-variant">FL</div>
<span>富樂實業有限公司</span>
</td>
<td class="px-8 py-5 text-sm font-bold">NT$ 89,200</td>
<td class="px-8 py-5">
<span class="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-xs font-bold">已完成</span>
</td>
<td class="px-8 py-5 text-right">
<button class="text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<div class="px-8 py-6 bg-surface-container-low/30 flex justify-center">
<button class="px-8 py-2 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-bold hover:bg-surface-container-highest transition-colors">
                    查看完整歷史紀錄
                </button>
</div>
</section>
</main>
<!-- Contextual FAB (Only on relevant screens) -->
<button class="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
<span class="material-symbols-outlined text-3xl">chat_bubble</span>
<span class="absolute right-full mr-4 bg-on-surface text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">聯絡助理</span>
</button>
</body></html>