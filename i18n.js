/* ════════════════════════════════════════════════════════
   INTERNACIONALIZAÇÃO (i18n)
   Idiomas suportados: pt-BR | en-US
════════════════════════════════════════════════════════ */

'use strict';

const TRADUCOES = {
  'pt-BR': {
    /* ── Geral ── */
    lang_tts: 'pt-BR',

    /* ── Welcome ── */
    slogan:           'Experiência gastronômica do seu jeito',
    btn_iniciar:      'Iniciar Pedido',
    btn_acessivel:    'Modo Acessível',
    welcome_hint:     'Toque na tela para começar',

    /* ── Topbar ── */
    nav_inicio:       '← Início',
    nav_voltar:       '← Voltar',
    nav_cardapio:     '← Cardápio',
    nav_carrinho_btn: '← Carrinho',
    topbar_cardapio:  'Cardápio',
    topbar_pedido:    'Seu Pedido',
    topbar_confirmar: 'Confirmar Pedido',

    /* ── Carrinho ── */
    carrinho_vazio_msg:   'Seu carrinho está vazio.',
    carrinho_ver:         'Ver Cardápio',
    resumo_titulo:        'Resumo do Pedido',
    resumo_subtotal:      'Subtotal',
    resumo_total:         'Total',
    btn_finalizar:        '✔ Finalizar Pedido',
    btn_add_mais:         '+ Adicionar Mais Itens',
    item_unidade:         '/ unidade',

    /* ── Confirmação ── */
    confirm_revisar:      'Revise seu pedido antes de finalizar',
    confirm_total:        'Total a pagar:',
    btn_editar:           'Editar Pedido',
    btn_confirmar_pagar:  '✔ Confirmar e Pagar',

    /* ── Loading ── */
    loading_titulo:   'Processando seu pedido...',
    loading_subtitulo:'Por favor, aguarde um momento.',

    /* ── Sucesso ── */
    sucesso_titulo:   'Pedido Realizado!',
    sucesso_numero:   'Número:',
    sucesso_aguarde:  'Aguarde ser chamado no balcão.',
    btn_novo:         'Novo Atendimento',

    /* ── Modal produto ── */
    modal_qtd_label:  'Quantidade no carrinho:',
    btn_concluir:     '✔ Concluir',

    /* ── Overlay acessível ── */
    ac_badge:         '⠿ MODO ACESSÍVEL ATIVO',
    ac_btn_sair:      '✕ Sair',
    ac_instrucao_curto:  'Próxima opção',
    ac_instrucao_longo:  'Selecionar',
    ac_instrucao_duplo:  'Voltar',
    ac_kbd_curto:     'Clique curto',
    ac_kbd_longo:     'Clique longo',
    ac_kbd_duplo:     'Duplo clique',
    ac_itens:         'itens',
    ac_total_label:   'Total:',

    /* ── Toast ── */
    toast_adicionado: '✔ {nome} adicionado',
    toast_removido:   '✕ {nome} removido',
    toast_carrinho_vazio: '⚠ Adicione itens ao carrinho primeiro',
    toast_max_estoque:'Quantidade máxima atingida',

    /* ── Fala — modo acessível ── */
    fala_bemvindo:    'Bem-vindo ao modo acessível. Você está no Menu Principal. Primeira opção: Ver Cardápio. Clique longo para selecionar o Cardápio, clique curto para ir para o Carrinho, clique duplo para voltar.',
    fala_menu_cardapio:  'Opção: Ver Cardápio. Clique longo para selecionar o Cardápio, clique curto para ir para o Carrinho, clique duplo para voltar.',
    fala_menu_carrinho:  'Opção: Ver Carrinho e Finalizar. Você tem {qtd} itens. Total: {total}. Clique longo para entrar no Carrinho, clique curto para ir para o Cardápio, clique duplo para voltar.',
    fala_cat:            'Categoria: {nome}. {qtd} itens. Clique longo para entrar na categoria, clique curto para mostrar a próxima, clique duplo para voltar ao menu principal.',
    fala_prod:           '{nome}. {desc}. Valor {preco}. Clique longo para ver opções, clique curto para mostrar o próximo, clique duplo para voltar ao cardápio.',
    fala_op_adicionar:   'Adicionar uma unidade.',
    fala_op_remover:     'Remover uma unidade.',
    fala_op_concluir:    'Concluir e fechar.',
    fala_opcao:          'Opção: {op}. Clique longo para confirmar, clique curto para ver mais opções, clique duplo para cancelar e sair.',
    fala_carrinho_vazio: 'Seu carrinho está vazio. Duplo clique para voltar.',
    fala_carrinho_vazio_finalizar: 'Seu carrinho está vazio. Adicione itens antes de tentar finalizar. Duplo clique para voltar ao menu principal.',
    fala_opcao_nav:      'Opção: {label}. {desc}',
    fala_cardapio_aberto:'Cardápio aberto. Primeira categoria: {nome}. {qtd} itens. Clique longo para entrar na categoria, clique curto para mostrar a próxima, clique duplo para voltar ao menu principal.',
    fala_entrou_carrinho:'Você entrou no carrinho com {qtd} itens. Valor total: {total}. Dê um clique curto para navegar e remover itens. Primeira opção: {label}. {desc}',
    fala_cat_selecionada:'Categoria {nome} selecionada. Primeiro item: {prod}. Valor {preco}. Clique longo para ver opções, clique curto para mostrar o próximo, clique duplo para voltar ao cardápio.',
    fala_prod_selecionado:'Você adicionou {qtd} {nome} ao carrinho. Valor {preco}. Aperte longo para adicionar mais, clique curto para avançar, clique duplo para cancelar e sair.',
    fala_max_estoque:    'Não há mais produtos para adicionar daquele produto específico.',
    fala_unidade_add:    'Unidade adicionada. Quantidade atual: {qtd}.',
    fala_unidade_rem:    'Unidade removida. Quantidade atual: {qtd}.',
    fala_sem_remover:    'Não há produtos para remover.',
    fala_concluir_add:   '{qtd} {nome} adicionado(s) ao carrinho. ',
    fala_concluir_nada:  'Nenhum item adicionado ao carrinho. ',
    fala_volta_produtos: 'Voltando para lista de produtos. Produto atual: {nome}.',
    fala_confirmar:      'Confirmar pedido? Total: {total}. Clique longo para confirmar. Duplo clique para voltar.',
    fala_item_removido:  '{nome} removido. Carrinho: {qtd} itens.',
    fala_processando:    'Processando seu pedido, aguarde um momento...',
    fala_sucesso:        'Pedido número {num} realizado com sucesso! Aguarde ser chamado no balcão. Obrigado por usar o modo acessível.',
    fala_cancelado:      'Cancelado. Nenhuma alteração foi feita. Você voltou para a lista de produtos. Produto atual: {nome}.',
    fala_volta_categorias:'Voltou para o cardápio. Categoria atual: {nome}. Clique curto para mudar de categoria. Clique longo para entrar na categoria.',
    fala_volta_menu_carrinho: 'Voltou para o menu principal. Opção atual: Ver Carrinho.',
    fala_volta_carrinho: 'Voltou para o carrinho. Você tem {qtd} itens. Total: {total}. Clique curto para navegar pelos itens.',
    fala_volta_menu_cardapio: 'Voltou para o menu principal. Opção atual: Ver Cardápio.',
    fala_ja_inicio:      'Você já está no menu principal. Não é possível voltar mais.',
    fala_finalizar_desc: 'Clique longo para ir para a confirmação.',
    fala_continuar_desc: 'Clique longo para voltar ao cardápio.',
    fala_item_desc:      'Subtotal: {sub}. Clique longo para remover uma unidade deste item.',
    fala_volta_cat_ir:   'Voltando ao cardápio. Navegue pelas categorias.',

    /* ── Status acessível ── */
    ac_status_menu:      'Menu Principal',
    ac_status_cats:      'Escolha a categoria',
    ac_status_prod:      'Categoria: {nome}',
    ac_status_modal:     'Produto: {nome}',
    ac_status_carrinho:  'Carrinho — {qtd} itens',
    ac_status_confirmar: 'Confirmação',
    ac_item_ver_cardapio:'📖 Ver Cardápio',
    ac_item_ver_cardapio_desc: 'Navegar pelas categorias e produtos',
    ac_item_ver_carrinho:'🛒 Ver Carrinho ({qtd} itens)',
    ac_item_ver_carrinho_desc: 'Ir para o carrinho e finalizar. Total: {total}',
    ac_item_confirmar:   'Confirmar pedido?',
    ac_item_confirmar_desc: 'Total: {total}',
    ac_modal_op: ['Adicionar +1', 'Remover -1', 'Concluir (Fechar)'],
    ac_modal_qtd_sel:    'Selecionado: {qtd}',
    ac_carrinho_vazio_item: 'Carrinho vazio',
    ac_carrinho_vazio_desc: 'Duplo clique para voltar ao cardápio',
    ac_finalizar_label:  'Finalizar Pedido',
    ac_finalizar_desc:   'Total: {total}',
    ac_continuar_label:  'Continuar Comprando',
    ac_continuar_desc:   'Voltar ao cardápio',
  },

  'en-US': {
    /* ── Geral ── */
    lang_tts: 'en-US',

    /* ── Welcome ── */
    slogan:           'A gastronomic experience your way',
    btn_iniciar:      'Start Order',
    btn_acessivel:    'Accessible Mode',
    welcome_hint:     'Touch the screen to begin',

    /* ── Topbar ── */
    nav_inicio:       '← Home',
    nav_voltar:       '← Back',
    nav_cardapio:     '← Menu',
    nav_carrinho_btn: '← Cart',
    topbar_cardapio:  'Menu',
    topbar_pedido:    'Your Order',
    topbar_confirmar: 'Confirm Order',

    /* ── Carrinho ── */
    carrinho_vazio_msg:   'Your cart is empty.',
    carrinho_ver:         'View Menu',
    resumo_titulo:        'Order Summary',
    resumo_subtotal:      'Subtotal',
    resumo_total:         'Total',
    btn_finalizar:        '✔ Place Order',
    btn_add_mais:         '+ Add More Items',
    item_unidade:         '/ each',

    /* ── Confirmação ── */
    confirm_revisar:      'Review your order before confirming',
    confirm_total:        'Total to pay:',
    btn_editar:           'Edit Order',
    btn_confirmar_pagar:  '✔ Confirm & Pay',

    /* ── Loading ── */
    loading_titulo:    'Processing your order...',
    loading_subtitulo: 'Please wait a moment.',

    /* ── Sucesso ── */
    sucesso_titulo:   'Order Placed!',
    sucesso_numero:   'Number:',
    sucesso_aguarde:  'Wait to be called at the counter.',
    btn_novo:         'New Order',

    /* ── Modal produto ── */
    modal_qtd_label:  'Quantity in cart:',
    btn_concluir:     '✔ Done',

    /* ── Overlay acessível ── */
    ac_badge:            '⠿ ACCESSIBLE MODE ON',
    ac_btn_sair:         '✕ Exit',
    ac_instrucao_curto:  'Next option',
    ac_instrucao_longo:  'Select',
    ac_instrucao_duplo:  'Go back',
    ac_kbd_curto:        'Short press',
    ac_kbd_longo:        'Long press',
    ac_kbd_duplo:        'Double press',
    ac_itens:            'items',
    ac_total_label:      'Total:',

    /* ── Toast ── */
    toast_adicionado: '✔ {nome} added',
    toast_removido:   '✕ {nome} removed',
    toast_carrinho_vazio: '⚠ Add items to your cart first',
    toast_max_estoque:'Maximum quantity reached',

    /* ── Fala — modo acessível ── */
    fala_bemvindo:    'Welcome to accessible mode. You are in the Main Menu. First option: View Menu. Long press to select Menu, short press to go to Cart, double press to go back.',
    fala_menu_cardapio:  'Option: View Menu. Long press to select Menu, short press to go to Cart, double press to go back.',
    fala_menu_carrinho:  'Option: View Cart and Checkout. You have {qtd} items. Total: {total}. Long press to enter Cart, short press to go to Menu, double press to go back.',
    fala_cat:            'Category: {nome}. {qtd} items. Long press to enter category, short press to show next, double press to return to main menu.',
    fala_prod:           '{nome}. {desc}. Price {preco}. Long press for options, short press to show next, double press to return to menu.',
    fala_op_adicionar:   'Add one unit.',
    fala_op_remover:     'Remove one unit.',
    fala_op_concluir:    'Done and close.',
    fala_opcao:          'Option: {op}. Long press to confirm, short press for more options, double press to cancel and exit.',
    fala_carrinho_vazio: 'Your cart is empty. Double press to go back.',
    fala_carrinho_vazio_finalizar: 'Your cart is empty. Add items before checking out. Double press to return to the main menu.',
    fala_opcao_nav:      'Option: {label}. {desc}',
    fala_cardapio_aberto:'Menu opened. First category: {nome}. {qtd} items. Long press to enter category, short press to show next, double press to return to main menu.',
    fala_entrou_carrinho:'You entered the cart with {qtd} items. Total: {total}. Short press to navigate and remove items. First option: {label}. {desc}',
    fala_cat_selecionada:'Category {nome} selected. First item: {prod}. Price {preco}. Long press for options, short press to show next, double press to return to menu.',
    fala_prod_selecionado:'You added {qtd} {nome} to the cart. Price {preco}. Long press to add more, short press to advance, double press to cancel and exit.',
    fala_max_estoque:    'No more units available for that product.',
    fala_unidade_add:    'Unit added. Current quantity: {qtd}.',
    fala_unidade_rem:    'Unit removed. Current quantity: {qtd}.',
    fala_sem_remover:    'No units to remove.',
    fala_concluir_add:   '{qtd} {nome} added to cart. ',
    fala_concluir_nada:  'No items added to cart. ',
    fala_volta_produtos: 'Back to product list. Current product: {nome}.',
    fala_confirmar:      'Confirm order? Total: {total}. Long press to confirm. Double press to go back.',
    fala_item_removido:  '{nome} removed. Cart: {qtd} items.',
    fala_processando:    'Processing your order, please wait...',
    fala_sucesso:        'Order number {num} placed successfully! Wait to be called at the counter. Thank you for using accessible mode.',
    fala_cancelado:      'Cancelled. No changes were made. You returned to the product list. Current product: {nome}.',
    fala_volta_categorias:'Back to menu. Current category: {nome}. Short press to change category. Long press to enter.',
    fala_volta_menu_carrinho: 'Back to main menu. Current option: View Cart.',
    fala_volta_carrinho: 'Back to cart. You have {qtd} items. Total: {total}. Short press to navigate items.',
    fala_volta_menu_cardapio: 'Back to main menu. Current option: View Menu.',
    fala_ja_inicio:      'You are already at the main menu. Cannot go back further.',
    fala_finalizar_desc: 'Long press to go to confirmation.',
    fala_continuar_desc: 'Long press to return to the menu.',
    fala_item_desc:      'Subtotal: {sub}. Long press to remove one unit of this item.',
    fala_volta_cat_ir:   'Back to menu. Navigate through categories.',

    /* ── Status acessível ── */
    ac_status_menu:      'Main Menu',
    ac_status_cats:      'Choose a category',
    ac_status_prod:      'Category: {nome}',
    ac_status_modal:     'Product: {nome}',
    ac_status_carrinho:  'Cart — {qtd} items',
    ac_status_confirmar: 'Confirmation',
    ac_item_ver_cardapio:'📖 View Menu',
    ac_item_ver_cardapio_desc: 'Browse categories and products',
    ac_item_ver_carrinho:'🛒 View Cart ({qtd} items)',
    ac_item_ver_carrinho_desc: 'Go to cart and checkout. Total: {total}',
    ac_item_confirmar:   'Confirm order?',
    ac_item_confirmar_desc: 'Total: {total}',
    ac_modal_op: ['Add +1', 'Remove -1', 'Done (Close)'],
    ac_modal_qtd_sel:    'Selected: {qtd}',
    ac_carrinho_vazio_item: 'Empty cart',
    ac_carrinho_vazio_desc: 'Double press to return to menu',
    ac_finalizar_label:  'Place Order',
    ac_finalizar_desc:   'Total: {total}',
    ac_continuar_label:  'Continue Shopping',
    ac_continuar_desc:   'Back to menu',
  },
};

