let cupomDesconto = null;
let pagamentoPix = false;
let currentUser = null;
let valorFrete = 0;
const FRETE_MINIMO_GRATIS = 180;
const VALOR_FRETE = 24;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('checkoutForm')) {
        initPaymentOptions();
        loadResumo();
    }
});

function buscarCEP() {
    console.log('buscarCEP chamada');
    
    const cepEl = document.getElementById('cep');
    if (!cepEl) {
        console.log('CEP input not found');
        return;
    }
    
    const cep = cepEl.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        console.log('CEP inválido:', cep);
        return;
    }
    
    console.log('Buscando CEP:', cep);
    
    const loading = document.getElementById('cepLoading');
    const mensagem = document.getElementById('cepMensagem');
    
    if (loading) loading.style.display = 'block';
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(r => r.json())
        .then(data => {
            if (loading) loading.style.display = 'none';
            console.log('Resposta VIACEP:', data);
            
            if (!data.erro) {
                document.getElementById('endereco').value = data.logradouro || '';
                document.getElementById('bairro').value = data.bairro || '';
                document.getElementById('cidade').value = data.localidade || '';
                document.getElementById('estado').value = data.uf || 'SP';
                console.log('Endereço preenchido!');
            } else {
                console.log('CEP não encontrado');
            }
        })
        .catch(err => {
            if (loading) loading.style.display = 'none';
            console.error(err);
        });
}

// Make available globally - both names
window.buscarCep = buscarCEP;
window.buscarCEP = buscarCEP;
window.onload = function() {
    console.log('Page loaded, buscarCEP:', typeof buscarCEP);
};

// Scripts are loaded inline in HTML for checkout page



function checkLogin() {
    const userData = localStorage.getItem('florAfetoUser');
    console.log('=== CHECK LOGIN ===');
    console.log('userData:', userData);
    
    if (userData) {
        currentUser = JSON.parse(userData);
        console.log('currentUser carregado:', currentUser);
        console.log('Pedidos do usuario:', currentUser?.pedidos);
    } else {
        console.log('Nenhum usuario encontrado');
    }
    console.log('====================');
    
    const cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    
    if (cart.length > 0 && !currentUser) {
        const loginNotice = document.createElement('div');
        loginNotice.className = 'login-required-notice';
        loginNotice.innerHTML = `
            <i class="ph ph-warning-circle"></i>
            <div>
                <strong>Faça login para finalizar seu pedido</strong>
                <p>Seus itens estão salvos no carrinho. Entre ou cadastre-se para continuar.</p>
            </div>
            <a href="conta.html" class="btn btn-primary">Fazer Login</a>
        `;
        document.querySelector('.checkout-form-section').prepend(loginNotice);
        
        document.querySelector('.btn-finalizar').disabled = true;
        document.querySelector('.btn-finalizar').style.opacity = '0.5';
        document.querySelector('.btn-finalizar').style.cursor = 'not-allowed';
    } else if (currentUser) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-checkout-info';
        userInfo.innerHTML = `
            <i class="ph ph-user-circle"></i>
            <span>Pedido para: <strong>${currentUser.nome}</strong></span>
            <a href="minha-conta.html" class="link-minha-conta">Ver conta</a>
        `;
        document.querySelector('.checkout-form-section').prepend(userInfo);
    }
}

function isLoggedIn() {
    return currentUser !== null;
}

function saveUser(user) {
    currentUser = user;
    const jsonStr = JSON.stringify(user);
    localStorage.setItem('florAfetoUser', jsonStr);
    console.log('Usuario salvo no localStorage, tamanho:', jsonStr.length);
    
    // Verificar se foi salvo corretamente
    const verificado = localStorage.getItem('florAfetoUser');
    console.log('Verificacao:', verificado ? 'OK' : 'FALHOU');
}

function updateUserInStorage(user) {
    const users = JSON.parse(localStorage.getItem('florAfetoUsers')) || [];
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem('florAfetoUsers', JSON.stringify(users));
        console.log('Usuario atualizado na lista de usuarios');
    } else {
        console.log('Usuario nao encontrado na lista, adicionando...');
        users.push(user);
        localStorage.setItem('florAfetoUsers', JSON.stringify(users));
    }
}

