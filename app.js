/* ════════════════════════════════════════════════════════
   TOTEM DE AUTOATENDIMENTO — Sabor & Arte
   IHC — Interação Humano-Computador
   JavaScript Vanilla + Web Speech API
════════════════════════════════════════════════════════ */

'use strict';

/* ── Estado global ── */
let cardapio       = null;
let carrinho       = [];          // [{nome, preco, qtd}]
let telaAtual      = 'welcome';
let modoAcessivel  = false;

/* ── Estado do modo acessível ── */
const AC = {
  fase: 'menu_principal',        // 'menu_principal' | 'categorias' | 'produtos' | 'carrinho' | 'confirmar'
  menuIdx:  0,
  catIdx:   0,
  prodIdx:  0,
  itemIdx:  0,
  categoriaAtual: null,
};

/* ── Pressão do botão único ── */
let pressaoTimer   = null;
let pressaoInicio  = 0;
const LONGO_MS     = 600;

/* ════════════════════════════════════════════════════════
   INICIALIZAÇÃO
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await carregarCardapio();
  mostrarTela('welcome');
});

async function carregarCardapio() {
  try {
    const r = await fetch('cardapio.json');
    cardapio = await r.json();
  } catch (e) {
    console.error('Erro ao carregar cardápio:', e);
  }
}

/* ════════════════════════════════════════════════════════
   NAVEGAÇÃO DE TELAS
════════════════════════════════════════════════════════ */
function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  const el = document.getElementById(`tela-${id}`);
  if (el) el.classList.add('ativa');
  telaAtual = id;
}

function voltarParaWelcome() {
  mostrarTela('welcome');
}

function iniciarPedido() {
  renderizarCategorias();
  mostrarTela('categorias');
}

function irParaCategorias() {
  renderizarCategorias();
  mostrarTela('categorias');
}

function irParaCarrinho() {
  renderizarCarrinho();
  mostrarTela('carrinho');
}

function irParaConfirmacao() {
  if (carrinho.length === 0) {
    mostrarToast('⚠ Adicione itens ao carrinho primeiro');
    return;
  }
  renderizarConfirmacao();
  mostrarTela('confirmacao');
}

/* ════════════════════════════════════════════════════════
   RENDERIZAÇÃO — CATEGORIAS
════════════════════════════════════════════════════════ */
function renderizarCategorias() {
  const grid = document.getElementById('categorias-grid');
  grid.innerHTML = '';
  cardapio.categorias.forEach((cat, i) => {
    const card = document.createElement('div');
    card.className = 'categoria-card';
    card.innerHTML = `
      <div class="categoria-emoji">${cat.emoji}</div>
      <div class="categoria-nome">${cat.nome}</div>
      <div class="categoria-qtd">${cat.itens.length} itens</div>
    `;
    card.addEventListener('click', () => selecionarCategoria(i));
    grid.appendChild(card);
  });
}

function selecionarCategoria(idx) {
  AC.categoriaAtual = cardapio.categorias[idx];
  AC.catIdx = idx;
  document.getElementById('titulo-categoria').textContent =
    `${AC.categoriaAtual.emoji} ${AC.categoriaAtual.nome}`;
  renderizarProdutos(AC.categoriaAtual);
  mostrarTela('produtos');
}

