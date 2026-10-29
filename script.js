/**
 * DomusTempo - Assistente de Rotina Doméstica & Tempo
 * Gerenciador inteligente de tempo para tarefas domésticas e lazer
 */

// =============================================================================
// 1. CONFIGURAÇÕES & DADOS PADRÃO
// =============================================================================

const STORAGE_KEYS = {
    BLOCKS: 'domus_routine_blocks_v1',
    SETTINGS: 'domus_settings_v1',
    THEME: 'domus_theme_mode',
    LAST_DATE: 'domus_last_active_date'
};

const ZONES_CONFIG = {
    cozinha: {
        name: "Cozinha & Louça",
        icon: "fa-utensils",
        badgeClass: "badge-cozinha",
        colorHex: "#f59e0b",
        bgLight: "bg-amber-500/10",
        textLight: "text-amber-600 dark:text-amber-400"
    },
    quarto: {
        name: "Quarto & Organização",
        icon: "fa-bed",
        badgeClass: "badge-quarto",
        colorHex: "#a855f7",
        bgLight: "bg-purple-500/10",
        textLight: "text-purple-600 dark:text-purple-400"
    },
    lazer: {
        name: "Lazer & Videogame",
        icon: "fa-gamepad",
        badgeClass: "badge-lazer",
        colorHex: "#10b981",
        bgLight: "bg-emerald-500/10",
        textLight: "text-emerald-600 dark:text-emerald-400"
    },
    alimentacao: {
        name: "Alimentação & Refeição",
        icon: "fa-mug-hot",
        badgeClass: "badge-alimentacao",
        colorHex: "#3b82f6",
        bgLight: "bg-blue-500/10",
        textLight: "text-blue-600 dark:text-blue-400"
    },
    geral: {
        name: "Manutenção & Geral",
        icon: "fa-sparkles",
        badgeClass: "badge-geral",
        colorHex: "#64748b",
        bgLight: "bg-slate-500/10",
        textLight: "text-slate-600 dark:text-slate-400"
    }
};

const PRODUCTIVITY_HACKS = [
    {
        title: "Clean As You Go (Lave Enquanto Cozinha)",
        text: "A maior causa de desânimo na cozinha é ver a pia cheia depois de comer. Enquanto a água ferve ou algo assa, lave imediatamente facas, tábuas e panelas. Ao sentar para comer, só sobrará o seu prato e talher!"
    },
    {
        title: "A Regra dos 2 Minutos para a Casa",
        text: "Se você viu algo fora do lugar e devolver ao local leva menos de 2 minutos (ex: guardar um par de sapatos, pendurar uma toalha, levar um copo para a pia), faça na hora. Isso evita 80% da bagunça acumulada no fim da semana."
    },
    {
        title: "O Tiro de 15 Minutos na Pia (Speedrun)",
        text: "Quase nenhuma louça do dia a dia demora mais de 15 minutos se você colocar um cronômetro e não parar. Coloque uma música ou podcast, acione o timer e tente bater o relógio!"
    },
    {
        title: "Videogame como Recompensa Limpa",
        text: "Jogar com a pia limpa e o quarto alinhado elimina aquele incômodo no fundo da mente de 'eu deveria estar fazendo outra coisa'. Seu momento de lazer fica 100% protegido e relaxante."
    },
    {
        title: "O Reset Noturno de 10 Minutos",
        text: "Antes de ligar o console à noite ou ir dormir, gaste 10 minutos para recolher lixo, guardar itens no quarto e garantir que a pia está sem pratos. Acordar com a casa em ordem muda completamente o humor da manhã."
    },
    {
        title: "Cesto de Transição no Quarto",
        text: "Tenha um gancho ou cesto pequeno para 'roupas que usei mas ainda não vão para a lavagem'. Isso elimina de vez a clássica cadeira ou montanha de roupas em cima da cama."
    }
];

const DEFAULT_BLOCKS = [
    {
        id: "b1",
        title: "Café da Manhã & Pia Zerada",
        zone: "cozinha",
        tag: "Âncora",
        startTime: "08:30",
        duration: 30,
        description: "Tomar o café da manhã com tranquilidade e já lavar a xícara e prato imediatamente.",
        completed: false
    },
    {
        id: "b2",
        title: "Reset Rápido do Quarto",
        zone: "quarto",
        tag: "Manutenção",
        startTime: "09:00",
        duration: 20,
        description: "Esticar o lençol/cama, recolher roupas fora do lugar, esvaziar lixeirinha e abrir janelas para ventilar.",
        completed: false
    },
    {
        id: "b3",
        title: "Cozinhar o Almoço (Clean-as-you-go)",
        zone: "cozinha",
        tag: "Âncora",
        startTime: "12:00",
        duration: 45,
        description: "Preparar a refeição principal lavando panelas e tábuas durante as pausas de cozimento.",
        completed: false
    },
    {
        id: "b4",
        title: "Almoço & Descanso",
        zone: "alimentacao",
        tag: "Refeição",
        startTime: "12:45",
        duration: 30,
        description: "Momento dedicado à refeição sem correria, longe de telas de trabalho.",
        completed: false
    },
    {
        id: "b5",
        title: "Lavar Louça do Almoço",
        zone: "cozinha",
        tag: "Manutenção",
        startTime: "13:15",
        duration: 15,
        description: "Tiro focado de 15 minutos: prato, talheres e secar a bancada. Pia 100% zerada.",
        completed: false
    },
    {
        id: "b6",
        title: "Pausa / Videogame da Tarde (Opcional)",
        zone: "lazer",
        tag: "Descompressão",
        startTime: "14:00",
        duration: 60,
        description: "Uma sessão curta de videogame ou lazer para recarregar as energias para o restante do dia.",
        completed: false
    },
    {
        id: "b7",
        title: "Cozinhar & Jantar",
        zone: "cozinha",
        tag: "Âncora",
        startTime: "19:30",
        duration: 45,
        description: "Preparo prático do jantar ou lanche da noite + momento de alimentação.",
        completed: false
    },
    {
        id: "b8",
        title: "Lavar Louça da Noite",
        zone: "cozinha",
        tag: "Manutenção",
        startTime: "20:15",
        duration: 15,
        description: "Lavar os utensílios do jantar para amanhecer o dia seguinte com a cozinha impecável.",
        completed: false
    },
    {
        id: "b9",
        title: "Videogame & Lazer Noturno (Livre de Culpa)",
        zone: "lazer",
        tag: "Descompressão",
        startTime: "20:30",
        duration: 150,
        description: "Tempo sagrado de gameplay e relaxamento total. Tarefas domésticas já estão 100% pagas!",
        completed: false
    }
];

