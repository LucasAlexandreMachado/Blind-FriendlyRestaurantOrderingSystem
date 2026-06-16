/**
 * TOTEM DE AUTOATENDIMENTO ACESSÍVEL
 * Sistema de pedidos para restaurantes com foco em acessibilidade
 */

// ===== ESTADO GLOBAL =====
const state = {
    modoAcessivel: false,
    telaAtual: 'inicial',
    dados: null,
    categoriaAtual: 0,
    produtoAtual: 0,
    carrinho: [],
    pedidoFinal: null,
    
    // Modo acessível
    posicaoNavegacao: 0,
    tempoClick: 0,
    clickAtivo: false,
};

// ===== ELEMENTS DOM =====
const elements = {
    app: document.getElementById('app'),
    telaInicial: document.getElementById('telaInicial'),
    telaNavegacao: document.getElementById('telaNavegacao'),
    menuCategorias: document.getElementById('menuCategorias'),
    menuProdutos: document.getElementById('menuProdutos'),
    menuCarrinho: document.getElementById('menuCarrinho'),
    menuRevisao: document.getElementById('menuRevisao'),
    menuFinalizado: document.getElementById('menuFinalizado'),
    btnIniciar: document.getElementById('btnIniciar'),
    btnAcessivel: document.getElementById('btnAcessivel'),
    btnVoltar: document.getElementById('btnVoltar'),
    btnBotaoUnico: document.getElementById('btnBotaoUnico'),
    carrinhoFlutante: document.getElementById('carrinhoFlutante'),
    contadorCarrinho: document.getElementById('contadorCarrinho'),
    botaoModoAcessivel: document.getElementById('botaoModoAcessivel'),
    indicadorVisual: document.querySelector('.indicador-visual-acessivel'),
    indicadorAcao: document.getElementById('indicadorAcao'),
    listaCategorias: document.getElementById('listaCategorias'),
    listaProdutos: document.getElementById('listaProdutos'),
    listaCarrinho: document.getElementById('listaCarrinho'),
    listaRevisao: document.getElementById('listaRevisao'),
    tituloCategoriaAtual: document.getElementById('tituloCategoriaAtual'),
    numeroPedido: document.getElementById('numeroPedido'),
    btnFinalizarCarrinho: document.getElementById('btnFinalizarCarrinho'),
    btnConfirmarPedido: document.getElementById('btnConfirmarPedido'),
    btnNovoCarrinho: document.getElementById('btnNovoCarrinho'),
};

// ===== WEB SPEECH API =====
const synth = window.speechSynthesis;