/* ════════════════════════════════════════════════════════
   RENDERIZAÇÃO — PRODUTOS
════════════════════════════════════════════════════════ */
function renderizarProdutos(cat) {
  const grid = document.getElementById('produtos-grid');
  grid.innerHTML = '';
  cat.itens.forEach((item, i) => {
    const qtdCarrinho = qtdNoCarrinho(item.nome);
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.id = `prod-card-${i}`;
    card.innerHTML = `
      <div class="produto-nome">${item.nome}</div>
      <div class="produto-descricao">${item.descricao}</div>
      <div class="produto-preco">${formatarPreco(item.preco)}</div>
      <div class="produto-acoes">
        <button class="btn-menos" onclick="alterarQtdProd('${item.nome}', ${item.preco}, -1, ${i})">−</button>
        <span class="produto-qtd-label" id="qtd-prod-${i}">${qtdCarrinho}</span>
        <button class="btn-mais" onclick="alterarQtdProd('${item.nome}', ${item.preco}, +1, ${i})">+</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function alterarQtdProd(nome, preco, delta, idx) {
  alterarCarrinho(nome, preco, delta);
  const labelEl = document.getElementById(`qtd-prod-${idx}`);
  if (labelEl) labelEl.textContent = qtdNoCarrinho(nome);
  atualizarContadores();
}

/* ════════════════════════════════════════════════════════
   CARRINHO — LÓGICA
════════════════════════════════════════════════════════ */
function alterarCarrinho(nome, preco, delta) {
  const idx = carrinho.findIndex(i => i.nome === nome);
  if (idx === -1) {
    if (delta > 0) {
      carrinho.push({ nome, preco, qtd: 1 });
      mostrarToast(`✔ ${nome} adicionado`);
    }
  } else {
    carrinho[idx].qtd += delta;
    if (carrinho[idx].qtd <= 0) {
      carrinho.splice(idx, 1);
      mostrarToast(`✕ ${nome} removido`);
    } else if (delta > 0) {
      mostrarToast(`✔ ${nome} adicionado`);
    }
  }
  atualizarContadores();
}

function qtdNoCarrinho(nome) {
  const it = carrinho.find(i => i.nome === nome);
  return it ? it.qtd : 0;
}

function totalCarrinho() {
  return carrinho.reduce((acc, i) => acc + i.preco * i.qtd, 0);
}

function totalItens() {
  return carrinho.reduce((acc, i) => acc + i.qtd, 0);
}

function atualizarContadores() {
  const n = totalItens();
  ['contador-carrinho', 'contador-carrinho-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = n;
  });
}

/* ════════════════════════════════════════════════════════
   RENDERIZAÇÃO — CARRINHO
════════════════════════════════════════════════════════ */
function renderizarCarrinho() {
  const lista = document.getElementById('carrinho-lista');
  lista.innerHTML = '';

  if (carrinho.length === 0) {
    lista.innerHTML = `
      <div class="carrinho-vazio">
        <div class="carrinho-vazio-icon">🛒</div>
        <p>Seu carrinho está vazio.</p>
        <button class="btn-primary" onclick="irParaCategorias()">Ver Cardápio</button>
      </div>`;
    document.getElementById('resumo-subtotal').textContent = 'R$ 0,00';
    document.getElementById('resumo-total').textContent = 'R$ 0,00';
    return;
  }

  carrinho.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'item-carrinho';
    div.innerHTML = `
      <div class="item-info">
        <div class="item-nome">${item.nome}</div>
        <div class="item-unit">${formatarPreco(item.preco)} / unidade</div>
      </div>
      <div class="item-controles">
        <button class="btn-menos" onclick="alterarItemCarrinho(${idx},-1)">−</button>
        <span class="produto-qtd-label">${item.qtd}</span>
        <button class="btn-mais" onclick="alterarItemCarrinho(${idx},+1)">+</button>
      </div>
      <div class="item-subtotal">${formatarPreco(item.preco * item.qtd)}</div>
    `;
    lista.appendChild(div);
  });

  const total = totalCarrinho();
  document.getElementById('resumo-subtotal').textContent = formatarPreco(total);
  document.getElementById('resumo-total').textContent = formatarPreco(total);
}

function alterarItemCarrinho(idx, delta) {
  const item = carrinho[idx];
  if (!item) return;
  alterarCarrinho(item.nome, item.preco, delta);
  renderizarCarrinho();
}

/* ════════════════════════════════════════════════════════
   RENDERIZAÇÃO — CONFIRMAÇÃO
════════════════════════════════════════════════════════ */
function renderizarConfirmacao() {
  const lista = document.getElementById('confirmacao-lista');
  lista.innerHTML = '';
  carrinho.forEach(item => {
    const div = document.createElement('div');
    div.className = 'confirmacao-item';
    div.innerHTML = `
      <span>${item.qtd}× ${item.nome}</span>
      <span>${formatarPreco(item.preco * item.qtd)}</span>
    `;
    lista.appendChild(div);
  });
  document.getElementById('confirmacao-total-val').textContent = formatarPreco(totalCarrinho());
}

/* ════════════════════════════════════════════════════════
   FINALIZAR PEDIDO
════════════════════════════════════════════════════════ */
function finalizarPedido() {
  const num = String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('numero-pedido').textContent = `#${num}`;
  carrinho = [];
  atualizarContadores();
  mostrarTela('sucesso');
  falar(`Pedido número ${num} realizado com sucesso! Aguarde ser chamado no balcão.`);
}

function novoAtendimento() {
  carrinho = [];
  atualizarContadores();
  AC.fase = 'categorias';
  AC.catIdx = 0; AC.prodIdx = 0; AC.itemIdx = 0;
  mostrarTela('welcome');
}

/* ════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════ */
let toastTimer = null;
function mostrarToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.classList.add('hidden'), 350);
  }, 2000);
}

