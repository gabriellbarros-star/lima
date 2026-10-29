# 🌟 HabitFlow - Controle de Hábitos & Produtividade

> Aplicativo web moderno e responsivo para gerenciamento de hábitos diários, foco com Timer Pomodoro e organização de tarefas com prioridades.

---

## 📌 1. Nome do Aplicativo
**HabitFlow** (Controle de Hábitos & Produtividade Pessoal)

---

## 🎯 2. Objetivo do Projeto
O objetivo do **HabitFlow** é fornecer uma solução simples, intuitiva e acessível para que os usuários possam:
1. **Criar e monitorar hábitos saudáveis**, incentivando a constância através de métricas de conclusão diária e contadores de sequência (*streak*).
2. **Aumentar o foco e o rendimento** através da técnica Pomodoro integrada com alertas visuais e sonoros.
3. **Organizar tarefas diárias** categorizadas por prioridade (*Alta, Média, Baixa*) e etiquetas temáticas (*tags*).
4. **Funcionar de forma 100% autônoma no navegador**, sem necessidade de instalação de servidores ou banco de dados externo, mantendo as informações salvas no armazenamento local (`localStorage`).

---

## 🚀 3. Funcionalidades Principais

### 🔹 Módulo 1: Rastreador de Hábitos
- **Cadastro Personalizado**: Adicione hábitos com título e categoria (*Saúde, Estudos, Produtividade, Finanças, Outros*).
- **Check-in Diário**: Marque ou desmarque a realização do hábito com um único clique.
- **Cálculo de Sequência Inteligente (Streak)**: Reconhece se o hábito foi completado consecutivamente em relação ao dia anterior ou se a sequência foi reiniciada.
- **Painel de Métricas em Tempo Real**:
  - Total de hábitos ativos.
  - Quantidade de hábitos concluídos hoje.
  - Taxa percentual de conclusão diária.
- **Exclusão de Hábitos**: Remoção com atualização dinâmica dos contadores.

### 🔹 Módulo 2: Timer Pomodoro
- **Modos de Foco & Descanso**:
  - Modo Foco: 25 minutos.
  - Modo Pausa Curta: 5 minutos.
- **Anel de Progresso Circular SVG**: Animação fluida e em tempo real baseada no tempo restante.
- **Controles Intuitivos**: Iniciar, Pausar e Reiniciar (*Reset*).
- **Notificação Sonora via Web Audio API**: Tom harmônico sintetizado nativamente pelo navegador ao término da sessão, dispensando o download de arquivos de áudio externos.
- **Controle de Som**: Botão para ativar ou silenciar notificações de áudio.

### 🔹 Módulo 3: Lista de Tarefas (To-Do)
- **Criação de Tarefas**: Definição de título, nível de prioridade (*Alta, Média, Baixa*) e etiquetas personalizadas (*tags*).
- **Filtros Rápidos**:
  - Todas as tarefas.
  - Apenas pendentes.
  - Apenas concluídas.
  - Apenas de alta prioridade.
- **Marcação e Riscar Tarefa**: Feedback visual imediato ao concluir uma atividade.

### 🔹 Recursos Gerais e de Usabilidade
- **Dark Mode (Tema Escuro/Claro)**: Alternância suave com persistência no navegador e suporte à preferência do sistema operacional (`prefers-color-scheme`).
- **Sistema de Notificações Toast**: Alertas automáticos no canto superior direito para ações de sucesso, aviso ou informação.
- **Acessibilidade nos Modais**: Fechamento tanto pelo botão fechar/cancelar quanto ao pressionar a tecla `Esc` ou clicar fora da janela (no *backdrop*).
- **Design Totalmente Responsivo**: Layout otimizado para celulares, tablets e computadores.

---

## 🛠️ 4. Tecnologias Utilizadas

| Tecnologia | Finalidade |
| :--- | :--- |
| **HTML5 Semântico** | Estruturação dos elementos, formulários, seções e acessibilidade (`index.html`). |
| **CSS3 & Tailwind CSS** | Estilização moderna, esquema de cores, variáveis CSS e animações (`style.css`). |
| **JavaScript (ES6+)** | Lógica de programação, manipulação do DOM e regras de negócio (`script.js`). |
| **Web Audio API** | Síntese de áudio nativa para alertas sonoros sem dependências externas. |
| **Web Storage (`localStorage`)** | Persistência local dos dados de hábitos, tarefas e tema selecionado. |
| **FontAwesome Icons** | Iconografia vetorial rica para facilitar a compreensão visual. |

---

## 📂 5. Estrutura de Arquivos

```text
habitflow/
│
├── index.html        # Estrutura HTML da aplicação e marcação semântica
├── style.css         # Estilização complementar, variáveis e animações
├── script.js         # Toda a lógica JavaScript, módulos e persistência
├── README.md         # Documentação e manual de uso do projeto
└── RELATORIO_IA.md   # Relatório de utilização do Google Antigravity
```

---

## 💻 6. Instruções para Execução

Não é necessária nenhuma instalação prévia (como Node.js, Python ou Docker). O aplicativo roda nativamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari ou Opera).

### Passo a passo:
1. Baixe e extraia o arquivo `HabitFlow.zip` (ou abra a pasta do projeto).
2. Dê um **duplo clique** no arquivo `index.html`.
3. O aplicativo será aberto imediatamente no seu navegador padrão.

> **Dica no Windows PowerShell:**
> Você também pode abrir digitando:
> ```powershell
> Start-Process .\index.html
> ```

---

## 📸 7. Capturas de Tela Sugeridas para Entrega
Recomenda-se tirar prints das seguintes telas para anexar no Google Classroom:
1. **Aba Rastreador de Hábitos** com hábitos cadastrados (mostrando a taxa de conclusão e os dias de sequência).
2. **Aba Timer Pomodoro** em funcionamento (com o círculo animado e o tempo decorrendo).
3. **Aba Lista de Tarefas** com tarefas em aberto e concluídas usando os filtros.
4. **Modo Escuro (Dark Mode)** ativo demonstrando a responsividade.