function addPedidoToUser(pedido) {
    if (!isLoggedIn()) return false;
    
    console.log('Salvando pedido com endereço:', pedido.endereco);
    
    // Garantir que o endereço está correto
    const novoPedido = {
        numero: pedido.numero,
        data: pedido.data,
        itens: pedido.itens,
        total: pedido.total,
        subtotal: pedido.subtotal,
        status: pedido.status,
        pagamento: pedido.pagamento,
        observacao: pedido.observacao,
        horario: pedido.horario,
        dataEntrega: pedido.dataEntrega,
        endereco: {
            rua: pedido.endereco.rua || '',
            numero: pedido.endereco.numero || '',
            complemento: pedido.endereco.complemento || '',
            bairro: pedido.endereco.bairro || '',
            cidade: pedido.endereco.cidade || '',
            estado: pedido.endereco.estado || '',
            cep: pedido.endereco.cep || ''
        },
        frete: pedido.frete
    };
    
    currentUser.pedidos = currentUser.pedidos || [];
    currentUser.endereco = novoPedido.endereco;
    currentUser.pedidos.unshift(novoPedido);
    
    updateUserInStorage(currentUser);
    saveUser(currentUser);
    
    console.log('Pedido salvo:', novoPedido);
    
    return true;
}

function initCepInput() {
    const cepInput = document.getElementById('cep');
    
    if (!cepInput) return;
    
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        e.target.value = value;
        
        if (value.length === 9) {
            window.buscarCep();
        }
    });
}
    
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        e.target.value = value;
        
        console.log('CEP digitado:', value, 'length:', value.length);
        
        if (value.length === 9) {
            window.buscarCep();
        }
    });
}

function initFormatters() {
    const cpfInput = document.getElementById('cpf');
    const telInput = document.getElementById('telefone');
    const cartaoInput = document.getElementById('numeroCartao');
    const validadeInput = document.getElementById('validade');
    
    cpfInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 9) {
            value = value.slice(0, 9) + '-' + value.slice(9, 11);
        }
        if (value.length > 6) {
            value = value.slice(0, 6) + '.' + value.slice(6);
        }
        if (value.length > 3) {
            value = value.slice(0, 3) + '.' + value.slice(3);
        }
        e.target.value = value;
    });
    
    telInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 6) {
            value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
        } else if (value.length > 2) {
            value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
        }
        e.target.value = value;
    });
    
    cartaoInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        value = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = value;
    });
    
    validadeInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });
    
    const dataEntrega = document.getElementById('dataEntrega');
    if (dataEntrega) {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 60);
        dataEntrega.min = today.toISOString().split('T')[0];
        dataEntrega.max = maxDate.toISOString().split('T')[0];
    }
}

function initPaymentOptions() {
    const options = document.querySelectorAll('input[name="pagamento"]');
    const cartaoDetails = document.getElementById('cartaoDetails');
    const pixDetails = document.getElementById('pixDetails');
    const pixDescontoRow = document.getElementById('pixDescontoRow');
    
    options.forEach(option => {
        option.addEventListener('change', () => {
            cartaoDetails.style.display = 'none';
            pixDetails.style.display = 'none';
            
            document.querySelectorAll('.pagamento-opcao').forEach(op => {
                op.classList.remove('active');
            });
            option.closest('.pagamento-opcao').classList.add('active');
            
            if (option.value === 'pix') {
                pixDetails.style.display = 'block';
                pixDescontoRow.classList.add('show');
                pagamentoPix = true;
            } else {
                pixDescontoRow.classList.remove('show');
                pagamentoPix = false;
            }
            
            if (option.value === 'cartao') {
                cartaoDetails.style.display = 'block';
            }
            
            atualizarResumo();
        });
    });
    
    const parcelasSelect = document.getElementById('parcelas');
    parcelasSelect.addEventListener('change', () => {
        const qtd = parseInt(parcelasSelect.value);
        const cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        const valorParcela = (subtotal / qtd).toFixed(2);
        
        document.getElementById('parcelasInfo').textContent = 
            qtd === 1 ? 'à vista' : `em ${qtd}x de R$ ${valorParcela.replace('.', ',')}`;
    });
}