// Presets pré-configurados
const PRESETS = {
    padrao: DEFAULT_BLOCKS,
    express: [
        {
            id: "exp1",
            title: "Café Rápido & Louça Imediata",
            zone: "cozinha",
            tag: "Âncora",
            startTime: "08:00",
            duration: 20,
            description: "Café ágil e louça lavada instantaneamente.",
            completed: false
        },
        {
            id: "exp2",
            title: "Arrumação Express do Quarto",
            zone: "quarto",
            tag: "Manutenção",
            startTime: "08:20",
            duration: 10,
            description: "Apenas puxar o edredom e tirar lixo.",
            completed: false
        },
        {
            id: "exp3",
            title: "Almoço Rápido / Prato Único",
            zone: "cozinha",
            tag: "Âncora",
            startTime: "12:15",
            duration: 30,
            description: "Comida rápida ou aquecida para ganhar tempo.",
            completed: false
        },
        {
            id: "exp4",
            title: "Alimentação Almoço",
            zone: "alimentacao",
            tag: "Refeição",
            startTime: "12:45",
            duration: 20,
            description: "Alimentar-se com foco e recarregar.",
            completed: false
        },
        {
            id: "exp5",
            title: "Louça Express Almoço",
            zone: "cozinha",
            tag: "Manutenção",
            startTime: "13:05",
            duration: 10,
            description: "Limpeza de prato e frigideira em 10 min.",
            completed: false
        },
        {
            id: "exp6",
            title: "Jantar Prático",
            zone: "cozinha",
            tag: "Âncora",
            startTime: "19:30",
            duration: 30,
            description: "Refeição leve da noite.",
            completed: false
        },
        {
            id: "exp7",
            title: "Louça da Noite Express",
            zone: "cozinha",
            tag: "Manutenção",
            startTime: "20:00",
            duration: 10,
            description: "Pia zerada sem enrolar.",
            completed: false
        },
        {
            id: "exp8",
            title: "Super Sessão Videogame Livre",
            zone: "lazer",
            tag: "Descompressão",
            startTime: "20:15",
            duration: 180,
            description: "3 horas inteiras de lazer garantidas!",
            completed: false
        }
    ],
    gamer: [
        {
            id: "gm1",
            title: "Brunch & Café da Manhã",
            zone: "cozinha",
            tag: "Âncora",
            startTime: "09:30",
            duration: 30,
            description: "Café tardio do fim de semana.",
            completed: false
        },
        {
            id: "gm2",
            title: "Reset Rápido Quarto",
            zone: "quarto",
            tag: "Manutenção",
            startTime: "10:00",
            duration: 15,
            description: "Deixar o quarto agradável para a jogatina.",
            completed: false
        },
        {
            id: "gm3",
            title: "Maratona Gamer Parte 1",
            zone: "lazer",
            tag: "Descompressão",
            startTime: "10:15",
            duration: 120,
            description: "Duas horas livres de games pela manhã.",
            completed: false
        },
        {
            id: "gm4",
            title: "Cozinhar Almoço Especial",
            zone: "cozinha",
            tag: "Âncora",
            startTime: "12:30",
            duration: 60,
            description: "Preparo de almoço saboroso.",
            completed: false
        },
        {
            id: "gm5",
            title: "Almoço & Louça em Dobro",
            zone: "cozinha",
            tag: "Manutenção",
            startTime: "13:30",
            duration: 40,
            description: "Comer com calma e zerar toda a louça.",
            completed: false
        },
        {
            id: "gm6",
            title: "Maratona Gamer Parte 2 (Tarde/Noite)",
            zone: "lazer",
            tag: "Descompressão",
            startTime: "15:00",
            duration: 240,
            description: "Maratona completa de 4 horas sem preocupações!",
            completed: false
        },
        {
            id: "gm7",
            title: "Lanche da Noite & Fechamento",
            zone: "cozinha",
            tag: "Âncora",
            startTime: "20:00",
            duration: 30,
            description: "Lanche rápido e deixar tudo limpo para o dia seguinte.",
            completed: false
        }
    ],
    faxina: [
        {
            id: "fx1",
            title: "Café Energético & Louça",
            zone: "cozinha",
            tag: "Âncora",
            startTime: "08:30",
            duration: 30,
            description: "Café reforçado para ter energia.",
            completed: false
        },
        {
            id: "fx2",
            title: "Faxina Profunda do Quarto",
            zone: "quarto",
            tag: "Manutenção",
            startTime: "09:00",
            duration: 45,
            description: "Trocar roupa de cama, aspirar/varrer chão, tirar pó de mesas e organizar armários.",
            completed: false
        },
        {
            id: "fx3",
            title: "Cozinha: Almoço & Faxina de Armários",
            zone: "cozinha",
            tag: "Âncora",
            startTime: "11:30",
            duration: 75,
            description: "Cozinhar e limpar bancada, fogão e geladeira.",
            completed: false
        },
        {
            id: "fx4",
            title: "Almoço & Descanso Merecido",
            zone: "alimentacao",
            tag: "Refeição",
            startTime: "12:45",
            duration: 35,
            description: "Comer tranquilo.",
            completed: false
        },
        {
            id: "fx5",
            title: "Louça Total do Almoço",
            zone: "cozinha",
            tag: "Manutenção",
            startTime: "13:20",
            duration: 20,
            description: "Secar e guardar tudo.",
            completed: false
        },
        {
            id: "fx6",
            title: "Videogame: Recompensa da Faxina",
            zone: "lazer",
            tag: "Descompressão",
            startTime: "15:00",
            duration: 180,
            description: "Recompensa de ouro: jogar no quarto cheiroso e casa brilhando!",
            completed: false
        }
    ]
};

