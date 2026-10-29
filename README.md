# ⏳ DomusTempo - Assistente de Rotina Doméstica & Tempo

> **Aplicativo web moderno para eliminar o caos da rotina da casa, combinando blocos de tempo realistas para cozinhar, lavar louça, refeições, organização do quarto e lazer/videogame sem culpa.**

---

## 📌 1. Sobre o Aplicativo
O **DomusTempo** foi construído com base na metodologia de **Blocos de Tempo (Time-Blocking)** e no princípio de **Zero Perfeccionismo**. O objetivo central é simples: garantir que a casa funcione e que você tenha o seu tempo sagrado de descanso e videogame todos os dias, sem a sensação incômoda de pendências acumuladas.

---

## 🎯 2. Tarefas e Distribuição de Tempo Cobertas

O aplicativo vem calibrado de fábrica para cobrir exatamente as tarefas essenciais da rotina:

1. **🍳 Cozinhar**:
   - Preparo do almoço e do jantar com a filosofia *Clean As You Go* (lavar utensílios durante os intervalos de cozimento).
2. **🧼 Lavar a Louça**:
   - Tiros rápidos e focados de 10 a 15 minutos (café, almoço e fechamento noturno para amanhecer com a pia zerada).
3. **🍽️ Refeições e Alimentação**:
   - Momentos protegidos para comer com tranquilidade, longe de distrações estressantes.
4. **🛏️ Arrumar o Quarto (Reset Diário)**:
   - Tiro rápido de 20 minutos pela manhã: cama esticada, chão livre de roupas, lixeiras esvaziadas e ambiente arejado.
5. **🎮 Lazer & Jogar Videogame Livre de Culpa**:
   - Blocos dedicados (tarde opcional e super sessão noturna de até 2h30 a 3h) com garantia de que todas as tarefas da casa já foram pagas.

---

## 🚀 3. Funcionalidades Principais

- 🕒 **Linha do Tempo Interativa (Timeline)**:
  - Visualização cronológica contínua do dia.
  - Indicador em tempo real com destaque visual dinâmico do bloco que está acontecendo **agora**.
- ⏱️ **Timer de Foco do Bloco (Time-Block Runner)**:
  - Abra o cronômetro para qualquer tarefa (ex: "Lavar Louça em 15 min" ou "Reset Quarto em 20 min").
  - Anel de progresso SVG animado, controle de tempo (+5 min) e aviso sonoro via Web Audio API ao término.
- 📋 **Checklist Agrupado por Zonas**:
  - Filtro intuitivo por *Cozinha*, *Quarto*, *Lazer & Games* e *Alimentação*.
- 📊 **Visualizador de Distribuição 24 Horas**:
  - Gráfico proporcional mostrando claramente a divisão entre afazeres domésticos, refeições, lazer e sono.
- ⚙️ **Calibrador Inteligente de Rotina**:
  - Assistente guiado: informe o horário em que acorda, almoça, janta e vai dormir, além da meta de videogame desejada, e o sistema recalcula todo o cronograma instantaneamente.
- 🎛️ **Modos de Dia (Presets Rápidos)**:
  - *🌟 Equilíbrio Padrão*: O dia ideal balanceado.
  - *⚡ Modo Express*: Para dias corridos, com tarefas ultrarrápidas de cozinha e quarto.
  - *🎮 Fim de Semana Gamer*: Cronograma focado em maratona de jogos.
  - *🧹 Faxina Leve*: Adiciona blocos extras para arrumação profunda.
- 💡 **Hacks de Produtividade Doméstica**:
  - Dicas acionáveis integradas (ex: Regra dos 2 Minutos, Clean-as-you-go, Cesto de transição no quarto, Speedrun na pia).
- 💾 **Persistência Total (`localStorage`)**:
  - Todas as personalizações, adições, edições e marcações diárias ficam salvas no navegador.
  - Exportação e importação em arquivo JSON.
  - Renovação automática dos afazeres na virada de cada dia.
- 🌓 **Dark & Light Mode**:
  - Alternância de tema com suporte ao esquema de cores do sistema operacional.

---

## 💻 4. Como Executar

O aplicativo é 100% autônomo e não necessita de nenhuma instalação de servidor, Node.js ou banco de dados.

1. Abra a pasta do projeto no Windows Explorer:
   `c:\Users\57002264800\OneDrive\jogo`
2. Dê um **duplo clique** no arquivo `index.html`.
3. O aplicativo abrirá imediatamente em qualquer navegador (Chrome, Edge, Firefox, Brave, Safari).

> **Pelo Terminal PowerShell:**
> ```powershell
> Start-Process .\index.html
> ```

---

## 📂 5. Estrutura de Arquivos

```text
jogo/
├── index.html            # Estrutura e marcação semântica com Tailwind CSS
├── style.css             # Estilos refinados, animações da timeline e temas
├── script.js             # Lógica reativa, timer, persistência e calibração
├── README.md             # Manual do aplicativo e documentação
└── legacy_habitflow/     # Cópia de segurança do projeto anterior (HabitFlow)
```
