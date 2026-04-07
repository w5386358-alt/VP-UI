<!DOCTYPE html>

<html class="light" lang="zh-Hant"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>客戶管理 - Velvet Pulse ERP</title>
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
                        "secondary-fixed-dim": "#ffb1ca",
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
        .glass-sidebar {
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(20px);
        }
    </style>
</head>
<body class="bg-surface font-body text-on-surface">
<!-- SideNavBar Shell -->
<aside class="fixed left-0 top-0 h-screen w-64 rounded-r-xl glass-sidebar shadow-[20px_0_40px_rgba(219,166,185,0.1)] flex flex-col py-8 gap-2 z-50">
<div class="px-8 mb-10">
<h1 class="text-2xl font-black text-primary font-headline">Velvet Pulse</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-medium">Enterprise Resource Planning</p>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:bg-surface-container-low transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined mr-3" data-icon="dashboard">dashboard</span>
<span class="font-medium">總覽</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:bg-surface-container-low transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined mr-3" data-icon="shopping_cart">shopping_cart</span>
<span class="font-medium">訂購</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:bg-surface-container-low transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined mr-3" data-icon="inventory_2">inventory_2</span>
<span class="font-medium">倉儲</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:bg-surface-container-low transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined mr-3" data-icon="account_balance_wallet">account_balance_wallet</span>
<span class="font-medium">會計中心</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:bg-surface-container-low transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined mr-3" data-icon="inventory">inventory</span>
<span class="font-medium">商品</span>
</a>
<!-- Active Tab: 客戶 -->
<a class="flex items-center bg-gradient-to-br from-[#a92759] to-[#ca4172] text-white rounded-full mx-4 py-3 px-6 shadow-lg transition-all duration-300" href="#">
<span class="material-symbols-outlined mr-3" data-icon="groups" style="font-variation-settings: 'FILL' 1;">groups</span>
<span class="font-bold">客戶</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:bg-surface-container-low transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined mr-3" data-icon="badge">badge</span>
<span class="font-medium">人員</span>
</a>
<a class="flex items-center text-stone-600 mx-4 py-3 px-6 hover:bg-surface-container-low transition-all duration-300 rounded-full" href="#">
<span class="material-symbols-outlined mr-3" data-icon="account_circle">account_circle</span>
<span class="font-medium">個人資料</span>
</a>
</nav>
<div class="px-8 mt-auto">
<button class="w-full bg-primary text-on-primary py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all">
<span class="material-symbols-outlined" data-icon="add">add</span>
                New Entry
            </button>
</div>
</aside>
<!-- TopNavBar Shell -->
<header class="fixed top-0 right-0 w-full h-16 px-8 ml-64 bg-surface-container-low/80 backdrop-blur-md flex justify-between items-center z-40 pl-72 shadow-[0_18px_50px_rgba(219,166,185,0.14)]">
<div class="flex items-center gap-4">
<div class="relative group">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" data-icon="search">search</span>
<input class="bg-surface-container-high border-none rounded-full py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-300 text-sm" placeholder="搜尋客戶、訂單或標籤..." type="text"/>
</div>
</div>
<div class="flex items-center gap-6">
<button class="relative text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
<span class="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-surface"></span>
</button>
<button class="text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<div class="flex items-center gap-3 border-l border-outline-variant/30 pl-6">
<div class="text-right">
<p class="text-xs font-bold text-on-surface">Admin User</p>
<p class="text-[10px] text-on-surface-variant">Administrator</p>
</div>
<img class="w-10 h-10 rounded-full object-cover border-2 border-primary-container" data-alt="professional male executive in a sleek suit, high-end corporate office background, soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe3wqbm9iv5JL2VyeEb1Cvmps1njij7h0gmFcdFNNPL8ymFfGdih53MDagsLpLJinGm386wPhnY2nacdNBeFBqJ9HeL5DV_umwJXp7oXi3dMP8oVVq-5W2-zvIDaILgozqcG-66N-2Tk79LdFsk9aSQvGmtMRAee0m2KZUBi8MexjctXQuTkceInCyK54fSJemmiCYqBFpNzFdrUngoT7vaHUvJn_nMWOkmTCZrH8-sCPVdtOLMzzCv8KmU13aIMJ1vjbhnDBmHraI"/>
</div>
</div>
</header>
<!-- Main Content -->
<main class="ml-64 pt-24 px-12 pb-12 min-h-screen">
<!-- Dashboard Header -->
<div class="flex justify-between items-end mb-10">
<div>
<span class="text-label-sm font-bold tracking-widest text-primary uppercase">Customer Relations</span>
<h2 class="text-4xl font-extrabold font-headline text-on-surface mt-2">客戶管理系統</h2>
<p class="text-on-surface-variant mt-2 max-w-lg">掌握您的核心資產，透過智能數據標籤實現精準化行銷與服務跟進。</p>
</div>
<div class="flex gap-3">
<button class="flex items-center gap-2 px-6 py-3 bg-tertiary-fixed text-on-tertiary-fixed rounded-full font-bold hover:brightness-95 transition-all">
<span class="material-symbols-outlined text-xl" data-icon="filter_list">filter_list</span>
                    進階篩選
                </button>