// =============================================================================
// 2. ESTADO DA APLICAÇÃO
// =============================================================================

const AppState = {
    blocks: [],
    currentHackIndex: 0,
    activeTab: 'timeline',
    
    // Timer State
    timer: {
        activeBlockId: null,
        durationSeconds: 0,
        remainingSeconds: 0,
        intervalId: null,
        isRunning: false
    },

    // Audio Context
    audioCtx: null
};

// =============================================================================
// 3. UTILITÁRIOS & ÁUDIO
// =============================================================================

function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

function minutesToTime(totalMinutes) {
    let norm = (totalMinutes % 1440 + 1440) % 1440;
    const h = Math.floor(norm / 60);
    const m = norm % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatDuration(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function getAudioContext() {
    if (!AppState.audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
            AppState.audioCtx = new AudioCtxClass();
        }
    }
    if (AppState.audioCtx && AppState.audioCtx.state === 'suspended') {
        AppState.audioCtx.resume();
    }
    return AppState.audioCtx;
}

function playNotificationSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde C Maior (Dó, Mi, Sol, Dó)
        
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);

            gain.gain.setValueAtTime(0.2, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.65);
        });
    } catch (e) {
        console.warn("Áudio não pôde ser reproduzido:", e);
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColors = {
        success: 'bg-emerald-600 text-white',
        info: 'bg-sky-600 text-white',
        warning: 'bg-amber-600 text-white',
        error: 'bg-rose-600 text-white'
    };

    const icons = {
        success: 'fa-circle-check',
        info: 'fa-circle-info',
        warning: 'fa-triangle-exclamation',
        error: 'fa-circle-xmark'
    };

    toast.className = `p-3.5 rounded-2xl shadow-lg flex items-center gap-3 text-xs sm:text-sm font-semibold toast-enter pointer-events-auto ${bgColors[type] || bgColors.success}`;
    toast.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.success} text-base flex-shrink-0"></i>
        <span class="flex-1">${message}</span>
        <button class="opacity-70 hover:opacity-100 transition p-1" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 250);
    }, 3500);
}

// =============================================================================
// 4. PERSISTÊNCIA & CARREGAMENTO
// =============================================================================

function saveBlocks() {
    try {
        localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(AppState.blocks));
        localStorage.setItem(STORAGE_KEYS.LAST_DATE, getTodayString());
    } catch (e) {
        console.error("Erro ao salvar blocos:", e);
    }
}

function loadBlocks() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.BLOCKS);
        const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_DATE);
        const today = getTodayString();

        if (saved) {
            AppState.blocks = JSON.parse(saved);

            // Se for um novo dia, resetar as marcações de 'completed', mas preservar as tarefas
            if (lastDate && lastDate !== today) {
                AppState.blocks.forEach(b => b.completed = false);
                saveBlocks();
                showToast("Bom dia! As tarefas de hoje foram renovadas.", "info");
            }
        } else {
            AppState.blocks = JSON.parse(JSON.stringify(DEFAULT_BLOCKS));
            saveBlocks();
        }
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
        AppState.blocks = JSON.parse(JSON.stringify(DEFAULT_BLOCKS));
    }
}

// =============================================================================
// 5. RENDERIZAÇÃO & ATUALIZAÇÃO DA INTERFACE
// =============================================================================

function sortBlocksByStartTime() {
    AppState.blocks.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
}

function updateStatsAndBanner() {
    let kitchenMins = 0;
    let bedroomMins = 0;
    let leisureMins = 0;
    let mealsMins = 0;
    let completedCount = 0;
    const totalCount = AppState.blocks.length;

    AppState.blocks.forEach(block => {
        const dur = Number(block.duration) || 0;
        if (block.zone === 'cozinha') kitchenMins += dur;
        else if (block.zone === 'quarto') bedroomMins += dur;
        else if (block.zone === 'lazer') leisureMins += dur;
        else if (block.zone === 'alimentacao') mealsMins += dur;

        if (block.completed) completedCount++;
    });

    // Atualiza estatísticas no topo
    const elKitchen = document.getElementById('stat-kitchen-time');
    const elBedroom = document.getElementById('stat-bedroom-time');
    const elLeisure = document.getElementById('stat-leisure-time');
    const elProgressText = document.getElementById('stat-progress-text');
    const elProgressBar = document.getElementById('stat-progress-bar');
    const elProgressCount = document.getElementById('stat-progress-count');

    if (elKitchen) elKitchen.textContent = formatDuration(kitchenMins);
    if (elBedroom) elBedroom.textContent = formatDuration(bedroomMins);
    if (elLeisure) elLeisure.textContent = formatDuration(leisureMins);

    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    if (elProgressText) elProgressText.textContent = `${pct}%`;
    if (elProgressBar) elProgressBar.style.width = `${pct}%`;
    if (elProgressCount) elProgressCount.textContent = `${completedCount} de ${totalCount} tarefas concluídas`;

    // Atualiza contadores das zonas no checklist
    updateZoneCounters();

    // Atualiza o Banner Dinâmico (Agora / Próximo)
    updateCurrentBlockBanner();

    // Atualiza o gráfico de 24 horas
    renderDayChart(kitchenMins, bedroomMins, leisureMins, mealsMins);
}

function updateZoneCounters() {
    const zones = ['cozinha', 'quarto', 'lazer', 'alimentacao'];
    zones.forEach(zone => {
        const zoneBlocks = AppState.blocks.filter(b => b.zone === zone);
        const done = zoneBlocks.filter(b => b.completed).length;
        const total = zoneBlocks.length;
        const elBadge = document.getElementById(`zone-badge-${zone}`);
        if (elBadge) {
            elBadge.textContent = `${done}/${total}`;
            if (done === total && total > 0) {
                elBadge.className = "text-xs font-bold text-emerald-600 dark:text-emerald-400";
            } else {
                elBadge.className = "text-xs font-semibold text-slate-500";
            }
        }
    });
}

