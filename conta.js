// Load user immediately when script loads
var userData = localStorage.getItem('florAfetoUser');
var currentUser = userData ? JSON.parse(userData) : null;
window.currentUser = currentUser;

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initForms();
    initUserMenu();
    updateUserUI();
});

function isLoggedIn() {
    // Always check localStorage directly
    var data = localStorage.getItem('florAfetoUser');
    return data !== null && data !== 'null';
}

function loadUser() {
    var userData = localStorage.getItem('florAfetoUser');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

function saveUser(user) {
    currentUser = user;
    localStorage.setItem('florAfetoUser', JSON.stringify(user));
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });
}

function initForms() {
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCadastro();
        });
    }
    
    const editForm = document.getElementById('dadosForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleEditProfile();
        });
    }
    
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.addEventListener('click', showEditForm);
    }
    
    initSidebarNav();
}

function handleLogin() {
    alert('handleLogin started');
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;
    alert('email: ' + email + ' senha: ' + senha.length);
    
    if (!email || !senha) {
        alert('Preencha todos os campos');
        return false;
    }
    
    if (senha.length < 6) {
        alert('Senha deve ter pelo menos 6 caracteres');
        return false;
    }
    
    // Simple login - just save user directly
    var user = {
        nome: email.split('@')[0],
        email: email,
        senha: senha,
        pedidos: [],
        endereco: {}
    };
    
    alert('user created: ' + user.nome);
    
    // Save to localStorage
    currentUser = user;
    localStorage.setItem('florAfetoUser', JSON.stringify(user));
    
    // Redirect with user data in URL
    var userStr = JSON.stringify(user);
    var encoded = encodeURIComponent(userStr);
    alert('redirecting to minha-conta.html?user=' + encoded.substring(0, 30));
    window.location.href = 'minha-conta.html?user=' + encoded;
    
    return false;
}
    }, 1000);
}

function handleCadastro() {
    const nome = document.getElementById('cadNome').value.trim();
    const email = document.getElementById('cadEmail').value.trim();
    const telefone = document.getElementById('cadTelefone').value.trim();
    const senha = document.getElementById('cadSenha').value;
    const confirma = document.getElementById('cadConfirma').value;
    const termos = document.getElementById('termos')?.checked;
    
    if (!nome || !email || !telefone || !senha) {
        alert('Preencha todos os campos');
        return;
    }
    
    if (senha.length < 6) {
        alert('Senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    if (senha !== confirma) {
        alert('As senhas não coincidem');
        return;
    }
    
    if (!termos) {
        alert('Você precisa aceitar os termos de uso');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('florAfetoUsers')) || [];
    
    if (users.find(u => u.email === email)) {
        alert('Este e-mail já está cadastrado');
        return;
    }
    
    const user = {
        id: Date.now(),
        nome: nome,
        email: email,
        telefone: telefone,
        senha: senha,
        dataCadastro: new Date().toISOString(),
        enderecos: [],
        pedidos: []
    };
    
    users.push(user);
    localStorage.setItem('florAfetoUsers', JSON.stringify(users));
    saveUser(user);
    
    showToast('Conta criada com sucesso!', '');
    
    setTimeout(() => {
        window.location.href = 'minha-conta.html';
    }, 1000);
}

function handleEditProfile() {
    if (!isLoggedIn()) return;
    
    const nome = document.getElementById('editNome').value.trim();
    const telefone = document.getElementById('editTelefone').value.trim();
    
    if (!nome || !telefone) {
        alert('Preencha todos os campos');
        return;
    }
    
    currentUser.nome = nome;
    currentUser.telefone = telefone;
    
    updateUserInStorage(currentUser);
    saveUser(currentUser);
    updateUserUI();
    cancelEdit();
    
    showToast('Dados atualizados!', '');
}

function updateUserInStorage(user) {
    const users = JSON.parse(localStorage.getItem('florAfetoUsers')) || [];
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem('florAfetoUsers', JSON.stringify(users));
    }
}

function showEditForm() {
    if (!isLoggedIn()) return;
    
    document.getElementById('dadosInfo').style.display = 'none';
    document.getElementById('dadosForm').style.display = 'block';
    document.getElementById('editBtn').style.display = 'none';
    
    document.getElementById('editNome').value = currentUser.nome;
    document.getElementById('editTelefone').value = currentUser.telefone || '';
}

function cancelEdit() {
    document.getElementById('dadosInfo').style.display = 'grid';
    document.getElementById('dadosForm').style.display = 'none';
    document.getElementById('editBtn').style.display = 'inline-flex';
}

function logout() {
    currentUser = null;
    localStorage.removeItem('florAfetoUser');
    
    showToast('Você saiu da conta', '');
    
    setTimeout(() => {
        window.location.href = 'conta.html';
    }, 1000);
}