<button class="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
<span class="material-symbols-outlined text-xl" data-icon="person_add">person_add</span>
                    新增客戶
                </button>
</div>
</div>
<!-- Metrics Overview (Bento Style) -->
<div class="grid grid-cols-12 gap-6 mb-12">
<div class="col-span-8 bg-surface-container-low rounded-lg p-8 flex flex-col justify-between">
<div class="flex justify-between items-start">
<div>
<p class="text-on-surface-variant font-medium">活躍客戶增長趨勢</p>
<h3 class="text-5xl font-extrabold font-headline text-primary mt-2">1,284</h3>
</div>
<div class="flex items-center gap-1 text-tertiary font-bold bg-tertiary-fixed/30 px-3 py-1 rounded-full text-sm">
<span class="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
                        +12.5%
                    </div>
</div>
<div class="h-32 mt-6 flex items-end gap-2">
<div class="flex-1 bg-primary-container/20 rounded-t-lg h-12"></div>
<div class="flex-1 bg-primary-container/20 rounded-t-lg h-20"></div>
<div class="flex-1 bg-primary-container/20 rounded-t-lg h-16"></div>
<div class="flex-1 bg-primary-container/40 rounded-t-lg h-24"></div>
<div class="flex-1 bg-primary-container/60 rounded-t-lg h-28"></div>
<div class="flex-1 bg-primary-container rounded-t-lg h-32"></div>
<div class="flex-1 bg-primary-container/30 rounded-t-lg h-20"></div>
</div>
</div>
<div class="col-span-4 space-y-6">
<div class="bg-secondary-container rounded-lg p-8 text-on-secondary-container relative overflow-hidden">
<span class="material-symbols-outlined text-6xl absolute -right-4 -bottom-4 opacity-20 rotate-12" data-icon="workspace_premium">workspace_premium</span>
<p class="font-bold text-sm">VIP 客戶佔比</p>
<h4 class="text-4xl font-black font-headline mt-2">18.4%</h4>
<p class="text-xs mt-4 opacity-80">目標提升至 25% 以增加營收穩定性</p>
</div>
<div class="bg-white rounded-lg p-8 shadow-sm border border-outline-variant/10 flex items-center gap-6">
<div class="w-14 h-14 bg-surface-container-high rounded-full flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-3xl" data-icon="support_agent">support_agent</span>
</div>
<div>
<p class="text-xs text-on-surface-variant font-bold uppercase">待跟進客戶</p>
<p class="text-2xl font-black text-on-surface">42 位</p>
</div>
</div>
</div>
</div>
<!-- Customer Grid List -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
<!-- Customer Card 1 -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/5 hover:shadow-xl transition-all duration-500 group">
<div class="flex justify-between items-start mb-6">
<div class="relative">
<img class="w-16 h-16 rounded-2xl object-cover" data-alt="portrait of a confident woman in creative workspace, stylish professional look, soft warm lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6cScI-w0EDK8R0xIqLaeCippCYaWoGtoksbwtbJKEkxg0ukFMM2O6RU9GIc2sMXK2HFmag9hJGZFDnpS-6AagjFF4xnmmwofMh3Mwy2PWE-ADdYbA-xn78TOBi82kOb8gDLLP7gKm4RXF_3j_HJjCOAS27qIfD6oN7803WyN3IpM-plJR7rnYBvcOfXt_SFbaunpk6Wa49zn0GEM0kodXQou5K406Fdk2EbJPmHfsdKRRf9XqazFIIydzyv2QQxRbQApkjGEbQ7Wg"/>
<span class="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary text-[10px] px-2 py-0.5 rounded-full border-2 border-white">Active</span>
</div>
<button class="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
<div class="mb-6">
<h5 class="text-lg font-bold text-on-surface">陳美玲 Linda Chen</h5>
<div class="flex items-center gap-2 mt-2">
<span class="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-black px-3 py-1 rounded-full">鑽石會員</span>
<span class="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-3 py-1 rounded-full">科技零售</span>
</div>
</div>
<div class="space-y-3 py-4 border-t border-outline-variant/10">
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">聯絡電話</span>
<span class="font-bold text-on-surface">0912-***-456</span>
</div>
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">負責業務 ID</span>
<span class="text-primary font-bold">#SAL-2941</span>
</div>
</div>
<button class="w-full mt-2 py-3 text-sm font-bold text-primary bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-all">
                    完整資料
                </button>