function updateCurrentBlockBanner() {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let activeBlock = null;
    let upcomingBlock = null;
    let minTimeDiff = Infinity;

    for (const b of AppState.blocks) {
        const start = timeToMinutes(b.startTime);
        const end = start + (Number(b.duration) || 0);

        if (currentMins >= start && currentMins < end) {
            activeBlock = b;
            break;
        }

        if (start > currentMins && (start - currentMins) < minTimeDiff) {
            minTimeDiff = start - currentMins;
            upcomingBlock = b;
        }
    }

    const bannerBlock = activeBlock || upcomingBlock || AppState.blocks[0];

    const elTitle = document.getElementById('current-banner-title');
    const elTime = document.getElementById('current-banner-time');
    const elDesc = document.getElementById('current-banner-desc');
    const elBadge = document.getElementById('current-banner-badge');
    const elIconBg = document.getElementById('current-banner-icon-bg');
    const btnCheck = document.getElementById('btn-banner-check');
    const btnTimer = document.getElementById('btn-banner-timer');

    if (!bannerBlock) {
        if (elTitle) elTitle.textContent = "Nenhum bloco cadastrado";
        return;
    }

    const start = timeToMinutes(bannerBlock.startTime);
    const end = start + (Number(bannerBlock.duration) || 0);
    const endTimeStr = minutesToTime(end);

    const isOngoing = activeBlock && activeBlock.id === bannerBlock.id;

    if (elTitle) elTitle.textContent = bannerBlock.title;
    if (elDesc) elDesc.textContent = bannerBlock.description || "Mantenha o ritmo leve e focado!";
    if (elTime) {
        elTime.textContent = isOngoing
            ? `${bannerBlock.startTime} – ${endTimeStr} (Em andamento)`
            : `${bannerBlock.startTime} – ${endTimeStr}`;
    }
    if (elBadge) {
        elBadge.textContent = isOngoing ? "Acontecendo Agora" : "Próximo Bloco";
    }

    const zConfig = ZONES_CONFIG[bannerBlock.zone] || ZONES_CONFIG.geral;
    if (elIconBg) {
        elIconBg.className = `fa-solid ${zConfig.icon}`;
    }

    if (btnCheck) {
        btnCheck.innerHTML = bannerBlock.completed
            ? `<i class="fa-solid fa-check"></i> Concluído!`
            : `<i class="fa-regular fa-circle-check"></i> Marcar Concluído`;
        btnCheck.onclick = () => toggleBlockCompletion(bannerBlock.id);
    }

    if (btnTimer) {
        btnTimer.onclick = () => openTimerModal(bannerBlock.id);
    }
}

