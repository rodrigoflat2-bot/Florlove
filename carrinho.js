let cupomDesconto = null;
let valorFrete = 0;
let estadoEntrega = null;

document.addEventListener('DOMContentLoaded', function() {
    renderCarrinho();
    renderRelacionados();
    initCupom();
    initFormatCep();
});

function renderCarrinho() {
    const cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    const container = document.getElementById('carrinhoItens');
    const vazio = document.getElementById('carrinhoVazio');
    const layout = document.getElementById('carrinhoContent');
    const subtitle = document.getElementById('cartSubtitle');
    const countHeader = document.getElementById('cartCountHeader');
    
    const totalItens = cart.reduce((sum, item) => sum + item.quantidade, 0);
    subtitle.textContent = `${totalItens} ${totalItens === 1 ? 'item' : 'itens'} no seu carrinho`;
    countHeader.textContent = totalItens;
    
    if (cart.length === 0) {
        vazio.classList.add('show');
        layout.style.display = 'none';
        return;
    }
    
    vazio.classList.remove('show');
    layout.style.display = 'grid';
    
    container.innerHTML = cart.map(item => {
        const produto = getProdutoById(item.id);
        if (!produto) return '';
        
        return `
            <div class="carrinho-item" data-id="${item.id}">
                <div class="carrinho-item-imagem">
                    <img src="${produto.imagem}" alt="${item.nome}">
                </div>
                <div class="carrinho-item-info">
                    <span class="carrinho-item-categoria">${produto.categoriaNome}</span>
                    <h3 class="carrinho-item-nome">${item.nome}</h3>
                    <span class="carrinho-item-preco">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="carrinho-item-acoes">
                    <button class="carrinho-item-remover" onclick="removerItem(${item.id})" title="Remover">
                        <i class="ph ph-trash"></i>
                    </button>
                    <div class="carrinho-item-quantidade">
                        <button class="quantidade-btn" onclick="alterarQuantidade(${item.id}, -1)" ${item.quantidade <= 1 ? 'disabled' : ''}>
                            <i class="ph ph-minus"></i>
                        </button>
                        <span class="quantidade-num">${item.quantidade}</span>
                        <button class="quantidade-btn" onclick="alterarQuantidade(${item.id}, 1)">
                            <i class="ph ph-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    atualizarResumo();
}

function alterarQuantidade(id, delta) {
    let cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    const item = cart.find(i => i.id === id);
    
    if (item) {
        item.quantidade += delta;
        
        if (item.quantidade <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        
        localStorage.setItem('florAfetoCart', JSON.stringify(cart));
        renderCarrinho();
        showToast('Carrinho atualizado!', '');
    }
}

function removerItem(id) {
    let cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    const item = cart.find(i => i.id === id);
    
    if (item) {
        cart = cart.filter(i => i.id !== id);
        localStorage.setItem('florAfetoCart', JSON.stringify(cart));
        renderCarrinho();
        showToast('Item removido!', item.nome);
    }
}

function atualizarResumo() {
    const cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    
    const subtotal = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const desconto = cupomDesconto ? subtotal * cupomDesconto : 0;
    const total = subtotal - desconto + valorFrete;
    
    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    
    document.getElementById('frete').textContent = 'Calculado no checkout';
    
    document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const descontoRow = document.getElementById('descontoRow');
    if (cupomDesconto) {
        descontoRow.style.display = 'flex';
        document.getElementById('desconto').textContent = `- R$ ${desconto.toFixed(2).replace('.', ',')}`;
    } else {
        descontoRow.style.display = 'none';
    }
}

function initCupom() {
    const input = document.getElementById('cupomInput');
    const btn = document.getElementById('aplicarCupom');
    const message = document.getElementById('cupomMessage');
    
    btn.addEventListener('click', () => {
        const codigo = input.value.trim().toUpperCase();
        
        if (!codigo) {
            message.textContent = 'Digite um código de cupom';
            message.className = 'cupom-message erro';
            return;
        }
        
        const cupons = {
            'DESCONTO10': 0.10,
            'PROMO15': 0.15,
            'PRIMEIRACOMPRA': 0.20,
            'FLOR10': 0.10,
            'SP10': 0.10
        };
        
        if (cupons[codigo]) {
            cupomDesconto = cupons[codigo];
            message.textContent = `Cupom aplicado! ${(cupomDesconto * 100).toFixed(0)}% de desconto`;
            message.className = 'cupom-message sucesso';
            localStorage.setItem('cupomDesconto', cupomDesconto);
            atualizarResumo();
        } else {
            cupomDesconto = null;
            localStorage.removeItem('cupomDesconto');
            message.textContent = 'Cupom inválido';
            message.className = 'cupom-message erro';
            atualizarResumo();
        }
    });
}

function initFormatCep() {
    const input = document.getElementById('cepInput');
    
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }
        e.target.value = value;
    });
}

function calcularFrete() {
    const cep = document.getElementById('cepInput').value.replace(/\D/g, '');
    const spWarning = document.getElementById('spWarning');
    
    if (cep.length !== 8) {
        showToast('CEP inválido', 'Digite um CEP com 8 dígitos');
        return;
    }
    
    const opcoes = document.getElementById('freteOpcoes');
    opcoes.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-light);"><i class="ph ph-circle-notch" style="animation: spin 1s linear infinite;"></i> Buscando informações...</p>';
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                opcoes.innerHTML = '<p style="padding: 20px; text-align: center; color: #e74c3c;">CEP não encontrado. Verifique e tente novamente.</p>';
                return;
            }
            
            estadoEntrega = data.uf;
            
            if (estadoEntrega === 'SP') {
                spWarning.style.display = 'none';
                
                opcoes.innerHTML = `
                    <div class="frete-opcao selected" onclick="selecionarFrete(0, 'Sedex', 3, this)">
                        <div class="frete-opcao-info">
                            <i class="ph ph-star"></i>
                            <div>
                                <div class="frete-opcao-tipo">Sedex Expressa</div>
                                <div class="frete-opcao-prazo">Chega em até 3 dias úteis</div>
                            </div>
                        </div>
                        <span class="frete-opcao-valor"><span>R$ 29,90</span> GRÁTIS</span>
                    </div>
                    <div class="frete-opcao" onclick="selecionarFrete(0, 'PAC', 7, this)">
                        <div class="frete-opcao-info">
                            <i class="ph ph-package"></i>
                            <div>
                                <div class="frete-opcao-tipo">PAC Standard</div>
                                <div class="frete-opcao-prazo">Chega em até 7 dias úteis</div>
                            </div>
                        </div>
                        <span class="frete-opcao-valor"><span>R$ 19,90</span> GRÁTIS</span>
                    </div>
                    <div class="frete-opcao" onclick="selecionarFrete(0, 'Entrega Expressa', 1, this)">
                        <div class="frete-opcao-info">
                            <i class="ph ph-lightning"></i>
                            <div>
                                <div class="frete-opcao-tipo">Entrega Expressa</div>
                                <div class="frete-opcao-prazo">Chega em até 1 dia útil</div>
                            </div>
                        </div>
                        <span class="frete-opcao-valor"><span>R$ 49,90</span> GRÁTIS</span>
                    </div>
                    <div class="frete-sp-gratis">
                        <i class="ph ph-gift"></i>
                        <span>Parabéns! Você está em São Paulo e ganhou <strong>frete grátis</strong>!</span>
                    </div>
                `;
                
                valorFrete = 0;
                atualizarResumo();
                showToast('Frete grátis!', 'Você está em SP e ganha frete grátis!');
            } else {
                spWarning.style.display = 'flex';
                spWarning.innerHTML = `<i class="ph ph-warning-circle"></i> <span>No momento, entregamos apenas no estado de São Paulo. Seu CEP é de ${data.localidade}/${estadoEntrega}.</span>`;
                
                opcoes.innerHTML = `
                    <div class="frete-opcao disabled" style="opacity: 0.5; cursor: not-allowed;">
                        <div class="frete-opcao-info">
                            <i class="ph ph-x-circle"></i>
                            <div>
                                <div class="frete-opcao-tipo">Fora da área de entrega</div>
                                <div class="frete-opcao-prazo">No momento, não entregamos na sua região</div>
                            </div>
                        </div>
                        <span class="frete-opcao-valor" style="color: #e74c3c;">Indisponível</span>
                    </div>
                `;
                
                valorFrete = 0;
                estadoEntrega = null;
                atualizarResumo();
            }
        })
        .catch(error => {
            opcoes.innerHTML = '<p style="padding: 20px; text-align: center; color: #e74c3c;">Erro ao buscar CEP. Tente novamente.</p>';
            console.error('Erro ao buscar CEP:', error);
        });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .frete-sp-gratis {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 16px;
            background: linear-gradient(135deg, #00b894, #00a085);
            border-radius: var(--radius);
            color: white;
            font-size: 0.95rem;
            margin-top: 12px;
        }
        .frete-sp-gratis i {
            font-size: 1.5rem;
        }
        .frete-sp-gratis strong {
            font-weight: 700;
        }
    `;
    document.head.appendChild(style);
}

function selecionarFrete(valor, tipo, dias, element) {
    valorFrete = valor;
    
    document.querySelectorAll('.frete-opcao').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    
    atualizarResumo();
    showToast('Frete selecionado', `${tipo} - ${valor === 0 ? 'GRÁTIS' : 'R$ ' + valor.toFixed(2).replace('.', ',')}`);
}

function renderRelacionados() {
    const grid = document.getElementById('relacionadosGrid');
    const produtos = getProdutos().slice(0, 4);
    
    grid.innerHTML = produtos.map(produto => `
        <div class="relacionado-card">
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="relacionado-card-info">
                <h4>${produto.nome}</h4>
                <span class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                <button class="btn-comprar" onclick="addToCart(${produto.id}, '${produto.nome}', ${produto.preco})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(id, nome, preco) {
    let cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantidade++;
    } else {
        cart.push({ id, nome, preco, quantidade: 1 });
    }
    
    localStorage.setItem('florAfetoCart', JSON.stringify(cart));
    renderCarrinho();
    showToast('Adicionado!', nome);
}

function showToast(title, productName) {
    const toast = document.getElementById('toast');
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastProduct').textContent = productName;
    
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