</div>
<!-- Customer Card 2 -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/5 hover:shadow-xl transition-all duration-500 group">
<div class="flex justify-between items-start mb-6">
<div class="relative">
<img class="w-16 h-16 rounded-2xl object-cover" data-alt="successful middle-aged businessman, calm and authoritative expression, minimalist corporate background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFqwriKgiLqTB282bFr7LGcZ4qF0QOWw9lmcZHvsG3nNtNuBlcUnFWT_rmARLASAVpTHsSbbyvmcJEF0FdJgVlIt6zK7uXNY9TZDrINxlub-RCGMDF54A54bISinjJrMfpLz0oJmaFl_u6IZTcSMP-H2Y-mraUAaYaclsPKecz4TRczjealSTFY1WN0tpy6C7f6Ht85m-6iagNcQKfLcapM3LKLEYvfogem88RzBotL3Uuwe8XGn56a-Gr36aO-CnIgNdJ2gJZvuee"/>
<span class="absolute -bottom-1 -right-1 bg-stone-400 text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-white">Idle</span>
</div>
<button class="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
<div class="mb-6">
<h5 class="text-lg font-bold text-on-surface">王大明 David Wang</h5>
<div class="flex items-center gap-2 mt-2">
<span class="bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-black px-3 py-1 rounded-full">黃金會員</span>
<span class="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-3 py-1 rounded-full">傳統製造</span>
</div>
</div>
<div class="space-y-3 py-4 border-t border-outline-variant/10">
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">聯絡電話</span>
<span class="font-bold text-on-surface">0988-765-432</span>
</div>
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">負責業務 ID</span>
<span class="text-primary font-bold">#SAL-1102</span>
</div>
</div>
<button class="w-full mt-2 py-3 text-sm font-bold text-primary bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-all">
                    完整資料
                </button>
</div>
<!-- Customer Card 3 (Restricted Access) -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/5 hover:shadow-xl transition-all duration-500 group border-dashed">
<div class="flex justify-between items-start mb-6">
<div class="relative">
<div class="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
<span class="material-symbols-outlined text-3xl" data-icon="lock">lock</span>
</div>
</div>
<button class="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
<div class="mb-6">
<h5 class="text-lg font-bold text-on-surface">張** Sarah *</h5>
<div class="flex items-center gap-2 mt-2">
<span class="bg-surface-container text-on-surface-variant text-[10px] font-black px-3 py-1 rounded-full">一般客戶</span>
<span class="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-3 py-1 rounded-full">電子商務</span>
</div>
</div>
<div class="space-y-3 py-4 border-t border-outline-variant/10">
<div class="flex items-center justify-between text-sm italic text-on-surface-variant">
<span>聯絡電話</span>
<span>權限不足</span>
</div>
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">負責業務 ID</span>
<span class="text-primary font-bold">#SAL-8821</span>
</div>
</div>
<button class="w-full mt-2 py-3 text-sm font-bold text-on-surface-variant/50 bg-surface-container-high rounded-full cursor-not-allowed" disabled="">
                    無權限查看
                </button>