/* ════════════════════════════════════════════════════════
   WEB SPEECH API — TEXT-TO-SPEECH
════════════════════════════════════════════════════════ */
function falar(texto, urgente = false) {
  if (!window.speechSynthesis) return;
  if (urgente) window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(texto);
  utter.lang = 'pt-BR';
  utter.rate = 0.95;
  utter.pitch = 1.0;
  utter.volume = 1.0;

  // Tenta selecionar voz pt-BR
  const vozes = speechSynthesis.getVoices();
  const voz = vozes.find(v => v.lang.startsWith('pt')) || null;
  if (voz) utter.voice = voz;

  window.speechSynthesis.speak(utter);
}

// Vozes podem carregar assíncronamente
speechSynthesis.onvoiceschanged = () => { /* pronto */ };

/* ════════════════════════════════════════════════════════
   MODO ACESSÍVEL — ATIVAÇÃO / DESATIVAÇÃO
════════════════════════════════════════════════════════ */
function ativarModoAcessivel() {
  modoAcessivel = true;
  AC.fase = 'menu_principal';
  AC.menuIdx = 0;
  AC.catIdx = 0; AC.prodIdx = 0; AC.itemIdx = 0;

  document.getElementById('overlay-acessivel').classList.remove('hidden');
  atualizarInfoAcessivel();
  falar('Bem-vindo ao modo acessível. Você está no Menu Principal. Primeira opção: Ver Cardápio. Utilize clique curto para avançar. Clique longo para selecionar. Duplo clique para voltar.', true);
}

function sairModoAcessivel() {
  modoAcessivel = false;
  window.speechSynthesis && window.speechSynthesis.cancel();
  document.getElementById('overlay-acessivel').classList.add('hidden');
}

/* ════════════════════════════════════════════════════════
   MODO ACESSÍVEL — ESTADO & RENDERIZAÇÃO
════════════════════════════════════════════════════════ */
function atualizarInfoAcessivel() {
  const statusEl = document.getElementById('acessivel-status');
  const itemEl   = document.getElementById('acessivel-item-atual');
  const descEl   = document.getElementById('acessivel-descricao');

  const qtdEl    = document.getElementById('acessivel-qtd');
  const totalEl  = document.getElementById('acessivel-total');
  qtdEl.textContent  = totalItens();
  totalEl.textContent = formatarPreco(totalCarrinho());

  if (AC.fase === 'menu_principal') {
    statusEl.textContent = 'Menu Principal';
    if (AC.menuIdx === 0) {
      itemEl.textContent = '📖 Ver Cardápio';
      descEl.textContent = 'Navegar pelas categorias e produtos';
    } else {
      itemEl.textContent = `🛒 Ver Carrinho (${totalItens()} itens)`;
      descEl.textContent = `Ir para o carrinho e finalizar. Total: ${formatarPreco(totalCarrinho())}`;
    }
    return;
  }

  if (AC.fase === 'categorias') {
    const cat = cardapio.categorias[AC.catIdx];
    statusEl.textContent = 'Escolha a categoria';
    itemEl.textContent   = `${cat.emoji}  ${cat.nome}`;
    descEl.textContent   = `${cat.itens.length} itens disponíveis`;
    return;
  }

  if (AC.fase === 'produtos') {
    const cat  = cardapio.categorias[AC.catIdx];
    const prod = cat.itens[AC.prodIdx];
    statusEl.textContent = `Categoria: ${cat.nome}`;
    itemEl.textContent   = prod.nome;
    descEl.textContent   = `${prod.descricao} — ${formatarPreco(prod.preco)}`;
    return;
  }

  if (AC.fase === 'carrinho') {
    if (carrinho.length === 0) {
      statusEl.textContent = 'Carrinho';
      itemEl.textContent   = 'Carrinho vazio';
      descEl.textContent   = 'Duplo clique para voltar ao cardápio';
      return;
    }
    const op = carrinhoOpcoes();
    const cur = op[AC.itemIdx];
    statusEl.textContent = `Carrinho — ${totalItens()} itens`;
    itemEl.textContent   = cur.label;
    descEl.textContent   = cur.descVis;
    return;
  }

  if (AC.fase === 'confirmar') {
    statusEl.textContent = 'Confirmação';
    itemEl.textContent   = 'Confirmar pedido?';
    descEl.textContent   = `Total: ${formatarPreco(totalCarrinho())}`;
  }
}

