const produtos = [
    {
        id: 1,
        nome: "Cesta Café 5 Estrelas",
        descricao: "Cesta completa com café gourmet, biscoitos premium, chocolates e muito mais. Perfeita para quem aprecia um café especial.",
        preco: 370.00,
        precoAntigo: null,
        categoria: "cestas",
        categoriaNome: "Cestas",
        imagem: "https://i.ibb.co/b5hc6ZSD/Bandeja-de-caf-5-estrelas.png",
        badge: "Mais vendido",
        itens: ["Geleia importada", "Queijinho importado", "Biscoitos importados", "3 tipos de frutas", "1 mini bolo", "1 croissant", "1 pão de queijo", "Torradas", "Presunto", "Salame", "Queijo", "Iogurte", "Cereais", "Suco", "Café cappuccino", "Chocolate liquido", "Tudo em louça", "Arranjo de flores do campo"]
    },
{
        id: 2,
        nome: "Cesta Café com Girassol e Mimos",
        descricao: "Cesta completa com café, frutas, sucos, chocolates e muito mais. O presente ideal para os amantes de café.",
        preco: 290.00,
        precoAntigo: null,
        categoria: "cestas",
        categoriaNome: "Cestas",
        imagem: "https://i.ibb.co/HfGWJpn7/Bandeja-de-cafe-com-girassol-e-mimos.png",
        badge: null,
        itens: ["3 tipos de frutas", "Suco", "Chocolate líquido", "Biscoitos caseiros", "Cereais", "1 mini bolo", "1 croissant", "1 pão de queijo", "Frios", "Iogurte grego", "Cappuccino", "Chá", "1 Pão de mel", "1 caneca", "Arranjo com 1 girassol"]
    },
    {
        id: 3,
        nome: "Cesta Café Diet",
        descricao: "Cesta especial sem açúcar para quem preza pela saúde. Todos os produtos diet.",
        preco: 270.00,
        precoAntigo: null,
        categoria: "cestas",
        categoriaNome: "Cestas",
        imagem: "https://i.ibb.co/jPGyVMgX/Cesta-de-cafe-diet-Flor-y-afeto.png",
        badge: null,
        itens: ["Cappuccino", "Geleia", "Torradas", "2 iogurte", "Cereal", "3 tipos de frutas", "Biscoitos", "1 caneca", "Arranjo com 1 rosa"]
    },
    {
        id: 4,
        nome: "Chá da Tarde",
        descricao: "Kit completo para um chá da tarde especial com biscoitos e quitutes saborosos.",
        preco: 190.00,
        precoAntigo: null,
        categoria: "cestas",
        categoriaNome: "Cestas",
        imagem: "https://i.ibb.co/v617Gqnw/Bandeja-Ch-da-tarde.png",
        badge: "Novo",
        itens: ["Arranjo de gérberas", "Biscoitos caseiros", "Torradas", "Dois tipos de chá", "Geleia", "Mel", "Uma xícara"]
    },
{
        id: 5,
        nome: "Box Love You",
        descricao: "Box romântico especial com rosas vermelhas. Perfeito para declarar amor.",
        preco: 299.90,
        precoAntigo: null,
        categoria: "romantico",
        categoriaNome: "Romântico",
        imagem: "https://i.ibb.co/zVLy6tqm/Box-love-you.png",
        badge: "Especial",
        itens: ["Box em formato de coração", "13 rosas vermelhas importadas", "Gipsophilas", "Chocolate Lindt 50g"]
    },
{
        id: 6,
        nome: "Box com 20 Rosas Vermelhas",
        descricao: "Box luxuoso com 20 rosas vermelhas frescas. Para用房 especiais.",
        preco: 279.90,
        precoAntigo: null,
        categoria: "romantico",
        categoriaNome: "Romântico",
        imagem: "https://i.ibb.co/WWgvkb1P/Box-com-20-Rosas-vermelhas.png",
        badge: "Premium",
        itens: ["Box redondo preto", "20 rosas vermelhas", "Gipsophilas", "Laço de cetim"]
    },
    {
        id: 7,
        nome: "Mini Box com 4 Rosas",
        descricao: "Box charmoso com 4 rosas. Ideal para surpresas do dia a dia.",
        preco: 89.90,
        precoAntigo: null,
        categoria: "romantico",
        categoriaNome: "Romântico",
        imagem: "https://i.ibb.co/v6NSfcHD/Mini-box-com-4-rosas.png",
        badge: null,
        itens: ["4 rosas vermelhas", "Gypsophilas", "Box redonda preta", "Laço de cetim vermelho"]
    },
    {
        id: 8,
        nome: "Orquídea Branca",
        descricao: "Orquídea branca elegante em vaso. Simboliza pureza e elegância.",
        preco: 189.90,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/rK8gKqh3/Orqu-dea-branca.png",
        badge: "Premium",
        itens: ["Orquídea branca", "Vaso decorativo", "Substrato especial", "Cartão de instruções"]
    },
    {
        id: 9,
        nome: "Orquídea Roxa",
        descricao: "Orquídea roxa sofisticado. Beleza exótica para-presentar alguém especial.",
        preco: 199.90,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/VhpmymK/Orqu-dea-roxa.png",
        badge: "Premium",
itens: ["Orquídea roxa", "Vaso decorativo", "Substrato especial", "Cartão de instruções"]
    },
    {
        id: 11,
        nome: "Ramalhete com 12 Rosas Colombianas",
        descricao: "Doze rosas colombianas premium. Um arranjo spectacular.",
        preco: 299.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/VpBV7Jn1/Ramalhete-com-12-rosas-colombianas.png",
        badge: "Premium",
        itens: ["12 rosas colombianas", "Papel de seda", "Fita de cetim", "Conservante floral"]
    },
{
        id: 12,
        nome: "Ramalhete com 20 Rosas Colombianas",
        descricao: "Vinte Rosas colombianas de luxo. O presente mais marcante.",
        preco: 399.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/fzXD28zD/Ramalhete-com-20-osas-colombianas.png",
        badge: "Especial",
        itens: ["20 Rosas colombianas vermelhas", "Celofane", "Laço decorativo"]
    },
{
        id: 13,
        nome: "Ramalhete com 6 Rosas",
        descricao: "Seis rosas vermelhas clássicas. O presente timeless.",
        preco: 199.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/bjsJ9CNX/Ramalhete-com-6-osas.png",
        badge: null,
        itens: ["6 rosas vermelhas", "Folhagens", "Papel floral", "Fita"]
    },
    {
        id: 14,
        nome: "Ramalhete com 12 Rosas",
        descricao: "Doze rosas vermelhas. Declaração de amor clássica.",
        preco: 299.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/7dTwxJ7t/Ramalhete-com-12-osas.png",
        badge: "Mais vendido",
        itens: ["12 rosas vermelhas", "Folhagens", "Papel floral", "Fita de cetim"]
    },
    {
        id: 15,
        nome: "Ramalhete com 6 Rosas Amarelas",
        descricao: "Seis rosas amarelas vibrantes. Alegria e amizade em forma de flores.",
        preco: 199.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/60cvQwx3/Ramalhete-com-6-osas-amarelas.png",
        badge: null,
        itens: ["6 Rosas amarelas", "Folhagens", "Papel floral", "Fita"]
    },
    {
        id: 16,
        nome: "Ramalhete com 15 Rosas Azuis",
        descricao: "Quinze rosas azuis únicas. Beleza exótica e rara.",
        preco: 349.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/9ms3GsZd/Ramalhete-com-15-osas-azuis.png",
        badge: "Especial",
        itens: ["15 Rosas azuis", "Papel premium", "Fita de cetim", "Caixa Especial"]
    },
    {
        id: 17,
        nome: "Ramalhete com 4 Girassóis",
        descricao: "Quatro girassóis vibrantes. Alegria e energia garantidas.",
        preco: 149.99,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/FbbLmSxL/Ramalhete-com-4-girass-is.png",
        badge: null,
        itens: ["4 girassóis", "Folhagem tropical", "Papel kraft", "Fita de sisal"]
    },
    {
        id: 18,
        nome: "Ramalhete com 6 Girassóis",
        descricao: "Seis girassóis radiantes. Sol em forma de presentes.",
        preco: 199.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/1t4HyZbN/Ramalhete-com-6-girass-is.png",
        badge: "Novo",
        itens: ["6 girassóis", "Folhagem tropical", "Papel kraft", "Fita de sisal"]
    },
    {
        id: 19,
        nome: "Ramalhete com 2 Girassóis",
        descricao: "Dois girassóis maravilhosos. Perfeito para pequenas surpresas.",
        preco: 120.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/xKFYXmNP/Ramalhete-com-2-girass-is.png",
        badge: null,
        itens: ["2 girassóis", "Folhagem", "Papel kraft", "Fita"]
    },
    {
        id: 20,
        nome: "Bouquet Encantado de Rosas e Lírios",
        descricao: "Arranjo sofisticado com rosas e lírios. Elegância e perfume.",
        preco: 399.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/HDJ3t5nQ/Bouquet-encantado-de-osas-e-l-rios-1.png",
        badge: "Premium",
        itens: ["Rosas", "Lírios brancos", "Folhagens exóticas", "Vaso de vidro", "Fita de cetim"]
    },
    {
        id: 21,
        nome: "Ramalhete com Rosas e Astromélias",
        descricao: "Arranjo colorido com rosas e astromélias. Beleza e alegria.",
        preco: 199.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/4RD7fMYB/Ramalhete-com-osas-e-astromelias.png",
        badge: null,
        itens: ["Rosas", "Astromélias", "Folhagens", "Papel floral"]
    },
    {
        id: 22,
        nome: "Ramalhete com Girassóis e Astromélias",
        descricao: "Combinação única de girassóis e astromélias. Arranjo vibrante.",
        preco: 160.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/B2M2YtVw/Ramalhete-com-girass-is-e-astromelias.png",
        badge: null,
        itens: ["Girassolis", "Astromélias", "Folhagem tropical", "Papel kraft"]
    },
    {
        id: 24,
        nome: "Ramalhete com Rosas e Girassóis",
        descricao: "Arranjo vibrante com rosas e girassóis. O melhor dos dois mundos.",
        preco: 210.00,
        precoAntigo: null,
        categoria: "flores",
        categoriaNome: "Flores",
        imagem: "https://i.ibb.co/pjNNqDV1/Ramalhete-com-osas-e-girassois.png",
        badge: null,
        itens: ["Rosas", "Girassóis", "Folhagens", "Papel kraft"]
    }
];

function getProdutos() {
    return produtos;
}

function getProdutoById(id) {
    return produtos.find(p => p.id === parseInt(id));
}

function getProdutosPorCategoria(categoria) {
    if (categoria === 'todos') return produtos;
    return produtos.filter(p => p.categoria === categoria);
}