# Projeto IHC - Totem de Autoatendimento Acessível para Restaurante

## Objetivo

Desenvolver um protótipo web de um totem de autoatendimento para restaurantes, inspirado nos terminais encontrados em redes de fast-food.

O foco principal do projeto é demonstrar conceitos de Interação Humano-Computador (IHC), com ênfase em acessibilidade para pessoas com deficiência visual.

O sistema não precisa possuir backend nem integração com pagamentos reais. Todos os dados podem ser simulados (mockados).

---

# Tecnologias

Utilizar apenas:

* HTML5
* CSS3
* JavaScript Vanilla (sem frameworks)
* Web Speech API (SpeechSynthesis)

Não utilizar React, Vue, Angular ou qualquer framework frontend.

---

# Público-Alvo

### Usuários sem deficiência visual

Utilizam normalmente a interface touchscreen.

### Usuários com deficiência visual

Utilizam um modo especial de acessibilidade ativado por um botão físico em braile presente no totem.

Como o projeto é um protótipo web, o botão físico será simulado por um botão na interface.

---

# Conceito de Acessibilidade

O sistema NÃO deve utilizar reconhecimento de voz.

Justificativa:

Restaurantes costumam possuir alto nível de ruído ambiente, tornando o reconhecimento de voz pouco confiável.

A solução adotada será:

* Saída de áudio (Text-to-Speech)
* Navegação por botão único
* Feedback auditivo constante

---

# Estrutura dos Dados

Os produtos devem ser carregados de um arquivo JSON.

Exemplo:

```json
{
  "categorias": [
    {
      "nome": "Entradas",
      "itens": [
        {
          "nome": "Batata Frita",
          "descricao": "Porção média",
          "preco": 15.00
        }
      ]
    }
  ]
}
```

As categorias podem ser:

* Entradas
* Pratos Principais
* Bebidas
* Sobremesas

Cada item deve possuir:

* Nome
* Descrição
* Preço

---

# Modo Normal

## Tela Inicial

Exibir:

* Logo fictícia do restaurante
* Botão "Iniciar Pedido"
* Botão "Modo Acessível"

---

## Navegação

Fluxo:

1. Selecionar categoria
2. Selecionar produto
3. Adicionar ao carrinho
4. Revisar carrinho
5. Finalizar pedido

---

## Carrinho

Exibir:

* Lista de itens
* Quantidade
* Valor individual
* Valor total

Botões:

* Adicionar
* Remover
* Finalizar Pedido

---

# Modo Acessível

## Ativação

Ao clicar em "Modo Acessível":

* Interface muda para alto contraste
* Elementos visuais tornam-se secundários
* Sistema inicia orientações por voz

Mensagem inicial:

"Bem-vindo ao modo acessível. Utilize o botão de navegação para percorrer as opções."

---

## Navegação por Botão Único

O sistema deve simular um botão físico.

Existem três ações possíveis:

### Clique curto

Avança para a próxima opção.

### Clique longo

Seleciona a opção atual.

### Duplo clique

Volta para a tela anterior.

---

## Exemplo de Fluxo

Sistema fala:

"Categoria atual: Entradas."

Clique curto:

"Categoria atual: Pratos Principais."

Clique curto:

"Categoria atual: Bebidas."

Clique longo:

"Categoria Bebidas selecionada."

Sistema passa a navegar pelos produtos da categoria.

---

## Feedback Auditivo

Todas as ações devem gerar áudio.

Exemplos:

"Batata frita. Valor quinze reais."

"Item adicionado ao carrinho."

"Carrinho possui três itens."

"Valor total quarenta e dois reais."

"Pedido finalizado."

---

# Requisitos de Usabilidade

Aplicar os seguintes conceitos de IHC:

## Feedback

Toda ação deve gerar resposta visual e/ou sonora.

---

## Visibilidade do Estado

O usuário deve sempre saber:

* Onde está
* O que selecionou
* O que pode fazer a seguir

---

## Consistência

Todos os botões devem manter o mesmo padrão visual.

---

## Prevenção de Erros

Antes de finalizar:

Exibir resumo do pedido.

---

## Acessibilidade

* Alto contraste
* Fontes grandes
* Navegação sem mouse
* Navegação por áudio
* Compatibilidade com leitores de tela

---

# Layout

Estilo inspirado em totens de fast-food.

Características:

* Tela cheia
* Botões grandes
* Interface simples
* Pouco texto por tela
* Alto contraste

Resolução alvo:

1920x1080

---

# Objetivo Acadêmico

O projeto deve servir como demonstração prática dos conceitos de:

* Interação Humano-Computador (IHC)
* Acessibilidade
* Design Inclusivo
* Usabilidade
* Feedback ao usuário
* Navegação multimodal
* Design centrado no usuário

O foco principal não é o sistema de pedidos, mas sim a experiência de uso e a inclusão de pessoas com deficiência visual.