function carrinhoOpcoes() {
  const ops = [];
  ops.push({ 
    label: 'Finalizar Pedido', 
    descVis: `Total: ${formatarPreco(totalCarrinho())}`,
    descFala: `Valor total do pedido: ${falarPreco(totalCarrinho())}. Clique longo para ir para a confirmação.`,
    tipo: 'finalizar' 
  });

  carrinho.forEach(it => {
    ops.push({
      label: `${it.qtd}× ${it.nome}`,
      descVis: `Subtotal: ${formatarPreco(it.preco * it.qtd)}`,
      descFala: `Subtotal: ${falarPreco(it.preco * it.qtd)}. Clique longo para remover uma unidade deste item.`,
      tipo:  'item',
      ref:   it,
    });
  });

  ops.push({ 
    label: 'Continuar Comprando', 
    descVis: 'Voltar ao cardápio',
    descFala: 'Clique longo para voltar ao cardápio.',
    tipo: 'continuar' 
  });
  return ops;
}

/* ════════════════════════════════════════════════════════
   MODO ACESSÍVEL — AÇÕES
════════════════════════════════════════════════════════ */
function acessivelAvancar() {
  if (AC.fase === 'menu_principal') {
    AC.menuIdx = (AC.menuIdx + 1) % 2;
    atualizarInfoAcessivel();
    if (AC.menuIdx === 0) {
      falar('Opção: Ver Cardápio. Clique longo para abrir as categorias.', true);
    } else {
      falar(`Opção: Ver Carrinho e Finalizar. Você tem ${totalItens()} itens. Total: ${falarPreco(totalCarrinho())}.`, true);
    }
    return;
  }

  if (AC.fase === 'categorias') {
    AC.catIdx = (AC.catIdx + 1) % cardapio.categorias.length;
    atualizarInfoAcessivel();
    const cat = cardapio.categorias[AC.catIdx];
    falar(`Categoria: ${cat.nome}. ${cat.itens.length} itens.`, true);
    return;
  }

  if (AC.fase === 'produtos') {
    const cat = cardapio.categorias[AC.catIdx];
    AC.prodIdx = (AC.prodIdx + 1) % cat.itens.length;
    atualizarInfoAcessivel();
    const prod = cat.itens[AC.prodIdx];
    falar(`${prod.nome}. ${prod.descricao}. Valor ${falarPreco(prod.preco)}.`, true);
    return;
  }

  if (AC.fase === 'carrinho') {
    const ops = carrinhoOpcoes();
    AC.itemIdx = (AC.itemIdx + 1) % ops.length;
    atualizarInfoAcessivel();
    const cur = ops[AC.itemIdx];
    falar(`Opção: ${cur.label}. ${cur.descFala}`, true);
    return;
  }
}