function toggleSenha(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('ph-eye');
        icon.classList.add('ph-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('ph-eye-slash');
        icon.classList.add('ph-eye');
    }
}

function updateUserUI() {
    var userData = localStorage.getItem('florAfetoUser');
    
    const userName = document.getElementById('userName');
    const userNameSidebar = document.getElementById('sidebarUserName');
    const userEmail = document.getElementById('sidebarUserEmail');
    const userAvatar = document.getElementById('userAvatar');
    const dadosVazios = document.getElementById('dadosVazios');
    const dadosInfo = document.getElementById('dadosInfo');
    const infoNome = document.getElementById('infoNome');
    const infoEmail = document.getElementById('infoEmail');
    const infoTelefone = document.getElementById('infoTelefone');
    const infoData = document.getElementById('infoData');
    const pedidosList = document.getElementById('pedidosList');
    const pedidosEmpty = document.getElementById('pedidosEmpty');
    const enderecoCompleto = document.getElementById('enderecoCompleto');
    const editBtn = document.getElementById('editBtn');
    
    if (isLoggedIn()) {
        if (userName) userName.textContent = currentUser.nome.split(' ')[0];
        if (userNameSidebar) userNameSidebar.textContent = `Olá, ${currentUser.nome.split(' ')[0]}`;
        if (userEmail) userEmail.textContent = currentUser.email;
        
        if (dadosVazios) dadosVazios.style.display = 'none';
        if (dadosInfo) dadosInfo.style.display = 'grid';
        if (editBtn) editBtn.style.display = 'inline-flex';
        
        if (infoNome) infoNome.textContent = currentUser.nome;
        if (infoEmail) infoEmail.textContent = currentUser.email;
        if (infoTelefone) infoTelefone.textContent = currentUser.telefone || 'Não cadastrado';
        if (infoData) {
            const data = new Date(currentUser.dataCadastro);
            infoData.textContent = data.toLocaleDateString('pt-BR');
        }
        
        if (currentUser.pedidos && currentUser.pedidos.length > 0) {
            console.log('Renderizando pedidos:', currentUser.pedidos.length);
            if (pedidosList) {
                pedidosList.style.display = 'flex';
                var html = '';
                currentUser.pedidos.forEach(function(pedido) {
                    html += createPedidoCard(pedido);
                });
                pedidosList.innerHTML = html;
            }
            if (pedidosEmpty) pedidosEmpty.style.display = 'none';
        } else {
            if (pedidosList) pedidosList.style.display = 'none';
            if (pedidosEmpty) pedidosEmpty.style.display = 'block';
        }
        
        if (currentUser.endereco) {
            if (enderecoCompleto) {
                enderecoCompleto.textContent = `${currentUser.endereco.rua}, ${currentUser.endereco.numero} - ${currentUser.endereco.bairro}, ${currentUser.endereco.cidade}/${currentUser.endereco.estado}`;
            }
        }
    } else {
        if (userName) userName.textContent = 'Entrar';
        if (userNameSidebar) userNameSidebar.textContent = 'Olá, Visitante';
        if (userEmail) userEmail.textContent = 'Faça login para ver seus dados';
        
        if (dadosVazios) dadosVazios.style.display = 'block';
        if (dadosInfo) dadosInfo.style.display = 'none';
        if (editBtn) editBtn.style.display = 'none';
    }
}