</div>
<!-- Customer Card 4 -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/5 hover:shadow-xl transition-all duration-500 group">
<div class="flex justify-between items-start mb-6">
<div class="relative">
<img class="w-16 h-16 rounded-2xl object-cover" data-alt="professional woman in modern creative environment, looking at camera, high fashion editorial style photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe6J_OFiRqGWO04nFHcdB9OrAzQSCUGdSG8xSbc7ph76FqXaV68-m1lg8qD7w__cPdH_G93YTAX_7rubPTV5l-fx8-FqDtg3Ltc6NkOrVqGudh9cI_q9I-huM1vo31m9PwsBNlRHy3ayJzJdMt7eNtiKbv6tnIHriOEUeAJAe0cPfaU7WSW-ooD3uw2zP_bOM_9DdEcx7qNdOTvs9xpKN20gUGLfo5p-q3Ez33-EjHhF4qb1jhqIcWjE8ouZbqfxcgQceWStCgRzoT"/>
<span class="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary text-[10px] px-2 py-0.5 rounded-full border-2 border-white">Active</span>
</div>
<button class="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
<div class="mb-6">
<h5 class="text-lg font-bold text-on-surface">林書雅 Sophie Lin</h5>
<div class="flex items-center gap-2 mt-2">
<span class="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-black px-3 py-1 rounded-full">鑽石會員</span>
<span class="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-3 py-1 rounded-full">醫藥生物</span>
</div>
</div>
<div class="space-y-3 py-4 border-t border-outline-variant/10">
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">聯絡電話</span>
<span class="font-bold text-on-surface">0921-998-112</span>
</div>
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">負責業務 ID</span>
<span class="text-primary font-bold">#SAL-5509</span>
</div>
</div>
<button class="w-full mt-2 py-3 text-sm font-bold text-primary bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-all">
                    完整資料
                </button>
</div>
<!-- Customer Card 5 -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/5 hover:shadow-xl transition-all duration-500 group">
<div class="flex justify-between items-start mb-6">
<div class="relative">
<img class="w-16 h-16 rounded-2xl object-cover" data-alt="charismatic young male architect in studio, bright airy professional atmosphere, focus on expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNJe5RlkQVSL7q_CCyQOle_-0gK20q-17ZbX00eI_1UOC116CloQeKYTuMa64bnoPiv0RWKEFAL1jtkWG0LLrmdrrVuqBKOKDw2nC7lq-pfIugzXTbFKtEOCfS2dnpyek-1VxTDmn5BbwN5NIpnXnvhnh-MAUkKYsfljZgwqu-_VndW_w5v0RM2ywKfXIv8ej-Buw1zYfuIyvIt-9beSXVhsCWoMdpFwt4Oig27Zj1ctrpa6VoHTiTbW-7QQvitZ9GYU2j7QWN6zJn"/>
<span class="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary text-[10px] px-2 py-0.5 rounded-full border-2 border-white">Active</span>
</div>
<button class="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
<div class="mb-6">
<h5 class="text-lg font-bold text-on-surface">何家豪 Kevin Ho</h5>
<div class="flex items-center gap-2 mt-2">
<span class="bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-black px-3 py-1 rounded-full">黃金會員</span>
<span class="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-3 py-1 rounded-full">房地產</span>
</div>
</div>
<div class="space-y-3 py-4 border-t border-outline-variant/10">
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">聯絡電話</span>
<span class="font-bold text-on-surface">0933-221-554</span>
</div>
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">負責業務 ID</span>
<span class="text-primary font-bold">#SAL-2231</span>
</div>
</div>
<button class="w-full mt-2 py-3 text-sm font-bold text-primary bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-all">
                    完整資料
                </button>
</div>
<!-- Customer Card 6 -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/5 hover:shadow-xl transition-all duration-500 group">
<div class="flex justify-between items-start mb-6">
<div class="relative">
<img class="w-16 h-16 rounded-2xl object-cover" data-alt="professional Asian woman in minimalist office setting, natural light, confident look" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc34Cx4cXzubHcqXCJQpKhCBaWgLUtjQ1jB4as__dAutjU1W7T_kNOh0jnPK89rjdsw5XFH--vFqbzgOhaC1HtmhSz6lpwfTJXCr5HkAv6ArNPASQY0-xVegxsiVqsTO4VsNAskGdgKT7LxHAMohVfxiaDSFH0yccuNxzaYBufSDN1CRUQDOYqkUiiE0bm_PEvif9bxkohCLwKMV2Ykh8h6PchSXOMuecnahw9Td_I_7stVJp_f9_HBydRMwt26y1CtDAzr2niNiQG"/>
<span class="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary text-[10px] px-2 py-0.5 rounded-full border-2 border-white">Active</span>
</div>
<button class="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
<div class="mb-6">
<h5 class="text-lg font-bold text-on-surface">郭靜宜 Emily Kuo</h5>
<div class="flex items-center gap-2 mt-2">
<span class="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-black px-3 py-1 rounded-full">白銀會員</span>
<span class="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-3 py-1 rounded-full">物流服務</span>
</div>
</div>
<div class="space-y-3 py-4 border-t border-outline-variant/10">
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">聯絡電話</span>
<span class="font-bold text-on-surface">0972-***-991</span>
</div>
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">負責業務 ID</span>
<span class="text-primary font-bold">#SAL-4410</span>
</div>
</div>
<button class="w-full mt-2 py-3 text-sm font-bold text-primary bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-all">
                    完整資料
                </button>