function falar(texto) {
    // Cancelar áudio anterior se estiver tocando
    if (synth.speaking) {
        synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    synth.speak(utterance);
}

function pararAudio() {
    synth.cancel();
}

// ===== CARREGAMENTO DE DADOS =====
async function carregarDados() {
    try {
        const response = await fetch('produtos.json');
        const dados = await response.json();
        state.dados = dados;
        return dados;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        state.dados = { categorias: [] };
    }
}

// ===== INICIALIZAÇÃO =====
async function inicializar() {
    await carregarDados();
    
    // Event Listeners - Tela Inicial
    elements.btnIniciar.addEventListener('click', iniciarModoNormal);
    elements.btnAcessivel.addEventListener('click', iniciarModoAcessivel);
    
    // Event Listeners - Navegação Normal
    elements.btnVoltar.addEventListener('click', voltarTelaAnterior);
    elements.carrinhoFlutante.addEventListener('click', irParaCarrinho);
    elements.btnFinalizarCarrinho.addEventListener('click', irParaRevisao);
    elements.btnConfirmarPedido.addEventListener('click', finalizarPedido);
    elements.btnNovoCarrinho.addEventListener('click', voltarParaInicial);
    
    // Event Listeners - Botão Único (Modo Acessível)
    elements.btnBotaoUnico.addEventListener('mousedown', iniciarClick);
    elements.btnBotaoUnico.addEventListener('mouseup', finalizarClick);
    elements.btnBotaoUnico.addEventListener('mouseleave', finalizarClick);
    
    // Touch Events para mobile
    elements.btnBotaoUnico.addEventListener('touchstart', iniciarClick);
    elements.btnBotaoUnico.addEventListener('touchend', finalizarClick);
    
    // Reproduzir som de boas-vindas
    setTimeout(() => {
        falar('Bem-vindo ao totem de autoatendimento');
    }, 500);
}

// ===== MODO NORMAL =====
function iniciarModoNormal() {
    state.modoAcessivel = false;
    state.telaAtual = 'categorias';
    state.carrinho = [];
    state.categoriaAtual = 0;
    state.produtoAtual = 0;
    state.posicaoNavegacao = 0;
    
    document.body.classList.remove('modo-acessivel');
    
    mostrarTelaNavegacao();
    ocultarMenus();
    elements.menuCategorias.classList.remove('hidden');
    elements.carrinhoFlutante.classList.add('hidden');
    elements.botaoModoAcessivel.classList.add('hidden');
    
    mostrarMenuCategorias();
    atualizarCarrinho();
    
    falar('Iniciando modo normal. Selecione uma categoria');
}

function mostrarMenuCategorias() {
    elements.listaCategorias.innerHTML = '';
    const categorias = state.dados.categorias;
    
    categorias.forEach((categoria, index) => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6';
        
        const card = document.createElement('div');
        card.className = 'card card-categoria h-100';
        card.innerHTML = `
            <div class="card-body">
                <div class="card-categoria-icone">${categoria.icone}</div>
                <div class="card-categoria-nome">${categoria.nome}</div>
                <div class="card-categoria-info">${categoria.itens.length} itens</div>
            </div>
        `;
        
        card.addEventListener('click', () => selecionarCategoria(index));
        col.appendChild(card);
        elements.listaCategorias.appendChild(col);
    });
}

function selecionarCategoria(index) {
    state.categoriaAtual = index;
    state.produtoAtual = 0;
    state.telaAtual = 'produtos';
    
    ocultarMenus();
    elements.menuProdutos.classList.remove('hidden');
    mostrarMenuProdutos();
    
    const categoria = state.dados.categorias[index];
    falar(`Categoria ${categoria.nome} selecionada. Escolha um produto`);
}

function mostrarMenuProdutos() {
    const categoria = state.dados.categorias[state.categoriaAtual];
    elements.listaProdutos.innerHTML = '';
    elements.tituloCategoriaAtual.textContent = categoria.nome;
    
    categoria.itens.forEach((produto, index) => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6';
        
        const card = document.createElement('div');
        card.className = 'card card-produto h-100';
        card.innerHTML = `
            <div class="card-body">
                <div class="card-produto-nome">${produto.nome}</div>
                <div class="card-produto-descricao">${produto.descricao}</div>
                <div class="card-produto-preco">R$ ${produto.preco.toFixed(2)}</div>
                <button class="btn btn-success w-100 mt-3 btn-add-carrinho">
                    <i class="bi bi-plus-lg"></i> Adicionar
                </button>
            </div>
        `;
        
        const btn = card.querySelector('.btn-add-carrinho');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            adicionarAoCarrinho(index);
        });
        
        col.appendChild(card);
        elements.listaProdutos.appendChild(col);
    });
}

function adicionarAoCarrinho(indexProduto) {
    const categoria = state.dados.categorias[state.categoriaAtual];
    const produto = categoria.itens[indexProduto];
    
    const itemExistente = state.carrinho.find(item => 
        item.nome === produto.nome && item.categoria === state.categoriaAtual
    );
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        state.carrinho.push({
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1,
            categoria: state.categoriaAtual
        });
    }
    
    atualizarCarrinho();
    falar(`${produto.nome} adicionado ao carrinho`);
}

function atualizarCarrinho() {
    const quantidade = state.carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    elements.contadorCarrinho.textContent = quantidade;
    
    if (quantidade > 0) {
        elements.carrinhoFlutante.classList.remove('hidden');
    } else {
        elements.carrinhoFlutante.classList.add('hidden');
    }
}