function createPedidoCard(pedido) {
    const statusClass = pedido.status || 'pendente';
    const statusText = {
        'pendente': 'Pendente',
        'pago': 'Pago',
        'enviado': 'Enviado',
        'entregue': 'Entregue',
        'cancelado': 'Cancelado'
    };
    
    const data = new Date(pedido.data);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    
    let produtosHTML = '';
    if (pedido.itens) {
        produtosHTML = pedido.itens.map(item => `
            <div class="pedido-produto">
                <span class="pedido-produto-nome">${item.nome}</span>
                <span class="pedido-produto-qtd">Qtd: ${item.quantidade}</span>
                <span class="pedido-produto-preco">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
            </div>
        `).join('');
    }
    
    return `
        <div class="pedido-card">
            <div class="pedido-header">
                <div>
                    <span class="pedido-numero">Pedido #${pedido.numero}</span>
                    <span class="pedido-data">${dataFormatada}</span>
                </div>
                <span class="pedido-status ${statusClass}">${statusText[statusClass]}</span>
            </div>
            <div class="pedido-body">
                <div class="pedido-produtos">
                    ${produtosHTML}
                </div>
                <div class="pedido-footer">
                    <div class="pedido-total">
                        Total: <strong>${pedido.total}</strong>
                    </div>
                    <div class="pedido-acoes">
                        <button class="btn-detalhes" onclick="abrirDetalhesPedido(${pedido.numero})">
                            <i class="ph ph-eye"></i> Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function abrirDetalhesPedido(pedidoNumero) {
    if (!isLoggedIn() || !currentUser || !currentUser.pedidos) {
        return;
    }
    
    var pedido = null;
    for (var i = 0; i < currentUser.pedidos.length; i++) {
        if (currentUser.pedidos[i].numero == pedidoNumero) {
            pedido = currentUser.pedidos[i];
            break;
        }
    }
    
    if (!pedido) {
        return;
    }
    
    const pedido = currentUser.pedidos.find(p => p.numero == pedidoNumero);
    if (!pedido) {
        return;
    }
    
    console.log('Pedido encontrado:', pedido);
    console.log('Endereço do pedido:', pedido.endereco);
    
    const data = new Date(pedido.data);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    document.getElementById('detalhesNumero').textContent = `#${pedido.numero}`;
    document.getElementById('detalhesData').textContent = dataFormatada;
    document.getElementById('detalhesHorario').textContent = horaFormatada;
    
    const metodoPagamento = {
        'cartao': 'Cartão de Crédito',
        'pix': 'PIX',
        'boleto': 'Boleto Bancário'
    };
    document.getElementById('detalhesPagamento').textContent = metodoPagamento[pedido.pagamento] || pedido.pagamento;
    
    const statusBadge = document.getElementById('detalhesStatus');
    statusBadge.textContent = {
        'pendente': 'Pendente',
        'pago': 'Pago',
        'enviado': 'Enviado',
        'entregue': 'Entregue',
        'cancelado': 'Cancelado'
    }[pedido.status] || 'Pendente';
    statusBadge.className = 'pedido-badge ' + (pedido.status || 'pendente');
    
    document.getElementById('detalhesObservacao').textContent = pedido.observacao || 'Nenhuma observação';
    
    // Formatar endereço
    let enderecoTexto = 'Endereço não informado';
    if (pedido.endereco && typeof pedido.endereco === 'object') {
        const end = pedido.endereco;
        const partes = [];
        if (end.rua) partes.push(end.rua);
        if (end.numero) partes.push(end.numero);
        if (end.complemento) partes.push(`(${end.complemento})`);
        if (end.bairro) partes.push(end.bairro);
        if (end.cidade) partes.push(end.cidade);
        if (end.estado) partes.push(end.estado);
        if (end.cep) partes.push(`CEP: ${end.cep}`);
        
        if (partes.length > 0) {
            enderecoTexto = partes.join(', ');
        }
    }
    
    console.log('Endereço formatado:', enderecoTexto);
    document.getElementById('enderecoCompletoModal').textContent = enderecoTexto;
    
    // Produtos
    let produtosHTML = '';
    if (pedido.itens && pedido.itens.length > 0) {
        pedido.itens.forEach(item => {
            produtosHTML += `
                <div class="detalhes-produto">
                    <div class="detalhes-produto-info">
                        <div class="detalhes-produto-nome">${item.nome}</div>
                        <div class="detalhes-produto-qtd">Quantidade: ${item.quantidade}</div>
                    </div>
                    <span class="detalhes-produto-preco">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                </div>
            `;
        });
    } else {
        produtosHTML = '<p style="color: #999; text-align: center;">Nenhum produto encontrado</p>';
    }
    document.getElementById('detalhesProdutos').innerHTML = produtosHTML;
    
    // Totais
    let subtotal = 0;
    if (pedido.itens && pedido.itens.length > 0) {
        subtotal = pedido.itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    }
    document.getElementById('detalhesSubtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('detalhesFrete').textContent = pedido.frete === 0 ? 'GRÁTIS' : `R$ ${pedido.frete.toFixed(2).replace('.', ',')}`;
    document.getElementById('detalhesTotal').textContent = pedido.total;
    
    document.getElementById('modalDetalhes').classList.add('show');
    document.body.style.overflow = 'hidden';
    
    console.log('=== FIM ABRIR DETALHES ===');
}

function fecharModal() {
    document.getElementById('modalDetalhes').classList.remove('show');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModal();
    }
});

document.getElementById('modalDetalhes').addEventListener('click', function(e) {
    if (e.target === this) {
        fecharModal();
    }
});

function initUserMenu() {
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });
    }
}

function initSidebarNav() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
    const sections = document.querySelectorAll('.conta-section');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            
            sidebarLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            link.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

function addPedidoToUser(pedido) {
    if (!isLoggedIn()) return false;
    
    currentUser.pedidos = currentUser.pedidos || [];
    currentUser.pedidos.unshift(pedido);
    
    updateUserInStorage(currentUser);
    saveUser(currentUser);
    
    return true;
}

function showToast(message) {
    alert(message);
}
