/**
 * ==========================================================================
 * HabitFlow - Lógica da Aplicação (script.js)
 * Controle de Hábitos, Timer Pomodoro e Lista de Tarefas
 * ==========================================================================
 */

// ================= ESTADO GLOBAL DA APLICAÇÃO =================
let habits = JSON.parse(localStorage.getItem('habitflow_habits')) || [
    { id: '1', title: 'Beber 2L de Água', category: 'Saúde', streak: 3, lastCompleted: getTodayDateString() },
    { id: '2', title: 'Ler 20 minutos', category: 'Estudos', streak: 5, lastCompleted: '' }
];

let tasks = JSON.parse(localStorage.getItem('habitflow_tasks')) || [
    { id: '1', title: 'Revisar conteúdo da apresentação', priority: 'alta', tag: 'Trabalho', completed: false },
    { id: '2', title: 'Comprar materiais de estudo', priority: 'baixa', tag: 'Estudos', completed: true }
];

let currentTaskFilter = 'all';

// Estado do Timer Pomodoro
let pomoMinutes = 25;
let pomoSeconds = 0;
let pomoTotalSeconds = 25 * 60;
let pomoTimer = null;
let pomoIsRunning = false;
let pomoMode = 'work'; // 'work' ou 'break'
let soundEnabled = true;
let audioCtx = null;

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initModals();
    renderHabits();
    renderTasks();
    updatePomodoroDisplay();
});

// ================= FUNÇÕES UTILITÁRIAS =================
function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}

function getYesterdayDateString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

