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
  aplicarTraducoes();
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
    mostrarToast(t('toast_carrinho_vazio'));
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
      <div class="categoria-nome">${nomeCat(cat)}</div>
      <div class="categoria-qtd">${cat.itens.length} ${t('ac_itens')}</div>
    `;
    card.addEventListener('click', () => selecionarCategoria(i));
    grid.appendChild(card);
  });
}

function selecionarCategoria(idx) {
  AC.categoriaAtual = cardapio.categorias[idx];
  AC.catIdx = idx;
  document.getElementById('titulo-categoria').textContent =
    `${AC.categoriaAtual.emoji} ${nomeCat(AC.categoriaAtual)}`;
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
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.id = `prod-card-${i}`;
    card.innerHTML = `
      ${item.imagem ? `<img class="produto-img" src="${item.imagem}" alt="${nomeItem(item)}" onerror="this.style.display='none'">` : ''}
      <div class="produto-nome">${nomeItem(item)}</div>
      <div class="produto-descricao">${descItem(item)}</div>
      <div class="produto-preco">${formatarPrecoI18n(item.preco)}</div>
    `;
    card.onclick = () => abrirModalProduto(i);
    grid.appendChild(card);
  });
}

let produtoSelecionado = null;
let qtdTemporariaModal = 0;

function abrirModalProduto(idx) {
  const cat = AC.categoriaAtual || cardapio.categorias[AC.catIdx];
  produtoSelecionado = cat.itens[idx];
  qtdTemporariaModal = 1;
  
  document.getElementById('modal-produto-nome').textContent = nomeItem(produtoSelecionado);
  document.getElementById('modal-produto-descricao').textContent = descItem(produtoSelecionado);
  document.getElementById('modal-produto-preco').textContent = formatarPrecoI18n(produtoSelecionado.preco);
  document.getElementById('modal-produto-qtd').textContent = qtdTemporariaModal;

  const imgEl = document.getElementById('modal-produto-img');
  if (produtoSelecionado.imagem) {
    imgEl.src = produtoSelecionado.imagem;
    imgEl.alt = produtoSelecionado.nome;
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }
  
  document.getElementById('modal-produto').classList.add('show');
}

function fecharModalProduto() {
  document.getElementById('modal-produto').classList.remove('show');
  produtoSelecionado = null;
}

function confirmarModalProduto() {
  if (!produtoSelecionado) return;
  if (qtdTemporariaModal > 0) {
    alterarCarrinho(produtoSelecionado.nome, produtoSelecionado.preco, qtdTemporariaModal, produtoSelecionado.nome_en);
  }
  fecharModalProduto();
}

const MAX_ESTOQUE = 10;

function alterarQtdModal(delta) {
  if (!produtoSelecionado) return;

  if (delta > 0 && qtdTemporariaModal >= MAX_ESTOQUE) {
    mostrarToast(t('toast_max_estoque'));
    return;
  }
  
  qtdTemporariaModal += delta;
  if (qtdTemporariaModal < 0) qtdTemporariaModal = 0;
  
  document.getElementById('modal-produto-qtd').textContent = qtdTemporariaModal;
}

/* ════════════════════════════════════════════════════════
   CARRINHO — LÓGICA
════════════════════════════════════════════════════════ */
function alterarCarrinho(nome, preco, delta, nome_en = '') {
  const idx = carrinho.findIndex(i => i.nome === nome);
  if (idx === -1) {
    if (delta > 0) {
      carrinho.push({ nome, nome_en, preco, qtd: delta });
      mostrarToast(t('toast_adicionado', { nome: nomeCarrinho({ nome, nome_en }) }));
    }
  } else {
    carrinho[idx].qtd += delta;
    if (carrinho[idx].qtd <= 0) {
      carrinho.splice(idx, 1);
      mostrarToast(t('toast_removido', { nome: nomeCarrinho({ nome, nome_en }) }));
    } else if (delta > 0) {
      mostrarToast(t('toast_adicionado', { nome: nomeCarrinho({ nome, nome_en }) }));
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
        <p>${t('carrinho_vazio_msg')}</p>
        <button class="btn-primary" onclick="irParaCategorias()">${t('carrinho_ver')}</button>
      </div>`;
    document.getElementById('resumo-subtotal').textContent = formatarPrecoI18n(0);
    document.getElementById('resumo-total').textContent = formatarPrecoI18n(0);
    return;
  }

  carrinho.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'item-carrinho';
    div.innerHTML = `
      <div class="item-info">
        <div class="item-nome">${nomeCarrinho(item)}</div>
        <div class="item-unit">${formatarPrecoI18n(item.preco)} ${t('item_unidade')}</div>
      </div>
      <div class="item-controles">
        <button class="btn-menos" onclick="alterarItemCarrinho(${idx},-1)">−</button>
        <span class="produto-qtd-label">${item.qtd}</span>
        <button class="btn-mais" onclick="alterarItemCarrinho(${idx},+1)">+</button>
      </div>
      <div class="item-subtotal">${formatarPrecoI18n(item.preco * item.qtd)}</div>
    `;
    lista.appendChild(div);
  });

  const total = totalCarrinho();
  document.getElementById('resumo-subtotal').textContent = formatarPrecoI18n(total);
  document.getElementById('resumo-total').textContent = formatarPrecoI18n(total);
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
      <span>${item.qtd}× ${nomeCarrinho(item)}</span>
      <span>${formatarPreco(item.preco * item.qtd)}</span>
    `;
    lista.appendChild(div);
  });
  document.getElementById('confirmacao-total-val').textContent = formatarPrecoI18n(totalCarrinho());
}

/* ════════════════════════════════════════════════════════
   FINALIZAR PEDIDO
════════════════════════════════════════════════════════ */
function finalizarPedido() {
  const num = String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('numero-pedido').textContent = `#${num}`;
  carrinho = [];
  atualizarContadores();
  
  mostrarTela('loading');
  
  setTimeout(() => {
    mostrarTela('sucesso');
  }, 2000);
}