function acessivelSelecionar() {
  if (AC.fase === 'menu_principal') {
    if (AC.menuIdx === 0) {
      AC.fase = 'categorias';
      AC.catIdx = 0;
      atualizarInfoAcessivel();
      const cat = cardapio.categorias[0];
      falar(`Cardápio aberto. Primeira categoria: ${cat.nome}. ${cat.itens.length} itens.`, true);
    } else {
      AC.fase = 'carrinho';
      AC.itemIdx = 0;
      atualizarInfoAcessivel();
      if (carrinho.length === 0) {
        falar('Seu carrinho está vazio. Adicione itens antes de tentar finalizar. Duplo clique para voltar ao menu principal.', true);
      } else {
        const ops = carrinhoOpcoes();
        const cur = ops[0];
        falar(`Você entrou no carrinho com ${totalItens()} itens. Valor total: ${falarPreco(totalCarrinho())}. Dê um clique curto para navegar e remover itens. Primeira opção: ${cur.label}. ${cur.descFala}`, true);
      }
    }
    return;
  }

  if (AC.fase === 'categorias') {
    const cat = cardapio.categorias[AC.catIdx];
    AC.fase = 'produtos';
    AC.prodIdx = 0;
    atualizarInfoAcessivel();
    const prod = cat.itens[0];
    falar(`Categoria ${cat.nome} selecionada. Primeiro item: ${prod.nome}. ${falarPreco(prod.preco)}.`, true);
    return;
  }

  if (AC.fase === 'produtos') {
    const cat  = cardapio.categorias[AC.catIdx];
    const prod = cat.itens[AC.prodIdx];
    alterarCarrinho(prod.nome, prod.preco, +1);
    atualizarInfoAcessivel();
    falar(`${prod.nome} adicionado ao carrinho. O carrinho possui ${totalItens()} itens. Total: ${falarPreco(totalCarrinho())}. Continue clicando curto para ver mais produtos, ou dê duplo clique para voltar às categorias.`, true);
    return;
  }

  if (AC.fase === 'carrinho') {
    const ops = carrinhoOpcoes();
    const cur = ops[AC.itemIdx];
    if (cur.tipo === 'finalizar') {
      if (carrinho.length === 0) {
        falar('Seu carrinho está vazio. Adicione itens antes de finalizar.', true);
        return;
      }
      AC.fase = 'confirmar';
      atualizarInfoAcessivel();
      falar(`Confirmar pedido? Total: ${falarPreco(totalCarrinho())}. Clique longo para confirmar. Duplo clique para voltar.`, true);
    } else if (cur.tipo === 'continuar') {
      AC.fase = 'categorias';
      AC.catIdx = 0;
      atualizarInfoAcessivel();
      falar('Voltando ao cardápio. Navegue pelas categorias.', true);
    } else {
      // Remove uma unidade do item
      const it = cur.ref;
      alterarCarrinho(it.nome, it.preco, -1);
      AC.itemIdx = Math.min(AC.itemIdx, carrinhoOpcoes().length - 1);
      atualizarInfoAcessivel();
      falar(`${it.nome} removido. Carrinho: ${totalItens()} itens.`, true);
    }
    return;
  }

  if (AC.fase === 'confirmar') {
    finalizarPedidoAcessivel();
  }
}

let _ultimoVoltar = 0;
function voltarAcessivel() {
  // Evita duplo disparo acidental num intervalo menor que 800ms
  if (Date.now() - _ultimoVoltar < 800) return;
  _ultimoVoltar = Date.now();

  // Garante que qualquer fala anterior seja cancelada antes de falar o destino
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  if (AC.fase === 'produtos') {
    const cat = cardapio.categorias[AC.catIdx];
    AC.fase = 'categorias';
    atualizarInfoAcessivel();
    falar(`Voltou para o cardápio. Categoria atual: ${cat.nome}. Clique curto para mudar de categoria. Clique longo para entrar na categoria.`, true);
    return;
  }

  if (AC.fase === 'carrinho') {
    AC.fase = 'menu_principal';
    AC.menuIdx = 1;
    atualizarInfoAcessivel();
    falar(`Voltou para o menu principal. Opção atual: Ver Carrinho.`, true);
    return;
  }

  if (AC.fase === 'confirmar') {
    AC.fase = 'carrinho';
    AC.itemIdx = 0;
    atualizarInfoAcessivel();
    falar(`Voltou para o carrinho. Você tem ${totalItens()} itens. Total: ${falarPreco(totalCarrinho())}. Clique curto para navegar pelos itens.`, true);
    return;
  }

  if (AC.fase === 'categorias') {
    AC.fase = 'menu_principal';
    AC.menuIdx = 0;
    atualizarInfoAcessivel();
    falar(`Voltou para o menu principal. Opção atual: Ver Cardápio.`, true);
    return;
  }

  if (AC.fase === 'menu_principal') {
    falar('Você já está no menu principal. Não é possível voltar mais.', true);
  }
}