</div>
<!-- Customer Card 7 (Restricted Access) -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/5 hover:shadow-xl transition-all duration-500 group border-dashed">
<div class="flex justify-between items-start mb-6">
<div class="relative">
<div class="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
<span class="material-symbols-outlined text-3xl" data-icon="lock">lock</span>
</div>
</div>
<button class="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
<div class="mb-6">
<h5 class="text-lg font-bold text-on-surface">周** Kevin *</h5>
<div class="flex items-center gap-2 mt-2">
<span class="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-black px-3 py-1 rounded-full">白銀會員</span>
<span class="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-3 py-1 rounded-full">金融投資</span>
</div>
</div>
<div class="space-y-3 py-4 border-t border-outline-variant/10">
<div class="flex items-center justify-between text-sm italic text-on-surface-variant">
<span>聯絡電話</span>
<span>權限不足</span>
</div>
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">負責業務 ID</span>
<span class="text-primary font-bold">#SAL-0098</span>
</div>
</div>
<button class="w-full mt-2 py-3 text-sm font-bold text-on-surface-variant/50 bg-surface-container-high rounded-full cursor-not-allowed" disabled="">
                    無權限查看
                </button>
</div>
<!-- Customer Card 8 -->
<div class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/5 hover:shadow-xl transition-all duration-500 group">
<div class="flex justify-between items-start mb-6">
<div class="relative">
<img class="w-16 h-16 rounded-2xl object-cover" data-alt="stylish young professional woman in bright modern office, cheerful expression, soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVN7snInRi9KUuSyHzDyL8Yle48mCNKjHLcp4YysFT2ASDwcM0wDni0KPaHaObiA-rtEK0yArNP3egvtWk0sRSio5aYBTiHiGwZfjqgZLJv4tO-EYe2X0i430g39qbLnQ2GsaAY1nONcIWzmtrHf-SKUVytpGt1QvIjh2_uuDcvtFQ0HPD1pjak661TvDbDJvFw6iCAgoZLzc0njTz8TAS_AikZ73cylaF1W9EH_GvpFDqVynMjE-lfdNaadFHklEBhwhDtbZsge4t"/>
<span class="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary text-[10px] px-2 py-0.5 rounded-full border-2 border-white">Active</span>
</div>
<button class="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
<div class="mb-6">
<h5 class="text-lg font-bold text-on-surface">沈佳宜 Joy Shen</h5>
<div class="flex items-center gap-2 mt-2">
<span class="bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-black px-3 py-1 rounded-full">黃金會員</span>
<span class="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-3 py-1 rounded-full">教育訓練</span>
</div>
</div>
<div class="space-y-3 py-4 border-t border-outline-variant/10">
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">聯絡電話</span>
<span class="font-bold text-on-surface">0955-442-123</span>
</div>
<div class="flex items-center justify-between text-sm">
<span class="text-on-surface-variant">負責業務 ID</span>
<span class="text-primary font-bold">#SAL-3392</span>
</div>
</div>
<button class="w-full mt-2 py-3 text-sm font-bold text-primary bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-all">
                    完整資料
                </button>
</div>
</div>
<!-- Pagination -->
<div class="mt-16 flex items-center justify-between">
<p class="text-sm text-on-surface-variant">顯示第 1 至 8 筆客戶，共 1,284 筆</p>
<div class="flex gap-2">
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-outline-variant/20 text-on-surface-variant hover:bg-primary hover:text-white transition-all">
<span class="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary font-bold">1</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-outline-variant/20 text-on-surface-variant hover:bg-primary-container hover:text-white transition-all">2</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-outline-variant/20 text-on-surface-variant hover:bg-primary-container hover:text-white transition-all">3</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-outline-variant/20 text-on-surface-variant hover:bg-primary-container hover:text-white transition-all">...</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-outline-variant/20 text-on-surface-variant hover:bg-primary-container hover:text-white transition-all">160</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-outline-variant/20 text-on-surface-variant hover:bg-primary hover:text-white transition-all">
<span class="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</main>
</body></html>