function novoAtendimento() {
  carrinho = [];
  atualizarContadores();
  AC.fase = 'categorias';
  AC.catIdx = 0; AC.prodIdx = 0; AC.itemIdx = 0;
  mostrarTela('welcome');
}

function rerenderTelaAtual() {
  if (telaAtual === 'categorias') renderizarCategorias();
  else if (telaAtual === 'produtos' && AC.categoriaAtual) renderizarProdutos(AC.categoriaAtual);
  else if (telaAtual === 'carrinho') renderizarCarrinho();
  else if (telaAtual === 'confirmacao') renderizarConfirmacao();
}

/* ════════════════════════════════════════════════════════
   HELPERS DE LOCALIZAÇÃO DO CARDÁPIO
════════════════════════════════════════════════════════ */
function nomeCat(cat)    { return idiomaAtual === 'en-US' && cat.nome_en        ? cat.nome_en        : cat.nome; }
function nomeItem(item)  { return idiomaAtual === 'en-US' && item.nome_en       ? item.nome_en       : item.nome; }
function descItem(item)  { return idiomaAtual === 'en-US' && item.descricao_en  ? item.descricao_en  : item.descricao; }
function nomeCarrinho(it){ return idiomaAtual === 'en-US' && it.nome_en         ? it.nome_en         : it.nome; }

/* ════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════ */
let toastTimer = null;
/* ════════════════════════════════════════════════════════
   FORMATAÇÃO DE PREÇO — adapta locale por idioma
════════════════════════════════════════════════════════ */
function formatarPrecoI18n(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.classList.add('hidden'), 350);
  }, 2000);
}