function irParaCarrinho() {
    state.telaAtual = 'carrinho';
    ocultarMenus();
    elements.menuCarrinho.classList.remove('hidden');
    mostrarMenuCarrinho();
    falar('Abrindo carrinho de compras');
}

function mostrarMenuCarrinho() {
    elements.listaCarrinho.innerHTML = '';
    
    if (state.carrinho.length === 0) {
        elements.listaCarrinho.innerHTML = '<div class="col-12"><p class="text-muted text-center fs-5">Carrinho vazio</p></div>';
        elements.btnFinalizarCarrinho.disabled = true;
        return;
    }
    
    elements.btnFinalizarCarrinho.disabled = false;
    
    state.carrinho.forEach((item, index) => {
        const col = document.createElement('div');
        col.className = 'col-lg-6 col-md-8';
        
        const total = (item.preco * item.quantidade).toFixed(2);
        const card = document.createElement('div');
        card.className = 'item-carrinho-card';
        card.innerHTML = `
            <div class="item-carrinho-nome">${item.nome}</div>
            <div class="item-carrinho-info">
                <span class="item-carrinho-quantidade">Quantidade: ${item.quantidade}</span>
                <span class="item-carrinho-valor">R$ ${total}</span>
            </div>
            <div class="item-carrinho-acoes d-flex gap-2 justify-content-end">
                <button class="btn btn-sm btn-outline-secondary btn-qtd-menos" data-index="${index}">−</button>
                <button class="btn btn-sm btn-outline-secondary btn-qtd-mais" data-index="${index}">+</button>
                <button class="btn btn-sm btn-danger btn-remover" data-index="${index}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        
        card.querySelector('.btn-remover').addEventListener('click', () => removerDoCarrinho(index));
        card.querySelector('.btn-qtd-menos').addEventListener('click', () => alterarQuantidade(index, -1));
        card.querySelector('.btn-qtd-mais').addEventListener('click', () => alterarQuantidade(index, 1));
        
        col.appendChild(card);
        elements.listaCarrinho.appendChild(col);
    });
    
    atualizarTotalCarrinho();
}

function alterarQuantidade(index, delta) {
    const item = state.carrinho[index];
    item.quantidade += delta;
    
    if (item.quantidade <= 0) {
        removerDoCarrinho(index);
    } else {
        atualizarCarrinho();
        mostrarMenuCarrinho();
    }
}

function removerDoCarrinho(index) {
    const item = state.carrinho[index];
    falar(`${item.nome} removido do carrinho`);
    state.carrinho.splice(index, 1);
    atualizarCarrinho();
    mostrarMenuCarrinho();
}

function atualizarTotalCarrinho() {
    const total = state.carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    document.getElementById('totalCarrinho').textContent = total.toFixed(2);
}

function voltarTelaAnterior() {
    if (state.telaAtual === 'categorias') {
        voltarParaInicial();
    } else if (state.telaAtual === 'produtos') {
        state.telaAtual = 'categorias';
        ocultarMenus();
        elements.menuCategorias.classList.remove('hidden');
        mostrarMenuCategorias();
        falar('Voltando para categorias');
    } else if (state.telaAtual === 'carrinho') {
        state.telaAtual = 'produtos';
        ocultarMenus();
        elements.menuProdutos.classList.remove('hidden');
        mostrarMenuProdutos();
        falar('Voltando para produtos');
    } else if (state.telaAtual === 'revisao') {
        state.telaAtual = 'carrinho';
        ocultarMenus();
        elements.menuCarrinho.classList.remove('hidden');
        mostrarMenuCarrinho();
        falar('Voltando para carrinho');
    }
}

function irParaRevisao() {
    state.telaAtual = 'revisao';
    ocultarMenus();
    elements.menuRevisao.classList.remove('hidden');
    mostrarMenuRevisao();
    falar('Revisando seu pedido');
}

function mostrarMenuRevisao() {
    elements.listaRevisao.innerHTML = '';
    
    state.carrinho.forEach((item) => {
        const col = document.createElement('div');
        col.className = 'col-lg-6 col-md-8';
        
        const total = (item.preco * item.quantidade).toFixed(2);
        const card = document.createElement('div');
        card.className = 'item-carrinho-card';
        card.innerHTML = `
            <div class="item-carrinho-nome">${item.nome}</div>
            <div class="item-carrinho-info">
                <span class="item-carrinho-quantidade">Quantidade: ${item.quantidade}</span>
                <span class="item-carrinho-valor">R$ ${total}</span>
            </div>
        `;
        
        col.appendChild(card);
        elements.listaRevisao.appendChild(col);
    });
    
    const total = state.carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    document.getElementById('totalRevisao').textContent = total.toFixed(2);
}

function finalizarPedido() {
    const numeroPedido = Math.floor(Math.random() * 10000);
    state.pedidoFinal = {
        numero: numeroPedido,
        carrinho: [...state.carrinho],
        total: state.carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0)
    };
    
    elements.numeroPedido.textContent = `Pedido #${String(numeroPedido).padStart(4, '0')}`;
    
    state.telaAtual = 'finalizado';
    ocultarMenus();
    elements.menuFinalizado.classList.remove('hidden');
    
    const total = state.pedidoFinal.total.toFixed(2);
    falar(`Pedido número ${numeroPedido} finalizado com sucesso. Total: R$ ${total}. Obrigado por sua compra!`);
}

function voltarParaInicial() {
    state.telaAtual = 'inicial';
    state.carrinho = [];
    pararAudio();
    
    document.body.classList.remove('modo-acessivel');
    mostrarTelaInicial();
    
    setTimeout(() => {
        falar('Bem-vindo ao totem de autoatendimento');
    }, 500);
}

// ===== NAVEGAÇÃO DE TELAS =====
function mostrarTelaInicial() {
    elements.telaInicial.classList.remove('hidden');
    elements.telaNavegacao.classList.add('hidden');
}

function mostrarTelaNavegacao() {
    elements.telaInicial.classList.add('hidden');
    elements.telaNavegacao.classList.remove('hidden');
}

function ocultarMenus() {
    elements.menuCategorias.classList.add('hidden');
    elements.menuProdutos.classList.add('hidden');
    elements.menuCarrinho.classList.add('hidden');
    elements.menuRevisao.classList.add('hidden');
    elements.menuFinalizado.classList.add('hidden');
}

// ===== MODO ACESSÍVEL =====
function iniciarModoAcessivel() {
    state.modoAcessivel = true;
    state.telaAtual = 'categorias';
    state.carrinho = [];
    state.categoriaAtual = 0;
    state.produtoAtual = 0;
    state.posicaoNavegacao = 0;
    
    document.body.classList.add('modo-acessivel');
    
    elements.carrinhoFlutante.classList.add('hidden');
    elements.botaoModoAcessivel.classList.remove('hidden');
    
    mostrarTelaNavegacao();
    ocultarMenus();
    elements.menuCategorias.classList.remove('hidden');
    
    // Esconder navbar
    document.querySelector('.navbar').style.display = 'none';
    document.querySelector('.flex-grow-1').classList.add('d-flex', 'flex-column');
    
    falar('Bem-vindo ao modo acessível. Utilize o botão de navegação para percorrer as opções.');
    atualizarIndicadorModoAcessivel();
}

function atualizarIndicadorModoAcessivel() {
    if (state.telaAtual === 'categorias') {
        const categorias = state.dados.categorias;
        const categoria = categorias[state.categoriaAtual];
        
        let texto = `Categoria: ${categoria.nome}. ${categoria.itens.length} itens disponíveis.`;
        atualizarIndicadorVisual(texto);
        
        // Atualizar seleção visual
        const cards = document.querySelectorAll('#listaCategorias .card-categoria');
        cards.forEach((card, index) => {
            if (index === state.categoriaAtual) {
                card.classList.add('selecionada');
            } else {
                card.classList.remove('selecionada');
            }
        });
    }
    else if (state.telaAtual === 'produtos') {
        const categoria = state.dados.categorias[state.categoriaAtual];
        const produto = categoria.itens[state.produtoAtual];
        
        let texto = `Produto: ${produto.nome}. Preço: R$ ${produto.preco.toFixed(2)}. ${produto.descricao}`;
        atualizarIndicadorVisual(texto);
        
        const cards = document.querySelectorAll('#listaProdutos .card-produto');
        cards.forEach((card, index) => {
            if (index === state.produtoAtual) {
                card.classList.add('selecionada');
            } else {
                card.classList.remove('selecionada');
            }
        });
    }
    else if (state.telaAtual === 'carrinho') {
        if (state.carrinho.length === 0) {
            atualizarIndicadorVisual('Carrinho vazio');
        } else {
            const item = state.carrinho[state.posicaoNavegacao];
            const total = (item.preco * item.quantidade).toFixed(2);
            const texto = `Item ${state.posicaoNavegacao + 1} de ${state.carrinho.length}. ${item.nome}. Quantidade: ${item.quantidade}. R$ ${total}`;
            atualizarIndicadorVisual(texto);
        }
    }
    else if (state.telaAtual === 'revisao') {
        const total = state.carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        atualizarIndicadorVisual(`Resumo do pedido. ${state.carrinho.length} itens. Total: R$ ${total.toFixed(2)}`);
    }
    else if (state.telaAtual === 'finalizado') {
        atualizarIndicadorVisual(`Pedido finalizado. Número: ${state.pedidoFinal.numero}`);
    }
}

function atualizarIndicadorVisual(texto) {
    const conteudo = document.getElementById('conteudoIndicador');
    conteudo.innerHTML = `<span>${texto}</span>`;
}

// ===== AÇÕES DO BOTÃO ÚNICO =====
let timeoutLongo = null;
const TEMPO_CLICK_LONGO = 800; // ms

function iniciarClick() {
    state.clickAtivo = true;
    state.tempoClick = Date.now();
    
    timeoutLongo = setTimeout(() => {
        if (state.clickAtivo) {
            executarClickLongo();
        }
    }, TEMPO_CLICK_LONGO);
}

function finalizarClick() {
    state.clickAtivo = false;
    clearTimeout(timeoutLongo);
    
    const duracao = Date.now() - state.tempoClick;
    
    if (duracao < TEMPO_CLICK_LONGO) {
        // Click curto
        executarClickCurto();
        animarIndicador('click-curto');
    }
}

function executarClickCurto() {
    if (state.telaAtual === 'categorias') {
        const categorias = state.dados.categorias;
        state.categoriaAtual = (state.categoriaAtual + 1) % categorias.length;
    }
    else if (state.telaAtual === 'produtos') {
        const categoria = state.dados.categorias[state.categoriaAtual];
        state.produtoAtual = (state.produtoAtual + 1) % categoria.itens.length;
    }
    else if (state.telaAtual === 'carrinho') {
        if (state.carrinho.length > 0) {
            state.posicaoNavegacao = (state.posicaoNavegacao + 1) % state.carrinho.length;
        }
    }
    
    atualizarIndicadorModoAcessivel();
}

function executarClickLongo() {
    animarIndicador('click-longo');
    
    if (state.telaAtual === 'categorias') {
        const categoria = state.dados.categorias[state.categoriaAtual];
        falar(`Categoria ${categoria.nome} selecionada.`);
        
        state.telaAtual = 'produtos';
        state.produtoAtual = 0;
        state.posicaoNavegacao = 0;
        
        ocultarMenus();
        elements.menuProdutos.classList.remove('hidden');
        mostrarMenuProdutosModoAcessivel();
        atualizarIndicadorModoAcessivel();
        
        falar(`Navegando pelos produtos da categoria ${categoria.nome}`);
    }
    else if (state.telaAtual === 'produtos') {
        const categoria = state.dados.categorias[state.categoriaAtual];
        const produto = categoria.itens[state.produtoAtual];
        
        falar(`${produto.nome} adicionado ao carrinho.`);
        adicionarAoCarrinho(state.produtoAtual);
    }
    else if (state.telaAtual === 'carrinho') {
        if (state.carrinho.length > 0) {
            const item = state.carrinho[state.posicaoNavegacao];
            falar(`${item.nome} removido do carrinho.`);
            state.carrinho.splice(state.posicaoNavegacao, 1);
            
            if (state.carrinho.length > 0) {
                state.posicaoNavegacao = state.posicaoNavegacao % state.carrinho.length;
            }
            atualizarCarrinho();
            atualizarIndicadorModoAcessivel();
        }
    }
    else if (state.telaAtual === 'revisao') {
        finalizarPedido();
    }
}

function executarDuploClique() {
    animarIndicador('duplo-clique');
    
    if (state.telaAtual === 'produtos') {
        state.telaAtual = 'categorias';
        state.categoriaAtual = 0;
        state.produtoAtual = 0;
        ocultarMenus();
        elements.menuCategorias.classList.remove('hidden');
        mostrarMenuCategorias();
        falar('Voltando para categorias');
    }
    else if (state.telaAtual === 'carrinho') {
        state.telaAtual = 'produtos';
        state.produtoAtual = 0;
        ocultarMenus();
        elements.menuProdutos.classList.remove('hidden');
        mostrarMenuProdutosModoAcessivel();
        falar('Voltando para produtos');
    }
    else if (state.telaAtual === 'revisao') {
        state.telaAtual = 'carrinho';
        state.posicaoNavegacao = 0;
        ocultarMenus();
        elements.menuCarrinho.classList.remove('hidden');
        mostrarMenuCarrinhoModoAcessivel();
        falar('Voltando para carrinho');
    }
    
    atualizarIndicadorModoAcessivel();
}

// Detectar duplo clique
let ultimoClick = 0;
let nCliques = 0;

elements.btnBotaoUnico.addEventListener('click', () => {
    const agora = Date.now();
    if (agora - ultimoClick < 300) {
        nCliques++;
        if (nCliques === 2) {
            executarDuploClique();
            nCliques = 0;
        }
    } else {
        nCliques = 1;
    }
    ultimoClick = agora;
});

function animarIndicador(tipo) {
    elements.indicadorAcao.classList.remove('click-curto', 'click-longo', 'duplo-clique');
    // Forçar reflow
    void elements.indicadorAcao.offsetWidth;
    elements.indicadorAcao.classList.add(tipo);
}

// ===== MODO ACESSÍVEL - MENUS CUSTOMIZADOS =====
function mostrarMenuProdutosModoAcessivel() {
    const categoria = state.dados.categorias[state.categoriaAtual];
    elements.listaProdutos.innerHTML = '';
    elements.tituloCategoriaAtual.textContent = categoria.nome;
    
    categoria.itens.forEach((produto, index) => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6';
        
        const card = document.createElement('div');
        card.className = 'card card-produto h-100';
        card.innerHTML = `
            <div class="card-body">
                <div class="card-produto-nome">${produto.nome}</div>
                <div class="card-produto-descricao">${produto.descricao}</div>
                <div class="card-produto-preco">R$ ${produto.preco.toFixed(2)}</div>
            </div>
        `;
        
        col.appendChild(card);
        elements.listaProdutos.appendChild(col);
    });
    
    atualizarIndicadorModoAcessivel();
}

function mostrarMenuCarrinhoModoAcessivel() {
    ocultarMenus();
    elements.menuCarrinho.classList.remove('hidden');
    
    state.telaAtual = 'carrinho';
    state.posicaoNavegacao = 0;
    
    mostrarMenuCarrinho();
    atualizarIndicadorModoAcessivel();
    
    if (state.carrinho.length > 0) {
        falar('Carrinho aberto. Seus itens');
    } else {
        falar('Carrinho vazio');
    }
}

// ===== INICIALIZAR APLICAÇÃO =====
document.addEventListener('DOMContentLoaded', inicializar);