function renderTimeline() {
    const container = document.getElementById('timeline-blocks-container');
    if (!container) return;

    // Preserva o stem vertical
    container.innerHTML = '<div class="timeline-stem"></div>';

    sortBlocksByStartTime();

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const countEl = document.getElementById('timeline-count');
    if (countEl) countEl.textContent = AppState.blocks.length;

    AppState.blocks.forEach((block, index) => {
        const start = timeToMinutes(block.startTime);
        const end = start + (Number(block.duration) || 0);
        const endTimeStr = minutesToTime(end);
        const isCurrent = currentMins >= start && currentMins < end;

        const zone = ZONES_CONFIG[block.zone] || ZONES_CONFIG.geral;

        const card = document.createElement('div');
        card.className = `relative pl-8 sm:pl-10 group transition-all duration-200 ${block.completed ? 'task-done' : ''}`;

        // Marcador circular na linha do tempo
        const markerClass = block.completed
            ? 'bg-emerald-500 text-white shadow-emerald-500/30'
            : isCurrent
                ? 'bg-sky-500 text-white ring-4 ring-sky-500/20 animate-pulse'
                : 'bg-white dark:bg-slate-700 text-slate-400 border border-slate-300 dark:border-slate-600';

        card.innerHTML = `
            <!-- Ícone na linha do tempo -->
            <div class="absolute left-0 top-3.5 -translate-x-1/2 w-8 h-8 rounded-full ${markerClass} flex items-center justify-center text-xs font-bold shadow-sm transition z-10">
                ${block.completed ? '<i class="fa-solid fa-check"></i>' : `<i class="fa-solid ${zone.icon}"></i>`}
            </div>

            <!-- Card Principal -->
            <div class="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border ${isCurrent ? 'border-sky-500 block-is-now' : 'border-slate-200 dark:border-slate-700'} shadow-sm hover:shadow-md transition">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    <!-- Lado Esquerdo: Checkbox + Título + Descrição -->
                    <div class="flex items-start gap-3 min-w-0">
                        <button onclick="toggleBlockCompletion('${block.id}')" class="mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition flex-shrink-0 ${block.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'}">
                            ${block.completed ? '<i class="fa-solid fa-check text-xs"></i>' : ''}
                        </button>
                        <div class="min-w-0">
                            <div class="flex items-center flex-wrap gap-2">
                                <h4 class="font-bold text-slate-800 dark:text-white text-sm sm:text-base ${block.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}">
                                    ${escapeHtml(block.title)}
                                </h4>
                                <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold border ${zone.badgeClass}">
                                    ${zone.name}
                                </span>
                                ${block.tag ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${block.tag}</span>` : ''}
                            </div>
                            ${block.description ? `<p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">${escapeHtml(block.description)}</p>` : ''}
                        </div>
                    </div>

                    <!-- Lado Direito: Horários, Duração & Ações -->
                    <div class="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60 w-full sm:w-auto justify-between sm:justify-end">
                        <div class="text-right">
                            <span class="text-xs sm:text-sm font-mono font-bold text-slate-700 dark:text-slate-200">
                                ${block.startTime} – ${endTimeStr}
                            </span>
                            <span class="block text-[11px] text-slate-400 font-medium">
                                ${formatDuration(block.duration)}
                            </span>
                        </div>

                        <!-- Botão Timer -->
                        <button onclick="openTimerModal('${block.id}')" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs font-semibold transition" title="Iniciar Timer deste bloco">
                            <i class="fa-solid fa-stopwatch text-emerald-500"></i>
                        </button>

                        <!-- Botão Editar -->
                        <button onclick="openEditBlockModal('${block.id}')" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 text-xs font-semibold transition" title="Editar bloco">
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <!-- Botão Excluir -->
                        <button onclick="deleteBlock('${block.id}')" class="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-700 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold transition" title="Excluir bloco">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>

                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function renderChecklistByZones() {
    const zones = ['cozinha', 'quarto', 'lazer', 'alimentacao'];

    zones.forEach(zoneKey => {
        const container = document.getElementById(`checklist-zone-${zoneKey}`);
        if (!container) return;

        container.innerHTML = '';
        const zoneBlocks = AppState.blocks.filter(b => b.zone === zoneKey);

        if (zoneBlocks.length === 0) {
            container.innerHTML = '<p class="text-xs text-slate-400 italic py-2">Nenhum afazer cadastrado nesta zona.</p>';
            return;
        }

        zoneBlocks.forEach(block => {
            const item = document.createElement('div');
            item.className = `flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition ${block.completed ? 'opacity-60' : ''}`;
            
            item.innerHTML = `
                <div class="flex items-center gap-3 min-w-0">
                    <button onclick="toggleBlockCompletion('${block.id}')" class="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${block.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}">
                        ${block.completed ? '<i class="fa-solid fa-check text-[10px]"></i>' : ''}
                    </button>
                    <div class="truncate">
                        <span class="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate ${block.completed ? 'line-through text-slate-400' : ''}">
                            ${escapeHtml(block.title)}
                        </span>
                        <span class="text-[11px] font-mono text-slate-400">
                            ${block.startTime} (${formatDuration(block.duration)})
                        </span>
                    </div>
                </div>
                <button onclick="openTimerModal('${block.id}')" class="text-slate-400 hover:text-emerald-500 text-xs p-1">
                    <i class="fa-solid fa-play"></i>
                </button>
            `;

            container.appendChild(item);
        });
    });
}

function renderDayChart(kitchenMins, bedroomMins, leisureMins, mealsMins) {
    const container = document.getElementById('day-bar-container');
    if (!container) return;

    container.innerHTML = '';

    const totalTracked = kitchenMins + bedroomMins + leisureMins + mealsMins;
    const dayTotal = 1440; // 24 horas = 1440 min
    const freeOrSleepMins = Math.max(0, dayTotal - totalTracked);

    const kPct = Math.round((kitchenMins / dayTotal) * 100);
    const bPct = Math.round((bedroomMins / dayTotal) * 100);
    const lPct = Math.round((leisureMins / dayTotal) * 100);
    const mPct = Math.round((mealsMins / dayTotal) * 100);

    const elKPct = document.getElementById('chart-pct-kitchen');
    const elBPct = document.getElementById('chart-pct-bedroom');
    const elLPct = document.getElementById('chart-pct-leisure');
    const elMPct = document.getElementById('chart-pct-meals');

    if (elKPct) elKPct.textContent = `${kPct}% (${formatDuration(kitchenMins)})`;
    if (elBPct) elBPct.textContent = `${bPct}% (${formatDuration(bedroomMins)})`;
    if (elLPct) elLPct.textContent = `${lPct}% (${formatDuration(leisureMins)})`;
    if (elMPct) elMPct.textContent = `${mPct}% (${formatDuration(mealsMins)})`;

    // Segmentos visuais na barra
    const segments = [
        { name: "Cozinha & Louça", mins: kitchenMins, bg: "bg-amber-500" },
        { name: "Quarto", mins: bedroomMins, bg: "bg-purple-500" },
        { name: "Videogame/Lazer", mins: leisureMins, bg: "bg-emerald-500" },
        { name: "Refeições", mins: mealsMins, bg: "bg-sky-500" },
        { name: "Sono & Horas Livres", mins: freeOrSleepMins, bg: "bg-slate-200 dark:bg-slate-700" }
    ];

    segments.forEach(seg => {
        if (seg.mins > 0) {
            const widthPct = (seg.mins / dayTotal) * 100;
            const barSeg = document.createElement('div');
            barSeg.className = `${seg.bg} h-full transition-all duration-300 relative group cursor-pointer`;
            barSeg.style.width = `${widthPct}%`;
            barSeg.title = `${seg.name}: ${formatDuration(seg.mins)} (${Math.round(widthPct)}%)`;
            container.appendChild(barSeg);
        }
    });
}

function renderAll() {
    renderTimeline();
    renderChecklistByZones();
    updateStatsAndBanner();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================================================
// 6. AÇÕES DOS BLOCOS (CONCLUIR, EDITAR, EXCLUIR)
// =============================================================================

function toggleBlockCompletion(blockId) {
    const block = AppState.blocks.find(b => b.id === blockId);
    if (!block) return;

    block.completed = !block.completed;
    saveBlocks();
    renderAll();

    if (block.completed) {
        showToast(`"${block.title}" concluído! Excelente progresso.`, 'success');
        
        // Se todas as tarefas estiverem completas, soltar confete!
        const allCompleted = AppState.blocks.length > 0 && AppState.blocks.every(b => b.completed);
        if (allCompleted && typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            showToast("🎉 Parabéns! Rotina do dia 100% finalizada!", 'success');
        }
    }
}

function deleteBlock(blockId) {
    const idx = AppState.blocks.findIndex(b => b.id === blockId);
    if (idx === -1) return;

    const title = AppState.blocks[idx].title;
    AppState.blocks.splice(idx, 1);
    saveBlocks();
    renderAll();
    showToast(`Bloco "${title}" removido.`, 'info');
}

function openEditBlockModal(blockId) {
    const block = AppState.blocks.find(b => b.id === blockId);
    if (!block) return;

    document.getElementById('form-modal-title').textContent = "Editar Bloco da Rotina";
    document.getElementById('form-block-id').value = block.id;
    document.getElementById('form-title').value = block.title;
    document.getElementById('form-zone').value = block.zone;
    document.getElementById('form-tag').value = block.tag || 'Âncora';
    document.getElementById('form-start-time').value = block.startTime;
    document.getElementById('form-duration').value = block.duration;
    document.getElementById('form-description').value = block.description || '';

    document.getElementById('modal-block-form').classList.remove('hidden');
}

function openNewBlockModal() {
    document.getElementById('form-modal-title').textContent = "Criar Novo Bloco";
    document.getElementById('form-block-id').value = '';
    document.getElementById('form-title').value = '';
    document.getElementById('form-zone').value = 'cozinha';
    document.getElementById('form-tag').value = 'Âncora';
    document.getElementById('form-start-time').value = '14:00';
    document.getElementById('form-duration').value = '30';
    document.getElementById('form-description').value = '';

    document.getElementById('modal-block-form').classList.remove('hidden');
}

// =============================================================================
// 7. TIMER DO BLOCO (TIME-BLOCK RUNNER)
// =============================================================================

function openTimerModal(blockId) {
    const block = AppState.blocks.find(b => b.id === blockId);
    if (!block) return;

    // Se já havia um timer rodando para outro bloco, pausa
    if (AppState.timer.intervalId) {
        clearInterval(AppState.timer.intervalId);
    }

    const durationSec = (Number(block.duration) || 15) * 60;
    AppState.timer.activeBlockId = block.id;
    AppState.timer.durationSeconds = durationSec;
    AppState.timer.remainingSeconds = durationSec;
    AppState.timer.isRunning = false;

    // Atualiza modal
    const zone = ZONES_CONFIG[block.zone] || ZONES_CONFIG.geral;
    const badge = document.getElementById('timer-modal-zone-badge');
    if (badge) {
        badge.textContent = zone.name;
        badge.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${zone.badgeClass}`;
    }

    document.getElementById('timer-modal-title').textContent = block.title;
    document.getElementById('timer-modal-desc').textContent = block.description || "Foco total para cumprir o tempo planejado.";

    updateTimerDisplay();

    document.getElementById('timer-toggle-text').textContent = "Começar";
    document.getElementById('timer-toggle-icon').className = "fa-solid fa-play";
    document.getElementById('timer-status-label').textContent = "Pronto";

    document.getElementById('modal-timer').classList.remove('hidden');
}

function updateTimerDisplay() {
    const m = Math.floor(AppState.timer.remainingSeconds / 60);
    const s = AppState.timer.remainingSeconds % 60;
    const displayStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    const elDisplay = document.getElementById('timer-display');
    if (elDisplay) elDisplay.textContent = displayStr;

    // Círculo SVG de progresso
    const ring = document.getElementById('timer-progress-ring');
    if (ring && AppState.timer.durationSeconds > 0) {
        const circumference = 2 * Math.PI * 44; // r = 44 => ~276.46
        const progress = AppState.timer.remainingSeconds / AppState.timer.durationSeconds;
        const offset = circumference * (1 - progress);
        ring.style.strokeDashoffset = offset;
    }
}

function toggleTimer() {
    if (AppState.timer.isRunning) {
        // Pausar
        clearInterval(AppState.timer.intervalId);
        AppState.timer.intervalId = null;
        AppState.timer.isRunning = false;

        document.getElementById('timer-toggle-text').textContent = "Continuar";
        document.getElementById('timer-toggle-icon').className = "fa-solid fa-play";
        document.getElementById('timer-status-label').textContent = "Pausado";
    } else {
        // Iniciar
        getAudioContext(); // desbloqueia contexto de áudio com clique do usuário
        AppState.timer.isRunning = true;

        document.getElementById('timer-toggle-text').textContent = "Pausar";
        document.getElementById('timer-toggle-icon').className = "fa-solid fa-pause";
        document.getElementById('timer-status-label').textContent = "Em Andamento";

        AppState.timer.intervalId = setInterval(() => {
            if (AppState.timer.remainingSeconds > 0) {
                AppState.timer.remainingSeconds--;
                updateTimerDisplay();
            } else {
                // Timer Concluído
                clearInterval(AppState.timer.intervalId);
                AppState.timer.intervalId = null;
                AppState.timer.isRunning = false;

                playNotificationSound();
                showToast("⏰ Tempo esgotado! Excelente trabalho.", "success");

                if (typeof confetti === 'function') {
                    confetti({ particleCount: 80, spread: 60 });
                }

                document.getElementById('timer-status-label').textContent = "Concluído!";
                document.getElementById('timer-toggle-text').textContent = "Reiniciar";
                document.getElementById('timer-toggle-icon').className = "fa-solid fa-rotate-left";
            }
        }, 1000);
    }
}

function resetTimer() {
    if (AppState.timer.intervalId) {
        clearInterval(AppState.timer.intervalId);
        AppState.timer.intervalId = null;
    }
    AppState.timer.isRunning = false;
    AppState.timer.remainingSeconds = AppState.timer.durationSeconds;
    updateTimerDisplay();

    document.getElementById('timer-toggle-text').textContent = "Começar";
    document.getElementById('timer-toggle-icon').className = "fa-solid fa-play";
    document.getElementById('timer-status-label').textContent = "Reiniciado";
}

function add5MinutesToTimer() {
    AppState.timer.durationSeconds += 300;
    AppState.timer.remainingSeconds += 300;
    updateTimerDisplay();
    showToast("+5 minutos adicionados ao timer.", "info");
}

function completeActiveTimerBlock() {
    if (AppState.timer.activeBlockId) {
        const block = AppState.blocks.find(b => b.id === AppState.timer.activeBlockId);
        if (block) {
            block.completed = true;
            saveBlocks();
            renderAll();
        }
    }
    closeTimerModal();
    playNotificationSound();
    showToast("Bloco concluído com sucesso!", "success");
}

function closeTimerModal() {
    if (AppState.timer.intervalId) {
        clearInterval(AppState.timer.intervalId);
        AppState.timer.intervalId = null;
    }
    AppState.timer.isRunning = false;
    document.getElementById('modal-timer').classList.add('hidden');
}

// =============================================================================
// 8. CALIBRAÇÃO INTELIGENTE (ALINHAMENTO DE HORÁRIOS)
// =============================================================================

function calibrateRoutine(wakeTime, lunchTime, dinnerTime, sleepTime, gamingMins) {
    const wakeMins = timeToMinutes(wakeTime);
    const lunchMins = timeToMinutes(lunchTime);
    const dinnerMins = timeToMinutes(dinnerTime);
    const sleepMins = timeToMinutes(sleepTime);

    // Gera lista calibrada proporcional
    const newBlocks = [
        {
            id: "cal-1",
            title: "Café da Manhã & Louça Express",
            zone: "cozinha",
            tag: "Âncora",
            startTime: minutesToTime(wakeMins + 15),
            duration: 30,
            description: "Café revigorante e louça lavada logo em seguida para não acumular.",
            completed: false
        },
        {
            id: "cal-2",
            title: "Reset Rápido do Quarto",
            zone: "quarto",
            tag: "Manutenção",
            startTime: minutesToTime(wakeMins + 50),
            duration: 20,
            description: "Cama arrumada, chão livre de roupas e janelas abertas.",
            completed: false
        },
        {
            id: "cal-3",
            title: "Cozinhar o Almoço (Clean-as-you-go)",
            zone: "cozinha",
            tag: "Âncora",
            startTime: minutesToTime(lunchMins - 45),
            duration: 45,
            description: "Preparo do almoço lavando as panelas e louça durante o preparo.",
            completed: false
        },
        {
            id: "cal-4",
            title: "Almoço Tranquilo",
            zone: "alimentacao",
            tag: "Refeição",
            startTime: lunchTime,
            duration: 30,
            description: "Alimentar-se com calma.",
            completed: false
        },
        {
            id: "cal-5",
            title: "Lavar Louça do Almoço",
            zone: "cozinha",
            tag: "Manutenção",
            startTime: minutesToTime(lunchMins + 30),
            duration: 15,
            description: "Tiro de 15 minutos: pia e fogão 100% limpos.",
            completed: false
        },
        {
            id: "cal-6",
            title: "Cozinhar & Jantar",
            zone: "cozinha",
            tag: "Âncora",
            startTime: dinnerTime,
            duration: 45,
            description: "Preparo de refeição noturna e jantar.",
            completed: false
        },
        {
            id: "cal-7",
            title: "Lavar Louça da Noite",
            zone: "cozinha",
            tag: "Manutenção",
            startTime: minutesToTime(dinnerMins + 45),
            duration: 15,
            description: "Pia zerada antes de iniciar os jogos.",
            completed: false
        },
        {
            id: "cal-8",
            title: "Videogame & Lazer Livre",
            zone: "lazer",
            tag: "Descompressão",
            startTime: minutesToTime(dinnerMins + 60),
            duration: gamingMins,
            description: "Tempo de lazer protegido e livre de qualquer culpa. Aproveite!",
            completed: false
        }
    ];

    AppState.blocks = newBlocks;
    saveBlocks();
    renderAll();
    showToast("Rotina recalibrada com sucesso com base nos seus horários!", "success");
}

// =============================================================================
// 9. GESTÃO DE PRESETS & HACKS
// =============================================================================

function applyPreset(presetKey) {
    if (!PRESETS[presetKey]) return;

    AppState.blocks = JSON.parse(JSON.stringify(PRESETS[presetKey]));
    saveBlocks();
    renderAll();

    // Atualiza botões visuais
    document.querySelectorAll('.preset-btn').forEach(btn => {
        if (btn.getAttribute('data-preset') === presetKey) {
            btn.className = "preset-btn active px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50 transition";
        } else {
            btn.className = "preset-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700 transition";
        }
    });

    const presetNames = {
        padrao: "Equilíbrio Padrão",
        express: "Modo Express",
        gamer: "Fim de Semana Gamer",
        faxina: "Faxina Leve"
    };

    showToast(`Modo "${presetNames[presetKey] || presetKey}" ativado!`, "info");
}

function nextProductivityHack() {
    AppState.currentHackIndex = (AppState.currentHackIndex + 1) % PRODUCTIVITY_HACKS.length;
    const hack = PRODUCTIVITY_HACKS[AppState.currentHackIndex];

    const titleEl = document.getElementById('hack-title');
    const bodyEl = document.getElementById('hack-body');

    if (titleEl && bodyEl) {
        titleEl.textContent = hack.title;
        bodyEl.textContent = hack.text;
    }
}

// =============================================================================
// 10. IMPORTAÇÃO & EXPORTAÇÃO
// =============================================================================

function exportRoutineJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.blocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rotina_domus_${getTodayString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Arquivo de rotina exportado com sucesso!", "success");
}

function importRoutineJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                AppState.blocks = imported;
                saveBlocks();
                renderAll();
                showToast("Rotina importada com sucesso!", "success");
                document.getElementById('modal-settings').classList.add('hidden');
            } else {
                showToast("Formato de arquivo JSON inválido.", "error");
            }
        } catch (err) {
            showToast("Erro ao ler o arquivo de rotina.", "error");
        }
    };
    reader.readAsText(file);
}

// =============================================================================
// 11. INICIALIZAÇÃO & EVENT LISTENERS
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tema Escuro / Claro
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    if (isDark) {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').className = 'fa-solid fa-sun';
    } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('theme-icon').className = 'fa-solid fa-moon';
    }

    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
        const root = document.documentElement;
        const icon = document.getElementById('theme-icon');
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            icon.className = 'fa-solid fa-moon';
            localStorage.setItem(STORAGE_KEYS.THEME, 'light');
        } else {
            root.classList.add('dark');
            icon.className = 'fa-solid fa-sun';
            localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
        }
    });

    // 2. Relógio em tempo real no cabeçalho
    function updateClock() {
        const now = new Date();
        const str = now.toLocaleTimeString('pt-BR');
        const clockEl = document.getElementById('header-clock');
        if (clockEl) clockEl.textContent = str;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Atualiza o banner dinâmico a cada 30 segundos
    setInterval(updateCurrentBlockBanner, 30000);

    // 3. Carregar dados e renderizar
    loadBlocks();
    renderAll();

    // 4. Abas de Visualização
    const tabTimeline = document.getElementById('tab-timeline');
    const tabChecklist = document.getElementById('tab-checklist');
    const tabChart = document.getElementById('tab-chart');

    const viewTimeline = document.getElementById('view-timeline');
    const viewChecklist = document.getElementById('view-checklist');
    const viewChart = document.getElementById('view-chart');

    function setActiveTab(tab) {
        [tabTimeline, tabChecklist, tabChart].forEach(btn => {
            btn.className = "tab-btn px-3 py-1 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition";
        });

        [viewTimeline, viewChecklist, viewChart].forEach(v => v.classList.add('hidden'));

        if (tab === 'timeline') {
            tabTimeline.className = "tab-btn active px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs transition";
            viewTimeline.classList.remove('hidden');
        } else if (tab === 'checklist') {
            tabChecklist.className = "tab-btn active px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs transition";
            viewChecklist.classList.remove('hidden');
            renderChecklistByZones();
        } else if (tab === 'chart') {
            tabChart.className = "tab-btn active px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs transition";
            viewChart.classList.remove('hidden');
            updateStatsAndBanner();
        }
    }

    tabTimeline.addEventListener('click', () => setActiveTab('timeline'));
    tabChecklist.addEventListener('click', () => setActiveTab('checklist'));
    tabChart.addEventListener('click', () => setActiveTab('chart'));

    // 5. Botões de Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetKey = btn.getAttribute('data-preset');
            applyPreset(presetKey);
        });
    });

    // 6. Botão Novo Bloco
    document.getElementById('btn-add-block').addEventListener('click', openNewBlockModal);
    document.getElementById('btn-close-form').addEventListener('click', () => {
        document.getElementById('modal-block-form').classList.add('hidden');
    });
    document.getElementById('btn-cancel-form').addEventListener('click', () => {
        document.getElementById('modal-block-form').classList.add('hidden');
    });

    // Formulário de Criar/Editar Bloco
    document.getElementById('block-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('form-block-id').value;
        const title = document.getElementById('form-title').value.trim();
        const zone = document.getElementById('form-zone').value;
        const tag = document.getElementById('form-tag').value;
        const startTime = document.getElementById('form-start-time').value;
        const duration = parseInt(document.getElementById('form-duration').value, 10) || 15;
        const description = document.getElementById('form-description').value.trim();

        if (id) {
            // Editando existente
            const block = AppState.blocks.find(b => b.id === id);
            if (block) {
                block.title = title;
                block.zone = zone;
                block.tag = tag;
                block.startTime = startTime;
                block.duration = duration;
                block.description = description;
                showToast("Bloco atualizado com sucesso!", "success");
            }
        } else {
            // Novo bloco
            const newBlock = {
                id: 'blk_' + Date.now(),
                title,
                zone,
                tag,
                startTime,
                duration,
                description,
                completed: false
            };
            AppState.blocks.push(newBlock);
            showToast("Novo bloco adicionado à sua rotina!", "success");
        }

        saveBlocks();
        renderAll();
        document.getElementById('modal-block-form').classList.add('hidden');
    });

    // 7. Timer Controls
    document.getElementById('btn-timer-toggle').addEventListener('click', toggleTimer);
    document.getElementById('btn-timer-reset').addEventListener('click', resetTimer);
    document.getElementById('btn-timer-add5').addEventListener('click', add5MinutesToTimer);
    document.getElementById('btn-timer-complete').addEventListener('click', completeActiveTimerBlock);
    document.getElementById('btn-close-timer').addEventListener('click', closeTimerModal);

    // 8. Calibração Wizard
    document.getElementById('btn-calibrate').addEventListener('click', () => {
        document.getElementById('modal-calibrate').classList.remove('hidden');
    });
    document.getElementById('btn-close-calibrate').addEventListener('click', () => {
        document.getElementById('modal-calibrate').classList.add('hidden');
    });
    document.getElementById('btn-cancel-calib').addEventListener('click', () => {
        document.getElementById('modal-calibrate').classList.add('hidden');
    });

    document.getElementById('calibrate-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const wake = document.getElementById('calib-wake').value;
        const sleep = document.getElementById('calib-sleep').value;
        const lunch = document.getElementById('calib-lunch').value;
        const dinner = document.getElementById('calib-dinner').value;
        const gamingMins = parseInt(document.getElementById('calib-gaming-hours').value, 10) || 150;

        calibrateRoutine(wake, lunch, dinner, sleep, gamingMins);
        document.getElementById('modal-calibrate').classList.add('hidden');
    });

    // 9. Próximo Hack
    document.getElementById('btn-next-hack').addEventListener('click', nextProductivityHack);

    // 10. Desmarcar todos os checks do dia
    document.getElementById('btn-quick-reset-today').addEventListener('click', () => {
        AppState.blocks.forEach(b => b.completed = false);
        saveBlocks();
        renderAll();
        showToast("Todos os checks do dia foram desmarcados.", "info");
    });

    // 11. Modal de Configurações
    document.getElementById('btn-settings').addEventListener('click', () => {
        document.getElementById('modal-settings').classList.remove('hidden');
    });
    document.getElementById('btn-close-settings').addEventListener('click', () => {
        document.getElementById('modal-settings').classList.add('hidden');
    });

    document.getElementById('btn-export-json').addEventListener('click', exportRoutineJSON);
    document.getElementById('import-file').addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            importRoutineJSON(e.target.files[0]);
        }
    });

    document.getElementById('btn-reset-default').addEventListener('click', () => {
        if (confirm("Deseja restaurar a rotina para o modelo padrão original?")) {
            AppState.blocks = JSON.parse(JSON.stringify(DEFAULT_BLOCKS));
            saveBlocks();
            renderAll();
            document.getElementById('modal-settings').classList.add('hidden');
            showToast("Rotina restaurada para o padrão!", "info");
        }
    });

    // Fechar modais ao clicar no backdrop ou pressionar ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('[role="dialog"]').forEach(modal => modal.classList.add('hidden'));
            if (AppState.timer.isRunning) {
                clearInterval(AppState.timer.intervalId);
                AppState.timer.isRunning = false;
            }
        }
    });

    document.querySelectorAll('[role="dialog"]').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                if (modal.id === 'modal-timer' && AppState.timer.isRunning) {
                    clearInterval(AppState.timer.intervalId);
                    AppState.timer.isRunning = false;
                }
            }
        });
    });
});