function getIdiomaInicial() {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.startsWith('en') ? 'en-US' : 'pt-BR';
  }
  return 'pt-BR';
}

let idiomaAtual = getIdiomaInicial();

function t(chave, vars = {}) {
  const dic = TRADUCOES[idiomaAtual] || TRADUCOES['pt-BR'];
  let str = dic[chave] ?? TRADUCOES['pt-BR'][chave] ?? chave;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replaceAll(`{${k}}`, v);
  });
  return str;
}

function alternarIdioma() {
  idiomaAtual = idiomaAtual === 'pt-BR' ? 'en-US' : 'pt-BR';
  aplicarTraducoes();
  // Re-renderiza tela dinâmica atual (carrinho, produtos, etc)
  if (typeof rerenderTelaAtual === 'function') rerenderTelaAtual();
  // Atualiza overlay acessível se ativo
  if (typeof atualizarInfoAcessivel === 'function' && typeof modoAcessivel !== 'undefined' && modoAcessivel) {
    atualizarInfoAcessivel();
  }
}

function aplicarTraducoes() {
  document.documentElement.lang = idiomaAtual;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const chave = el.dataset.i18n;
    el.textContent = t(chave);
  });

  // Atualiza botões de idioma
  const labelLang = idiomaAtual === 'pt-BR' ? 'EN' : 'PT';
  document.querySelectorAll('.btn-idioma').forEach(el => {
    el.textContent = labelLang;
    el.title = idiomaAtual === 'pt-BR' ? 'Switch to English' : 'Mudar para Português';
  });
}
