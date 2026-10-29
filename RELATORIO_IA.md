# 📄 Relatório de Desenvolvimento & Uso da Inteligência Artificial (Google Antigravity)

**Nome do Aluno:** Desenvolvedor / Estudante  
**Projeto:** HabitFlow - Controle de Hábitos & Produtividade  
**Ferramenta de IA Utilizada:** Google Antigravity  
**Data:** Outubro de 2026  

---

## 1. Introdução e Propósito do Uso da IA
O desenvolvimento do aplicativo **HabitFlow** contou com o suporte do **Google Antigravity**, um agente de Inteligência Artificial para programação em par (*pair programming*). O objetivo do uso da IA não foi simplesmente gerar código pronto para entrega, mas utilizá-la como um assistente técnico ativo para:
- Estruturar a arquitetura do projeto seguindo boas práticas de desenvolvimento web.
- Refatorar a base de código monolítica inicial para a arquitetura exigida de arquivos desacoplados (`index.html`, `style.css` e `script.js`).
- Identificar casos de borda (*edge cases*), vulnerabilidades de execução e comportamentos inesperados.
- Realizar validações e testes práticos garantindo acessibilidade, responsividade e experiência do usuário fluida.

---

## 2. Como o Google Antigravity foi Utilizado no Processo

### Etapa 1: Planejamento e Arquitetura do Tema
- A partir das diretrizes da atividade, selecionou-se o tema **Controle de Hábitos, Timer Pomodoro e Lista de Tarefas**, integrando três pilares essenciais de produtividade pessoal em um único aplicativo coeso.
- O agente auxiliou no esboço dos componentes da interface, na hierarquia visual e na modelagem das estruturas de dados a serem salvas no `localStorage`.

### Etapa 2: Separação e Modularização do Código
- Inicialmente, a aplicação continha scripts e estilos embutidos no HTML.
- Com a orientação do Antigravity, realizou-se a separação estrita em três arquivos com responsabilidades bem definidas:
  1. `index.html`: marcação estrutural e semântica pura.
  2. `style.css`: estilização complementar, variáveis CSS, animações de entrada e estilização da barra de rolagem.
  3. `script.js`: lógica de negócio organizada em módulos funcionais (Estado, Hábitos, Pomodoro, Tarefas, Modais, Tema e Toasts).

### Etapa 3: Identificação de Falhas e Refatoração de Código
Durante a análise assistida por IA, foram identificados e corrigidos pontos críticos que poderiam comprometer a aplicação:
1. **Tratamento de Depreciação no Evento de Filtro:**
   - *Problema detectado:* O código usava a variável global `event.target` na filtragem de tarefas, o que pode falhar em navegadores como Firefox ou ao chamar funções programaticamente.
   - *Solução aplicada:* Refatorou-se para passar a referência do elemento clicado (`this`) ou consultar o botão pelo atributo `data-filter`.
2. **Cálculo Realista da Sequência de Hábitos (Streak):**
   - *Problema detectado:* O incremento simples da sequência não considerava se o usuário havia falhado no dia anterior, permitindo sequências infinitas mesmo com dias de intervalo.
   - *Solução aplicada:* Implementou-se a função auxiliar `getYesterdayDateString()` que compara a última data de conclusão com o dia de ontem: se consecutivo, soma +1; se houve quebra, a sequência é reiniciada em 1.
3. **Compatibilidade com Políticas de Autoplay de Áudio nos Navegadores:**
   - *Problema detectado:* O navegador moderno bloqueia sons sintetizados via `AudioContext` se o contexto for disparado sem uma interação prévia do usuário.
   - *Solução aplicada:* Criou-se a função `getAudioContext()` com desbloqueio e auto-retomada (`resume()`) acionada nos cliques de início ou configuração do Pomodoro.
4. **Acessibilidade e Usabilidade em Modais:**
   - Adicionou-se o fechamento automático dos modais ao pressionar a tecla `Esc` e ao clicar no fundo escurecido (*backdrop*).

---

## 3. Principais Alterações e Melhorias Realizadas

| Área | Situação Inicial | Melhoria Implementada |
| :--- | :--- | :--- |
| **Organização** | Código em arquivo único | Separação limpa em `index.html`, `style.css` e `script.js`. |
| **Hábitos** | Sequência acumulativa sem checagem de dias | Validação de continuidade dia a dia (ontem vs. hoje). |
| **Pomodoro** | Alerta sonoro básico sujeito a bloqueios | `Web Audio API` com oscilador senoidal na frequência Ré (587.33 Hz) e desbloqueio prévio. |
| **Usabilidade** | Apenas clique em botões internos fechava modais | Suporte a tecla `Escape` e clique no *backdrop*. |
| **Tema** | Apenas memória local simples | Sincronização entre `localStorage` e preferência do sistema operacional (`prefers-color-scheme`). |
| **Filtros** | Uso inseguro de `event.target` | Uso de `data-filter` e passagem explícita de elementos. |

---

## 4. Testes e Validação Realizados Antes da Entrega

Durante a fase de testes, foram verificados os seguintes critérios:

- [x] **Funcionamento dos Botões e Formulários:**
  - Inserção de novos hábitos e novas tarefas com validação de campos vazios e exibição de alertas visuais (Toasts).
  - Remoção correta de itens e confirmação visual de exclusão.
- [x] **Controle de Estado e Persistência:**
  - Recarregamento da página (F5) mantém intactos os hábitos cadastrados, a sequência de dias, as tarefas marcadas e a preferência de tema.
- [x] **Timer Pomodoro:**
  - Alternância correta entre 25 minutos (Foco) e 5 minutos (Pausa Curta).
  - Contagem regressiva precisa com animação do anel SVG.
  - Alerta sonoro funcionando perfeitamente ao zerar o tempo.
- [x] **Responsividade e Adaptação de Tela:**
  - Testado em resoluções de desktop (1920x1080), tablets e telas mobile estreitas (360px a 480px), com menus em rolagem horizontal sem quebra de layout.
- [x] **Compatibilidade entre Navegadores:**
  - Execução validada em Google Chrome e Microsoft Edge sem erros no console de desenvolvedor (F12).

---

## 5. Conclusão e Aprendizados
O uso do Google Antigravity proporcionou um ciclo de desenvolvimento ágil e educativo. Em vez de uma postura passiva, a interação permitiu:
- Compreender a fundo o funcionamento da manipulação do DOM e a reatividade do `localStorage`.
- Compreender como a `Web Audio API` sintetiza frequências musicais sem precisar de arquivos de áudio externos.
- Praticar a arquitetura limpa com separação de responsabilidades entre HTML, CSS e JavaScript.

O projeto final atende integralmente a todos os requisitos do enunciado, resultando em um aplicativo útil, robusto, agradável de usar e pronto para avaliação.