function loadResumo() {
    const cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    const container = document.getElementById('resumoItens');
    
    if (cart.length === 0) {
        window.location.href = 'carrinho.html';
        return;
    }
    
    document.getElementById('itensCount').textContent = `${cart.length} ${cart.length === 1 ? 'item' : 'itens'}`;
    
    container.innerHTML = cart.map(item => {
        const produto = getProdutoById(item.id);
        if (!produto) return '';
        
        return `
            <div class="resumo-item">
                <img src="${produto.imagem}" alt="${item.nome}">
                <div class="resumo-item-info">
                    <div class="resumo-item-nome">${item.nome}</div>
                    <div class="resumo-item-qtd">Qtd: ${item.quantidade}</div>
                </div>
                <span class="resumo-item-preco">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    }).join('');
    
    atualizarResumo();
}

function atualizarResumo() {
    const cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    const cupomDescontoValor = cupomDesconto ? subtotal * cupomDesconto : 0;
    const pixDescontoValor = pagamentoPix ? subtotal * 0.10 : 0;
    const descontoTotal = cupomDescontoValor + pixDescontoValor;
    
    // Calcula o frete
    if (subtotal >= FRETE_MINIMO_GRATIS) {
        valorFrete = 0;
    } else {
        valorFrete = VALOR_FRETE;
    }
    
    const total = subtotal - descontoTotal + valorFrete;
    
    document.getElementById('checkoutSubtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    
    const checkoutFrete = document.getElementById('checkoutFrete');
    if (valorFrete === 0) {
        checkoutFrete.innerHTML = '<span class="frete-antigo">R$ 29,90</span> GRÁTIS';
    } else {
        checkoutFrete.textContent = `R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
    }
    
    if (cupomDesconto > 0) {
        document.getElementById('descontoRow').style.display = 'flex';
        document.getElementById('checkoutDesconto').textContent = `- R$ ${cupomDescontoValor.toFixed(2).replace('.', ',')}`;
    } else {
        document.getElementById('descontoRow').style.display = 'none';
    }
    
    if (pixDescontoValor > 0) {
        document.getElementById('pixDescontoRow').classList.add('show');
        document.getElementById('pixDesconto').textContent = `- R$ ${pixDescontoValor.toFixed(2).replace('.', ',')}`;
    } else {
        document.getElementById('pixDescontoRow').classList.remove('show');
    }
    
    document.getElementById('checkoutTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('pedidoValor').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const qtd = parseInt(document.getElementById('parcelas').value);
    const valorParcela = (total / qtd).toFixed(2);
    document.getElementById('parcelasInfo').textContent = 
        qtd === 1 ? 'à vista' : `em até ${qtd}x de R$ ${valorParcela.replace('.', ',')}`;
}

function initFormSubmit() {
    // Form handler is now inline in HTML to avoid issues
    // This function just provides the validation
}
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }
        
        if (!isLoggedIn()) {
            alert('Você precisa estar logado para finalizar o pedido. Por favor, faça login ou cadastre-se.');
            window.location.href = 'conta.html';
            return;
        }
        
        const formaPagamento = document.querySelector('input[name="pagamento"]:checked').value;
        
        btnFinalizar.disabled = true;
        
        if (formaPagamento === 'cartao') {
            btnFinalizar.innerHTML = '<i class="ph ph-circle-notch" style="animation: spin 1s linear infinite;"></i> Analisando pagamento...';
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            btnFinalizar.disabled = false;
            btnFinalizar.innerHTML = '<span>Finalizar Pedido</span><i class="ph ph-check-circle"></i>';
            alert('Pagamento recusado. Por favor, tente novamente mais tarde ou escolha outra forma de pagamento.');
            return;
        } else {
            btnFinalizar.innerHTML = '<i class="ph ph-circle-notch" style="animation: spin 1s linear infinite;"></i> Processando...';
            await new Promise(resolve => setTimeout(resolve, 2500));
        }
        
        const cart = JSON.parse(localStorage.getItem('florAfetoCart')) || [];
        
        const pedidoNumero = Math.floor(10000 + Math.random() * 90000);
        
        const totalEl = document.getElementById('checkoutTotal');
        const total = totalEl ? totalEl.textContent : 'R$ 0,00';
        
        const pedido = {
            numero: pedidoNumero,
            data: new Date().toISOString(),
            itens: cart,
            total: total,
            subtotal: total,
            status: 'pendente',
            pagamento: formaPagamento,
            observacao: '',
            horario: '',
            dataEntrega: '',
            endereco: {},
            freight: 0
        };
        
        localStorage.setItem('ultimoPedido', JSON.stringify(pedido));
        localStorage.removeItem('florAfetoCart');
        localStorage.removeItem('cupomDesconto');
        
        if (document.getElementById('pedidoNumero')) {
            document.getElementById('pedidoNumero').textContent = '#' + pedidoNumero;
        }
        if (document.getElementById('pedidoValor')) {
            document.getElementById('pedidoValor').textContent = total;
        }
        
        mostrarInstrucoesPagamento(formaPagamento, total, pedidoNumero);
        
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        btnFinalizar.disabled = false;
        btnFinalizar.innerHTML = '<span>Finalizar Pedido</span><i class="ph ph-check-circle"></i>';
    });
    
    const style = document.createElement('style');
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .login-required-notice {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            background: linear-gradient(135deg, #fff3cd, #ffeeba);
            border: 1px solid #ffc107;
            border-radius: var(--radius);
            margin-bottom: 24px;
        }
        .login-required-notice i {
            font-size: 2rem;
            color: #856404;
        }
        .login-required-notice strong {
            display: block;
            color: #856404;
            margin-bottom: 4px;
        }
        .login-required-notice p {
            font-size: 0.9rem;
            color: #856404;
            margin: 0;
        }
        .login-required-notice .btn {
            margin-left: auto;
            white-space: nowrap;
        }
        .user-checkout-info {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            background: linear-gradient(135deg, #00b894, #00a085);
            border-radius: var(--radius);
            margin-bottom: 24px;
            color: white;
        }
        .user-checkout-info i {
            font-size: 1.5rem;
        }
        .user-checkout-info strong {
            font-weight: 700;
        }
        .link-minha-conta {
            margin-left: auto;
            color: white;
            text-decoration: underline;
            font-size: 0.9rem;
        }
        .link-minha-conta:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
}

function mostrarInstrucoesPagamento(metodo, valor, numeroPedido) {
    const container = document.getElementById('pagamentoInstrucoes');
    const content = document.getElementById('instrucoesContent');
    
    if (metodo === 'pix') {
        container.style.display = 'block';
        content.className = 'instrucoes-content pix';
        content.innerHTML = `
            <p>Para pagar via PIX, use o CNPJ abaixo:</p>
            <div class="cnpj-box">
                <label>CNPJ:</label>
                <div class="cnpj-numero">12.345.678/0001-90</div>
            </div>
            <button class="copy-btn" onclick="copiarCNPJ()">
                <i class="ph ph-copy"></i> Copiar CNPJ
            </button>
            <p style="font-size: 0.8rem; color: var(--text-light); margin-top: 10px;">
                Pedido: <strong>#${numeroPedido}</strong> | Valor: <strong>${valor}</strong>
            </p>
        `;
    } else {
        container.style.display = 'none';
    }
}

function copiarCNPJ() {
    const cnpj = '12.345.678/0001-90';
    navigator.clipboard.writeText(cnpj).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.innerHTML = '<i class="ph ph-check"></i> CNPJ Copiado!';
        btn.style.background = '#27ae60';
        setTimeout(() => {
            btn.innerHTML = '<i class="ph ph-copy"></i> Copiar CNPJ';
            btn.style.background = '';
        }, 2000);
    });
}