function saveState() {
    localStorage.setItem('habitflow_habits', JSON.stringify(habits));
    localStorage.setItem('habitflow_tasks', JSON.stringify(tasks));
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800';

    toast.className = `pointer-events-auto flex items-center justify-between p-3.5 rounded-xl text-white text-sm shadow-lg ${bgClass} transition-all duration-300 transform translate-y-2 opacity-0`;
    toast.innerHTML = `
        <span class="flex items-center gap-2">
            ${type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : type === 'error' ? '<i class="fa-solid fa-circle-exclamation"></i>' : '<i class="fa-solid fa-circle-info"></i>'}
            ${message}
        </span>
        <button onclick="this.parentElement.remove()" class="ml-3 text-white/80 hover:text-white transition-opacity" title="Fechar">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ================= GERENCIAMENTO DE MODAIS =================
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.toggle('hidden');

    if (!modal.classList.contains('hidden')) {
        const firstInput = modal.querySelector('input:not([type="hidden"])');
        if (firstInput) setTimeout(() => firstInput.focus(), 50);
    }
}

function initModals() {
    // Fechar modais ao clicar no fundo escurecido
    ['habit-modal', 'task-modal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    });

    // Fechar modais com tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('#habit-modal, #task-modal').forEach(m => m.classList.add('hidden'));
        }
    });
}

// ================= ALTERNÂNCIA DE TEMA (DARK/LIGHT) =================
function initTheme() {
    const savedTheme = localStorage.getItem('habitflow_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('habitflow_theme', isDark ? 'dark' : 'light');
            showToast(`Tema ${isDark ? 'Escuro' : 'Claro'} ativado.`, 'info');
        });
    }
}

// ================= NAVEGAÇÃO POR ABAS =================
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = 'tab-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
    });

    const activeTab = document.getElementById(`tab-${tabName}`);
    const activeBtn = document.getElementById(`tab-btn-${tabName}`);

    if (activeTab) activeTab.classList.remove('hidden');

    const themeColors = {
        habits: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50 dark:text-sky-400',
        pomodoro: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400',
        tasks: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400'
    };

    if (activeBtn) {
        activeBtn.className = `tab-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${themeColors[tabName]}`;
    }
}

// ================= MÓDULO: RASTREADOR DE HÁBITOS =================
function handleAddHabit(e) {
    e.preventDefault();
    const titleInput = document.getElementById('habit-title');
    const categoryInput = document.getElementById('habit-category');

    if (!titleInput || !titleInput.value.trim()) {
        showToast('Por favor, informe o nome do hábito.', 'error');
        return;
    }

    const newHabit = {
        id: Date.now().toString(),
        title: titleInput.value.trim(),
        category: categoryInput ? categoryInput.value : 'Geral',
        streak: 0,
        lastCompleted: ''
    };

    habits.push(newHabit);
    saveState();
    renderHabits();

    titleInput.value = '';
    toggleModal('habit-modal');
    showToast('Hábito cadastrado com sucesso!', 'success');
}

function toggleHabitCompletion(id) {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const habit = habits.find(h => h.id === id);

    if (!habit) return;

    if (habit.lastCompleted === today) {
        // Desmarcar conclusão de hoje
        habit.lastCompleted = '';
        habit.streak = Math.max(0, habit.streak - 1);
        showToast('Hábito desmarcado.', 'info');
    } else {
        // Concluir hábito hoje: calcula sequência contínua
        if (habit.lastCompleted === yesterday) {
            habit.streak += 1;
        } else {
            habit.streak = 1;
        }
        habit.lastCompleted = today;
        showToast(`Parabéns! Sequência de ${habit.streak} dia(s)! 🔥`, 'success');
    }

    saveState();
    renderHabits();
}

function deleteHabit(id) {
    habits = habits.filter(h => h.id !== id);
    saveState();
    renderHabits();
    showToast('Hábito removido.', 'error');
}

function renderHabits() {
    const container = document.getElementById('habits-list');
    if (!container) return;
    const today = getTodayDateString();

    // Métricas estatísticas
    const total = habits.length;
    const completedToday = habits.filter(h => h.lastCompleted === today).length;
    const rate = total > 0 ? Math.round((completedToday / total) * 100) : 0;

    const totalEl = document.getElementById('total-habits-count');
    const completedEl = document.getElementById('completed-today-count');
    const rateEl = document.getElementById('completion-rate');

    if (totalEl) totalEl.innerText = total;
    if (completedEl) completedEl.innerText = completedToday;
    if (rateEl) rateEl.innerText = `${rate}%`;

    if (habits.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-slate-400">
                <i class="fa-solid fa-seedling text-4xl mb-3 text-sky-500/70"></i>
                <p class="font-medium text-slate-600 dark:text-slate-300">Nenhum hábito cadastrado ainda.</p>
                <p class="text-xs text-slate-400 mt-1">Clique em "Novo Hábito" para começar sua jornada de produtividade!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = habits.map(h => {
        const isCompleted = h.lastCompleted === today;
        return `
            <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                <div class="flex items-center gap-3">
                    <button onclick="toggleHabitCompletion('${h.id}')" aria-label="Marcar hábito" class="w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'}">
                        ${isCompleted ? '<i class="fa-solid fa-check text-sm"></i>' : ''}
                    </button>
                    <div>
                        <h4 class="font-semibold text-sm ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}">${h.title}</h4>
                        <span class="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${h.category}</span>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                        <i class="fa-solid fa-fire"></i>
                        <span>${h.streak} dias</span>
                    </div>
                    <button onclick="deleteHabit('${h.id}')" aria-label="Excluir hábito" class="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ================= MÓDULO: TIMER POMODORO =================
function setPomodoroMode(mode) {
    pomoMode = mode;
    pomoMinutes = mode === 'work' ? 25 : 5;
    pomoSeconds = 0;
    pomoTotalSeconds = pomoMinutes * 60;

    if (pomoIsRunning) resetPomodoro();

    const workBtn = document.getElementById('pomo-mode-work');
    const breakBtn = document.getElementById('pomo-mode-break');
    const label = document.getElementById('pomo-status-label');

    if (workBtn) {
        workBtn.className = `pomo-mode-btn flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${mode === 'work' ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`;
    }
    if (breakBtn) {
        breakBtn.className = `pomo-mode-btn flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${mode === 'break' ? 'bg-white dark:bg-slate-800 shadow-sm text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`;
    }
    if (label) {
        label.innerText = mode === 'work' ? 'Hora de Focar' : 'Tempo de Descanso';
    }

    updatePomodoroDisplay();
}

function getAudioContext() {
    if (!audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
            audioCtx = new AudioCtxClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function togglePomodoro() {
    getAudioContext();
    const playIcon = document.getElementById('pomo-play-icon');

    if (pomoIsRunning) {
        clearInterval(pomoTimer);
        pomoIsRunning = false;
        if (playIcon) playIcon.className = 'fa-solid fa-play ml-1';
        showToast('Pomodoro pausado.', 'info');
    } else {
        pomoIsRunning = true;
        if (playIcon) playIcon.className = 'fa-solid fa-pause';
        pomoTimer = setInterval(() => {
            if (pomoSeconds === 0) {
                if (pomoMinutes === 0) {
                    clearInterval(pomoTimer);
                    pomoIsRunning = false;
                    if (playIcon) playIcon.className = 'fa-solid fa-play ml-1';
                    playNotificationSound();
                    showToast(pomoMode === 'work' ? 'Sessão de foco concluída! Hora da pausa.' : 'Pausa concluída! Pronto para voltar ao foco?', 'success');
                    return;
                }
                pomoMinutes--;
                pomoSeconds = 59;
            } else {
                pomoSeconds--;
            }
            updatePomodoroDisplay();
        }, 1000);
    }
}

function resetPomodoro() {
    clearInterval(pomoTimer);
    pomoIsRunning = false;
    pomoMinutes = pomoMode === 'work' ? 25 : 5;
    pomoSeconds = 0;
    const playIcon = document.getElementById('pomo-play-icon');
    if (playIcon) playIcon.className = 'fa-solid fa-play ml-1';
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const minStr = String(pomoMinutes).padStart(2, '0');
    const secStr = String(pomoSeconds).padStart(2, '0');
    const displayEl = document.getElementById('pomo-timer-display');
    if (displayEl) displayEl.innerText = `${minStr}:${secStr}`;

    // Atualiza anel SVG circular (perímetro 2*pi*44 = ~276.46)
    const currentSeconds = (pomoMinutes * 60) + pomoSeconds;
    const progressRatio = currentSeconds / pomoTotalSeconds;
    const dashoffset = 276.46 * (1 - progressRatio);

    const circle = document.getElementById('pomo-progress');
    if (circle) {
        circle.style.strokeDashoffset = dashoffset;
        circle.className = `transition-all duration-1000 ease-linear ${pomoMode === 'work' ? 'text-sky-500' : 'text-rose-500'}`;
    }
}

function toggleSoundNotification() {
    getAudioContext();
    soundEnabled = !soundEnabled;
    const soundIcon = document.getElementById('pomo-sound-icon');
    if (soundIcon) {
        if (soundEnabled) {
            soundIcon.className = 'fa-solid fa-volume-high text-sky-500';
            showToast('Notificação sonora ativada.', 'info');
        } else {
            soundIcon.className = 'fa-solid fa-volume-xmark text-slate-400';
            showToast('Notificação sonora desativada.', 'info');
        }
    }
}

function playNotificationSound() {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Tom harmônico Ré (D5)
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
        console.warn('Erro na síntese de áudio Web Audio API:', e);
    }
}

// ================= MÓDULO: LISTA DE TAREFAS =================
function handleAddTask(e) {
    e.preventDefault();
    const titleInput = document.getElementById('task-title');
    const priorityInput = document.getElementById('task-priority');
    const tagInput = document.getElementById('task-tag');

    if (!titleInput || !titleInput.value.trim()) {
        showToast('Por favor, informe o título da tarefa.', 'error');
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        title: titleInput.value.trim(),
        priority: priorityInput ? priorityInput.value : 'media',
        tag: (tagInput && tagInput.value.trim()) ? tagInput.value.trim() : 'Geral',
        completed: false
    };

    tasks.push(newTask);
    saveState();
    renderTasks();

    titleInput.value = '';
    if (tagInput) tagInput.value = '';
    toggleModal('task-modal');
    showToast('Tarefa adicionada com sucesso!', 'success');
}

function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveState();
    renderTasks();
    showToast(task.completed ? 'Tarefa marcada como concluída!' : 'Tarefa reaberta.', 'info');
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveState();
    renderTasks();
    showToast('Tarefa excluída.', 'error');
}

function filterTasks(filter, el) {
    currentTaskFilter = filter;
    document.querySelectorAll('.task-filter-btn').forEach(btn => {
        btn.className = 'task-filter-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors';
    });

    const activeBtn = el || document.querySelector(`.task-filter-btn[data-filter="${filter}"]`);
    if (activeBtn) {
        activeBtn.className = 'task-filter-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold transition-colors';
    }
    renderTasks();
}

function renderTasks() {
    const container = document.getElementById('tasks-list');
    if (!container) return;

    let filteredTasks = tasks.filter(t => {
        if (currentTaskFilter === 'pending') return !t.completed;
        if (currentTaskFilter === 'completed') return t.completed;
        if (currentTaskFilter === 'high') return t.priority === 'alta';
        return true;
    });

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <i class="fa-solid fa-clipboard-check text-4xl mb-3 text-emerald-500/70"></i>
                <p class="font-medium text-slate-600 dark:text-slate-300">Nenhuma tarefa encontrada.</p>
                <p class="text-xs text-slate-400 mt-1">Tudo limpo por aqui ou ajuste seus filtros acima!</p>
            </div>
        `;
        return;
    }

    const priorityBadges = {
        alta: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
        media: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
        baixa: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
    };

    container.innerHTML = filteredTasks.map(t => `
        <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-emerald-500/50 transition-all shadow-sm">
            <div class="flex items-center gap-3">
                <button onclick="toggleTaskCompletion('${t.id}')" aria-label="Alternar conclusão da tarefa" class="w-6 h-6 rounded-lg flex items-center justify-center transition-all ${t.completed ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'}">
                    ${t.completed ? '<i class="fa-solid fa-check text-xs"></i>' : ''}
                </button>
                <div>
                    <h4 class="font-medium text-sm ${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}">${t.title}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs px-2 py-0.5 rounded-md font-semibold ${priorityBadges[t.priority] || priorityBadges.media}">Prioridade ${t.priority}</span>
                        <span class="text-xs text-slate-400"><i class="fa-solid fa-tag text-[10px]"></i> ${t.tag}</span>
                    </div>
                </div>
            </div>
            <button onclick="deleteTask('${t.id}')" aria-label="Excluir tarefa" class="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');
}