/* ════════════════════════════════════════════════════════
   WEB SPEECH API — TEXT-TO-SPEECH
════════════════════════════════════════════════════════ */
function falar(texto, urgente = false) {
  if (!window.speechSynthesis) return;
  if (urgente) window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(texto);
  utter.lang = t('lang_tts');
  utter.rate = 0.95;
  utter.pitch = 1.0;
  utter.volume = 1.0;

  const vozes = speechSynthesis.getVoices();
  const langPrefix = idiomaAtual === 'en-US' ? 'en' : 'pt';
  const voz = vozes.find(v => v.lang.startsWith(langPrefix)) || null;
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
  falar(t('fala_bemvindo'), true);
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
  totalEl.textContent = formatarPrecoI18n(totalCarrinho());

  if (AC.fase === 'menu_principal') {
    statusEl.textContent = t('ac_status_menu');
    if (AC.menuIdx === 0) {
      itemEl.textContent = t('ac_item_ver_cardapio');
      descEl.textContent = t('ac_item_ver_cardapio_desc');
    } else {
      itemEl.textContent = t('ac_item_ver_carrinho', { qtd: totalItens() });
      descEl.textContent = t('ac_item_ver_carrinho_desc', { total: formatarPrecoI18n(totalCarrinho()) });
    }
    return;
  }

  if (AC.fase === 'categorias') {
    const cat = cardapio.categorias[AC.catIdx];
    statusEl.textContent = t('ac_status_cats');
    itemEl.textContent   = `${cat.emoji}  ${nomeCat(cat)}`;
    descEl.textContent   = `${cat.itens.length} ${t('ac_itens')}`;
    return;
  }

  if (AC.fase === 'produtos') {
    const cat  = cardapio.categorias[AC.catIdx];
    const prod = cat.itens[AC.prodIdx];
    statusEl.textContent = t('ac_status_prod', { nome: nomeCat(cat) });
    itemEl.textContent   = nomeItem(prod);
    descEl.textContent   = `${descItem(prod)} — ${formatarPrecoI18n(prod.preco)}`;
    return;
  }

  if (AC.fase === 'modal_produto') {
    statusEl.textContent = t('ac_status_modal', { nome: nomeItem(produtoSelecionado) });
    const ops = t('ac_modal_op');
    itemEl.textContent = ops[AC.itemIdx];
    descEl.textContent = t('ac_modal_qtd_sel', { qtd: qtdTemporariaModal });
    return;
  }

  if (AC.fase === 'carrinho') {
    if (carrinho.length === 0) {
      statusEl.textContent = t('ac_status_confirmar').replace('Confirmação', 'Carrinho').replace('Confirmation', 'Cart');
      itemEl.textContent   = t('ac_carrinho_vazio_item');
      descEl.textContent   = t('ac_carrinho_vazio_desc');
      return;
    }
    const op = carrinhoOpcoes();
    const cur = op[AC.itemIdx];
    statusEl.textContent = t('ac_status_carrinho', { qtd: totalItens() });
    itemEl.textContent   = cur.label;
    descEl.textContent   = cur.descVis;
    return;
  }

  if (AC.fase === 'confirmar') {
    statusEl.textContent = t('ac_status_confirmar');
    itemEl.textContent   = t('ac_item_confirmar');
    descEl.textContent   = t('ac_item_confirmar_desc', { total: formatarPrecoI18n(totalCarrinho()) });
  }
}

