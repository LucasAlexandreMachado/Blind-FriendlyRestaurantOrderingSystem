[🇺🇸 Read in English](README.md)

# 🍽️ Totem de Autoatendimento Acessível para Restaurante

## 📋 Descrição

Protótipo web de um totem de autoatendimento para restaurantes com foco em **acessibilidade para pessoas com deficiência visual**. Desenvolvido como projeto acadêmico de Interação Humano-Computador (IHC).

O sistema implementa conceitos de design inclusivo, navegação multimodal e usabilidade centrada no usuário.

## 🌐 Demonstração Online

Acesse o protótipo rodando diretamente no navegador através do GitHub Pages:
[**Testar Totem de Autoatendimento**](https://lucasalexandremachado.github.io/Blind-FriendlyRestaurantOrderingSystem/)

## 🎯 Características Principais

### Modo Normal
- Interface visual intuitiva com botões grandes
- Navegação por cliques simples
- Carrinho flutuante para fácil acesso
- Design inspirado em totens de fast-food
- Feedback visual em todas as ações

### Modo Acessível
- **Alto contraste**: Fundo preto com texto amarelo e branco
- **Text-to-Speech**: Saída de áudio para todas as ações
- **Navegação por botão único** com três ações:
  - **Clique curto**: Avança para próxima opção
  - **Clique longo**: Seleciona opção atual
  - **Duplo clique**: Volta para tela anterior
- **Indicador visual e sonoro**: Mostra estado atual constantemente
- **Navegação sem mouse**: Completamente baseada em botão único
- **Compatibilidade com leitores de tela**

## 🚀 Como Usar

### 1. Requisitos
- Navegador moderno com suporte a:
  - HTML5
  - CSS3
  - JavaScript ES6+
  - Web Speech API

### 2. Arquivos do Projeto
```
.
├── index.html        # Estrutura HTML
├── styles.css        # Estilos CSS
├── app.js           # Lógica JavaScript
├── cardapio.json    # Base de dados de produtos
└── README.md        # Este arquivo
```

### 3. Executar o Projeto

#### Opção 1: Abrir diretamente
1. Navegue até a pasta do projeto
2. Abra `index.html` no navegador

#### Opção 2: Usar servidor local (recomendado)
```bash
# Com Python 3
python -m http.server 8000

# Com Python 2
python -m SimpleHTTPServer 8000

# Com Live Server (VS Code)
# Instale extensão "Live Server" e clique em "Go Live"
```

Depois acesse: `http://localhost:8000`

## 💻 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos e animações
- **JavaScript Vanilla**: Lógica sem frameworks
- **Web Speech API**: Text-to-Speech (fala)
- **JSON**: Dados de produtos

## 📱 Fluxo de Uso

### Modo Normal
1. Tela inicial com botões "Iniciar Pedido" e "Modo Acessível"
2. Selecionar categoria de produtos
3. Escolher produtos desejados
4. Visualizar carrinho
5. Revisar pedido
6. Finalizar pedido

### Modo Acessível
1. Clicar em "Modo Acessível" (ou pressionar a tecla **Espaço** na tela inicial)
2. Sistema entra em modo de alto contraste
3. Botão único aparece no canto inferior direito
4. Navegar com:
   - **Clique curto**: Próxima opção (o sistema fala)
   - **Clique longo**: Selecionar (com feedback sonoro)
   - **Duplo clique**: Voltar (com som de retorno)

**🗺️ Mapa de Navegação do Sistema:**
- 🏠 **Menu Principal**
  - 📖 **Ver Cardápio**
    - 📂 *Categorias (ex: Hambúrgueres, Bebidas...)*
      - 🍔 *Produtos (ex: X-Burger, Água...)*
        - ➕ Adicionar +1
        - ➖ Remover -1
        - ✔️ Concluir (Confirma a quantidade e volta à lista)
  - 🛒 **Ver Carrinho e Finalizar**
    - 📝 *Itens do Carrinho (Clique longo remove 1 unidade)*
    - ✔️ Finalizar Pedido ➡️ *(Avança para Confirmação e finaliza)*
    - 🔄 Continuar Comprando ➡️ *(Retorna ao Cardápio)*

## 🎨 Customização

### Adicionar Produtos
Edite `cardapio.json`:

```json
{
  "categorias": [
    {
      "nome": "Sua Categoria",
      "icone": "🍕",
      "itens": [
        {
          "nome": "Seu Produto",
          "descricao": "Descrição do produto",
          "preco": 25.00
        }
      ]
    }
  ]
}
```

### Modificar Cores
Em `styles.css`, edite as variáveis CSS:

```css
:root {
    --cor-primaria: #FF6B35;      /* Laranja */
    --cor-secundaria: #004E89;    /* Azul */
    --cor-fundo: #F7F7F7;         /* Cinza claro */
    --cor-texto: #333;            /* Preto */
    --cor-destaque: #FFD700;      /* Amarelo ouro */
}
```

### Ajustar Idioma de Áudio
Em `app.js`, modificar `utteranceConfig`:

```javascript
const utteranceConfig = {
    rate: 1,      // Velocidade (0.5 = lento, 2 = rápido)
    pitch: 1,     // Tom (0.5 = grave, 2 = agudo)
    volume: 1,    // Volume (0 = mudo, 1 = máximo)
    lang: 'pt-BR' // Idioma
};
```

## ♿ Conceitos de Acessibilidade Implementados

1. **Feedback Multissensorial**
   - Visual: Mudanças de cor, animações
   - Auditivo: Text-to-Speech em todas as ações
   - Sensorial: Animações do indicador

2. **Visibilidade de Estado**
   - Indicador visual mostra posição atual
   - Áudio descreve estado continuamente
   - Destaque visual da opção selecionada

3. **Navegação Sem Mouse**
   - Botão único com três ações
   - Todas as funções acessíveis
   - Sem necessidade de teclado

4. **Alto Contraste**
   - Fundo preto, texto branco/amarelo
   - Bordas reforçadas
   - Fonte grande (até 56px)

5. **Robustez e Precisão (Anti-Ghosting)**
   - Uso de `Pointer Events` para unificar interações de mouse, toque e caneta sem duplicação.
   - Algoritmo de *Debounce* (anti-rebote) para o botão de acessibilidade, filtrando tremores ou cliques duplos acidentais.
   - Compatível com leitores de tela
   - Sem plugins necessários
   - Funciona offline (exceto Web Speech)

## 🧠 Diretrizes e Heurísticas de IHC Aplicadas

O projeto foi desenhado respeitando princípios fundamentais de Interação Humano-Computador, alinhados com as **Heurísticas de Nielsen**:

1. **Visibilidade do status do sistema**: O usuário é constantemente informado sobre o estado atual por meio do áudio Text-to-Speech e de indicadores visuais (ex: "Você está no carrinho com 3 itens").
2. **Controle e liberdade do usuário**: A navegação oferece saídas claras a qualquer momento. A ação de "duplo clique" garante que o usuário possa sempre voltar, cancelar uma ação e não se sinta preso no fluxo.
3. **Consistência e padronização**: A lógica de interação do modo acessível mantém o exato mesmo comportamento em todas as telas da aplicação (curto = avançar, longo = selecionar, duplo = voltar).
4. **Prevenção de erros**: Bloqueios lógicos como "carrinho vazio" ou "limite máximo de estoque", em conjunto com *debounce* para filtrar cliques acidentais no botão único.
5. **Reconhecimento em vez de memorização**: O sistema lê de forma iterativa todas as opções disponíveis em tela, assim como repassa os itens do carrinho, não exigindo que o usuário memorize a navegação.
6. **Design estético e minimalista**: O modo acessível elimina o ruído visual, focando no alto contraste (preto/amarelo/branco) e fontes grandes para focar puramente na legibilidade e clareza para baixa visão.

## 🧪 Testes

### Testar Modo Normal
1. Abra a aplicação
2. Clique em "Iniciar Pedido"
3. Navegue pelas categorias e produtos
4. Adicione ao carrinho
5. Finalize o pedido

### Testar Modo Acessível
1. Abra a aplicação
2. Clique em "Modo Acessível"
3. Use botão único:
   - Clique curto 3-4 vezes para navegar
   - Clique longo para selecionar
   - Duplo clique para voltar
4. Verifique áudio em cada ação

### Testar Sem Som
1. Ativar leitor de tela (NVDA/JAWS no Windows, VoiceOver no Mac)
2. Navegar apenas por áudio
3. Verificar descrições das opções

## 📊 Estrutura de Dados

### Produto
```javascript
{
  nome: String,           // Nome do produto
  descricao: String,      // Descrição detalhada
  preco: Number           // Preço em reais
}
```

### Categoria
```javascript
{
  nome: String,           // Nome da categoria
  icone: String,          // Emoji
  itens: Array<Produto>   // Lista de produtos
}
```


## 📚 Referências sobre IHC

- [Nielsen Norman Group - Accessibility](https://www.nngroup.com/articles/accessibility/)
- [W3C - Web Accessibility Initiative](https://www.w3.org/WAI/)
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 🎓 Sobre o Projeto

Este é um trabalho acadêmico desenvolvido para a disciplina de **Interface Humano-Computador (IHC)** na **Universidade Federal de Santa Catarina (UFSC)**.

### 👥 Equipe
- **Lucas Alexandre Machado** - [GitHub](https://github.com/LucasAlexandreMachado)
- **Arthur Silveira Sampaio** - [GitHub](https://github.com/sampaio-arthur)
- **Leonardo Latorre Boteon** - [GitHub](https://github.com/LeonardoBoteon)

## 📄 Licença

Código livre para uso educacional e comercial.

---

**Desenvolvido com foco em: Acessibilidade, Usabilidade e Inclusão Digital** ♿✨