function validarFormulario() {
    const requiredFields = ['nome', 'cpf', 'email', 'telefone', 'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado'];
    let valido = true;
    let primeiroCampoInvalido = null;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            if (!primeiroCampoInvalido) primeiroCampoInvalido = field;
            valido = false;
        } else {
            field.style.borderColor = '#e8e8e8';
        }
    });
    
    const estado = document.getElementById('estado').value;
    if (estado !== 'SP') {
        alert('No momento, entregamos apenas no estado de São Paulo.');
        document.getElementById('estado').style.borderColor = '#e74c3c';
        valido = false;
    }
    
    const email = document.getElementById('email').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email').style.borderColor = '#e74c3c';
        if (!primeiroCampoInvalido) primeiroCampoInvalido = document.getElementById('email');
        valido = false;
    }
    
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    if (cpf.length !== 11) {
        document.getElementById('cpf').style.borderColor = '#e74c3c';
        if (!primeiroCampoInvalido) primeiroCampoInvalido = document.getElementById('cpf');
        valido = false;
    }
    
    const pagamento = document.querySelector('input[name="pagamento"]:checked').value;
    if (pagamento === 'cartao') {
        const numeroCartao = document.getElementById('numeroCartao').value.replace(/\D/g, '');
        if (numeroCartao.length !== 16) {
            document.getElementById('numeroCartao').style.borderColor = '#e74c3c';
            if (!primeiroCampoInvalido) primeiroCampoInvalido = document.getElementById('numeroCartao');
            valido = false;
        }
        
        const validade = document.getElementById('validade').value;
        if (!validade || validade.length < 5) {
            document.getElementById('validade').style.borderColor = '#e74c3c';
            valido = false;
        }
        
        const cvv = document.getElementById('cvv').value;
        if (!cvv || cvv.length < 3) {
            document.getElementById('cvv').style.borderColor = '#e74c3c';
            valido = false;
        }
    }
    
    if (!valido && primeiroCampoInvalido) {
        primeiroCampoInvalido.focus();
        primeiroCampoInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return valido;
}

function showToast(title, message) {
    alert(title + ': ' + message);
}