function carrinhoOpcoes() {
  const ops = [];
  ops.push({
    label: t('ac_finalizar_label'),
    descVis: t('ac_finalizar_desc', { total: formatarPrecoI18n(totalCarrinho()) }),
    descFala: `${falarPreco(totalCarrinho())}. ${t('fala_finalizar_desc')}`,
    tipo: 'finalizar'
  });

  carrinho.forEach(it => {
    ops.push({
      label: `${it.qtd}× ${it.nome}`,
      descVis: t('ac_finalizar_desc', { total: formatarPrecoI18n(it.preco * it.qtd) }),
      descFala: t('fala_item_desc', { sub: falarPreco(it.preco * it.qtd) }),
      tipo:  'item',
      ref:   it,
    });
  });

  ops.push({
    label: t('ac_continuar_label'),
    descVis: t('ac_continuar_desc'),
    descFala: t('fala_continuar_desc'),
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
      falar(t('fala_menu_cardapio'), true);
    } else {
      falar(t('fala_menu_carrinho', { qtd: totalItens(), total: falarPreco(totalCarrinho()) }), true);
    }
    return;
  }

  if (AC.fase === 'categorias') {
    AC.catIdx = (AC.catIdx + 1) % cardapio.categorias.length;
    atualizarInfoAcessivel();
    const cat = cardapio.categorias[AC.catIdx];
    falar(t('fala_cat', { nome: nomeCat(cat), qtd: cat.itens.length }), true);
    return;
  }

  if (AC.fase === 'produtos') {
    const cat = cardapio.categorias[AC.catIdx];
    AC.prodIdx = (AC.prodIdx + 1) % cat.itens.length;
    atualizarInfoAcessivel();
    const prod = cat.itens[AC.prodIdx];
    falar(t('fala_prod', { nome: nomeItem(prod), desc: descItem(prod), preco: falarPreco(prod.preco) }), true);
    return;
  }

  if (AC.fase === 'modal_produto') {
    AC.itemIdx = (AC.itemIdx + 1) % 3;
    const opcoes = [t('fala_op_adicionar'), t('fala_op_remover'), t('fala_op_concluir')];
    atualizarInfoAcessivel();
    falar(t('fala_opcao', { op: opcoes[AC.itemIdx] }), true);
    return;
  }

  if (AC.fase === 'carrinho') {
    if (carrinho.length === 0) {
      falar(t('fala_carrinho_vazio'), true);
      return;
    }
    const ops = carrinhoOpcoes();
    AC.itemIdx = (AC.itemIdx + 1) % ops.length;
    atualizarInfoAcessivel();
    const cur = ops[AC.itemIdx];
    falar(t('fala_opcao_nav', { label: cur.label, desc: cur.descFala }), true);
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
      falar(t('fala_cardapio_aberto', { nome: cat.nome, qtd: cat.itens.length }), true);
    } else {
      AC.fase = 'carrinho';
      AC.itemIdx = 0;
      atualizarInfoAcessivel();
      if (carrinho.length === 0) {
        falar(t('fala_carrinho_vazio_finalizar'), true);
      } else {
        const ops = carrinhoOpcoes();
        const cur = ops[0];
        falar(t('fala_entrou_carrinho', { qtd: totalItens(), total: falarPreco(totalCarrinho()), label: cur.label, desc: cur.descFala }), true);
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
    falar(t('fala_cat_selecionada', { nome: nomeCat(cat), prod: nomeItem(prod), preco: falarPreco(prod.preco) }), true);
    return;
  }

  if (AC.fase === 'produtos') {
    const cat  = cardapio.categorias[AC.catIdx];
    const prod = cat.itens[AC.prodIdx];
    AC.fase = 'modal_produto';
    AC.itemIdx = 0;
    produtoSelecionado = prod;
    qtdTemporariaModal = 1;
    atualizarInfoAcessivel();
    falar(t('fala_prod_selecionado', { nome: nomeItem(prod), preco: falarPreco(prod.preco), qtd: qtdTemporariaModal }), true);
    return;
  }

  if (AC.fase === 'modal_produto') {
    if (AC.itemIdx === 0) {
      if (qtdTemporariaModal >= MAX_ESTOQUE) {
        falar(t('fala_max_estoque'), true);
      } else {
        qtdTemporariaModal++;
        atualizarInfoAcessivel();
        falar(t('fala_unidade_add', { qtd: qtdTemporariaModal }), true);
      }
    } else if (AC.itemIdx === 1) {
      if (qtdTemporariaModal > 0) {
        qtdTemporariaModal--;
        atualizarInfoAcessivel();
        falar(t('fala_unidade_rem', { qtd: qtdTemporariaModal }), true);
      } else {
        falar(t('fala_sem_remover'), true);
      }
    } else if (AC.itemIdx === 2) {
      let msg = '';
      if (qtdTemporariaModal > 0) {
        alterarCarrinho(produtoSelecionado.nome, produtoSelecionado.preco, qtdTemporariaModal, produtoSelecionado.nome_en);
        msg = t('fala_concluir_add', { qtd: qtdTemporariaModal, nome: nomeItem(produtoSelecionado) });
      } else {
        msg = t('fala_concluir_nada');
      }
      AC.fase = 'produtos';
      produtoSelecionado = null;
      atualizarInfoAcessivel();
      falar(`${msg}${t('fala_volta_produtos', { nome: nomeItem(cardapio.categorias[AC.catIdx].itens[AC.prodIdx]) })}`, true);
    }
    return;
  }

  if (AC.fase === 'carrinho') {
    if (carrinho.length === 0) {
      falar(t('fala_carrinho_vazio'), true);
      return;
    }
    const ops = carrinhoOpcoes();
    const cur = ops[AC.itemIdx];
    if (cur.tipo === 'finalizar') {
      AC.fase = 'confirmar';
      atualizarInfoAcessivel();
      falar(t('fala_confirmar', { total: falarPreco(totalCarrinho()) }), true);
    } else if (cur.tipo === 'continuar') {
      AC.fase = 'categorias';
      AC.catIdx = 0;
      atualizarInfoAcessivel();
      falar(t('fala_volta_cat_ir'), true);
    } else {
      const it = cur.ref;
      alterarCarrinho(it.nome, it.preco, -1, it.nome_en);
      AC.itemIdx = Math.min(AC.itemIdx, carrinhoOpcoes().length - 1);
      atualizarInfoAcessivel();
      falar(t('fala_item_removido', { nome: nomeCarrinho(it), qtd: totalItens() }), true);
    }
    return;
  }

  if (AC.fase === 'confirmar') {
    finalizarPedidoAcessivel();
  }
}

let _ultimoVoltar = 0;
function voltarAcessivel() {
  if (Date.now() - _ultimoVoltar < 800) return;
  _ultimoVoltar = Date.now();

  if (window.speechSynthesis) window.speechSynthesis.cancel();

  if (AC.fase === 'modal_produto') {
    AC.fase = 'produtos';
    produtoSelecionado = null;
    atualizarInfoAcessivel();
    falar(t('fala_cancelado', { nome: nomeItem(cardapio.categorias[AC.catIdx].itens[AC.prodIdx]) }), true);
    return;
  }

  if (AC.fase === 'produtos') {
    const cat = cardapio.categorias[AC.catIdx];
    AC.fase = 'categorias';
    atualizarInfoAcessivel();
    falar(t('fala_volta_categorias', { nome: nomeCat(cat) }), true);
    return;
  }

  if (AC.fase === 'carrinho') {
    AC.fase = 'menu_principal';
    AC.menuIdx = 1;
    atualizarInfoAcessivel();
    falar(t('fala_volta_menu_carrinho'), true);
    return;
  }

  if (AC.fase === 'confirmar') {
    AC.fase = 'carrinho';
    AC.itemIdx = 0;
    atualizarInfoAcessivel();
    falar(t('fala_volta_carrinho', { qtd: totalItens(), total: falarPreco(totalCarrinho()) }), true);
    return;
  }

  if (AC.fase === 'categorias') {
    AC.fase = 'menu_principal';
    AC.menuIdx = 0;
    atualizarInfoAcessivel();
    falar(t('fala_volta_menu_cardapio'), true);
    return;
  }

  if (AC.fase === 'menu_principal') {
    falar(t('fala_ja_inicio'), true);
  }
}

function finalizarPedidoAcessivel() {
  const num = String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('numero-pedido').textContent = `#${num}`;
  carrinho = [];
  atualizarContadores();

  modoAcessivel = false;
  mostrarTela('loading');
  falar(t('fala_processando'), true);

  setTimeout(() => {
    document.getElementById('overlay-acessivel').classList.add('hidden');
    mostrarTela('sucesso');
    falar(t('fala_sucesso', { num }), true);
  }, 2500);
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
   BARRA DE ESPAÇO — ESPELHA O BOTÃO ÚNICO
════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.code !== 'Space' || e.repeat) return;

  if (!modoAcessivel) {
    if (telaAtual === 'welcome') {
      e.preventDefault();
      ativarModoAcessivel();
    }
    return;
  }

  e.preventDefault();
  iniciarPressao(null);
});

document.addEventListener('keyup', e => {
  if (e.code !== 'Space') return;
  e.preventDefault();
  if (modoAcessivel) liberarPressao(null);
});

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