function finalizarPedidoAcessivel() {
  const num = String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('numero-pedido').textContent = `#${num}`;
  carrinho = [];
  AC.fase = 'categorias';
  AC.catIdx = 0;
  atualizarInfoAcessivel();
  falar(`Pedido número ${num} realizado com sucesso! Aguarde ser chamado no balcão. Obrigado por usar o modo acessível.`, true);
  // Fecha overlay depois de um tempo
  setTimeout(() => {
    sairModoAcessivel();
    mostrarTela('sucesso');
  }, 5000);
}

/* ════════════════════════════════════════════════════════
   BOTÃO ÚNICO — DETECÇÃO CLIQUE CURTO / LONGO / DUPLO
   Fluxo:
     mousedown → inicia timer de clique longo (LONGO_MS)
     mouseup (antes do timer) → clique curto/duplo
       - se já houve um clique curto recente (< DUPLO_MS) → DUPLO
       - senão, agenda verificação após DUPLO_MS → CURTO
     mouseup (depois do timer) → já foi tratado como longo, ignora
════════════════════════════════════════════════════════ */
const DUPLO_MS       = 350;
let _duploTimer      = null;   // timer aguardando 2º clique
let _aguardandoDuplo = false;  // true = 1º clique curto registrado

function iniciarPressao(e) {
  if (e) e.preventDefault();
  pressaoInicio = Date.now();
  document.getElementById('btn-navegacao').classList.add('pressionado');

  pressaoTimer = setTimeout(() => {
    // ── Clique LONGO ──
    pressaoTimer  = null;
    pressaoInicio = 0;
    // Cancela qualquer espera de duplo clique pendente
    if (_duploTimer) { clearTimeout(_duploTimer); _duploTimer = null; }
    _aguardandoDuplo = false;
    document.getElementById('btn-navegacao').classList.remove('pressionado');
    acessivelSelecionar();
  }, LONGO_MS);
}

function liberarPressao(e) {
  if (e) e.preventDefault();
  document.getElementById('btn-navegacao').classList.remove('pressionado');

  // Se o timer já disparou (clique longo confirmado), não faz nada
  if (!pressaoTimer) return;
  clearTimeout(pressaoTimer);
  pressaoTimer  = null;
  pressaoInicio = 0;

  // ── Clique CURTO detectado ──
  if (_aguardandoDuplo) {
    // Segundo clique dentro do intervalo → DUPLO CLIQUE
    clearTimeout(_duploTimer);
    _duploTimer      = null;
    _aguardandoDuplo = false;
    voltarAcessivel();
  } else {
    // Primeiro clique curto: aguarda possível segundo
    _aguardandoDuplo = true;
    _duploTimer = setTimeout(() => {
      _duploTimer      = null;
      _aguardandoDuplo = false;
      acessivelAvancar(); // tempo esgotado → era clique simples
    }, DUPLO_MS);
  }
}

/* ════════════════════════════════════════════════════════
   UTILITÁRIOS
════════════════════════════════════════════════════════ */
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function falarPreco(valor) {
  // Formata para fala natural: "15,00" → "quinze reais"
  // Usa o locale pt-BR com palavras
  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);
  let texto = `${inteiro} reais`;
  if (centavos > 0) texto += ` e ${centavos} centavos`;
  return texto;
}
