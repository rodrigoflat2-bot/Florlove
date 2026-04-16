document.addEventListener('DOMContentLoaded', function() {
    renderProdutos();
    initFiltros();
    updateCartCount();
});

let categoriaAtual = 'todos';
let ordemAtual = 'relevancia';

function filtrarCategoria(categoria, btn) {
    categoriaAtual = categoria;
    
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    renderProdutos(categoria, ordemAtual);
}

function renderProdutos(categoria = 'todos', ordem = 'relevancia') {
    const grid = document.getElementById('produtosGrid');
    let produtosFiltrados = getProdutosPorCategoria(categoria);
    
    switch (ordem) {
        case 'menor-preco':
            produtosFiltrados.sort((a, b) => a.preco - b.preco);
            break;
        case 'maior-preco':
            produtosFiltrados.sort((a, b) => b.preco - a.preco);
            break;
        case 'nome':
            produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
    }
    
    document.getElementById('resultadosCount').textContent = `${produtosFiltrados.length} produtos encontrados`;
    
    grid.innerHTML = produtosFiltrados.map(produto => `
        <article class="produto-card-full" data-id="${produto.id}" onclick="abrirProdutoModal(${produto.id})">
            ${produto.badge ? `<span class="produto-badge ${produto.badge === 'desconto' ? 'desconto' : ''}">${produto.badge === 'desconto' ? `-${Math.round((1 - produto.preco/produto.precoAntigo) * 100)}%` : produto.badge}</span>` : ''}
            <div class="produto-image">
                <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
            </div>
            <div class="produto-content">
                <span class="produto-categoria">${produto.categoriaNome}</span>
                <h3 class="produto-title">${produto.nome}</h3>
                <p class="produto-desc">${produto.descricao}</p>
                <div class="produto-footer">
                    <span class="produto-preco">
                        ${produto.precoAntigo ? `<span class="preco-antigo">R$ ${produto.precoAntigo.toFixed(2).replace('.', ',')}</span>` : ''}
                        R$ ${produto.preco.toFixed(2).replace('.', ',')}
                    </span>
                    <button class="btn-cart" onclick="event.stopPropagation(); addToCart(${produto.id}, '${produto.nome}', ${produto.preco})">
                        <i class="ph ph-shopping-bag"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

function initFiltros() {
    const ordemFilter = document.getElementById('ordemFilter');
    
    ordemFilter.addEventListener('change', () => {
        ordemAtual = ordemFilter.value;
        renderProdutos(categoriaAtual, ordemFilter.value);
    });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => {
        el.textContent = cart.reduce((sum, item) => sum + item.quantidade, 0);
        if (cart.length === 0) {
            el.style.display = 'none';
        } else {
            el.style.display = 'flex';
        }
    });
}

function addToCart(id, nome, preco) {
    let cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantidade++;
    } else {
        cart.push({
            id,
            nome,
            preco,
            quantidade: 1
        });
    }
    
    localStorage.setItem('florAfetoCart', JSON.stringify(cart));
    updateCartCount();
    showToast(nome);
}

function showToast(productName) {
    const toast = document.getElementById('toast');
    const toastProduct = document.getElementById('toastProduct');
    
    toastProduct.textContent = productName;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

let produtoAtual = null;

function abrirProdutoModal(produtoId) {
    const produto = getProdutoById(produtoId);
    if (!produto) return;
    
    produtoAtual = produto;
    
    document.getElementById('modalImagem').src = produto.imagem;
    document.getElementById('modalCategoria').textContent = produto.categoriaNome;
    document.getElementById('modalNome').textContent = produto.nome;
    document.getElementById('modalDescricao').textContent = produto.descricao;
    
    const precoAntigo = document.getElementById('modalPrecoAntigo');
    if (produto.precoAntigo) {
        precoAntigo.textContent = `R$ ${produto.precoAntigo.toFixed(2).replace('.', ',')}`;
        precoAntigo.style.display = 'inline';
    } else {
        precoAntigo.style.display = 'none';
    }
    
    document.getElementById('modalPreco').textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
    
    const itensList = document.getElementById('modalItens');
    if (produto.itens && produto.itens.length > 0) {
        itensList.innerHTML = produto.itens.map(item => `<li>${item}</li>`).join('');
    } else {
        itensList.innerHTML = '<li>Itens inclusos não informados</li>';
    }
    
    document.getElementById('modalAddCart').onclick = function() {
        addToCart(produto.id, produto.nome, produto.preco);
        fecharProdutoModal();
    };
    
    document.getElementById('produtoModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function fecharProdutoModal() {
    document.getElementById('produtoModal').classList.remove('show');
    document.body.style.overflow = '';
    produtoAtual = null;
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharProdutoModal();
    }
});
