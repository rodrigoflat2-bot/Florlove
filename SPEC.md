# Flor & Afeto - Especificação do Projeto

## 1. Concept & Vision

**Flor & Afeto** é uma loja online de presentes personalizados que evoca romanticismo, sofisticação e carinho. O site transmite a sensação de entrar numa floricultura boutique com toques de modernidade. A experiência deve ser fluida, elegante e acolhedora, como receber um abraço virtual ao navegar pelos produtos.

## 2. Design Language

### Aesthetic Direction
Elegância orgânica com toques florais. Inspiração em revistas de lifestyle premium combinadas com a delicadeza de um ateliê de flores.

### Color Palette
- **Primary**: `#D4A574` (Rose Gold/Dourado Rosado)
- **Secondary**: `#2D3436` (Charcoal elegante)
- **Accent**: `#E84393` (Rosa vibrante para CTAs)
- **Background**: `#FDF8F5` (Creme suave)
- **Text**: `#2D3436` (Charcoal)
- **Light**: `#F8E8E0` (Rosa pálido para seções alternadas)

### Typography
- **Headings**: 'Playfair Display' - serif elegante para títulos
- **Body**: 'Nunito' - sans-serif amigável e legível
- **Accent**: 'Great Vibes' - script para detalhes decorativos

### Spatial System
- Base unit: 8px
- Sections: 80px padding vertical (desktop), 48px (mobile)
- Cards: 24px padding, 16px gap
- Border-radius: 16px para cards, 50px para botões

### Motion Philosophy
- Transições suaves de 0.3s ease
- Hover com lift sutil (transform: translateY(-8px))
- Fade-in staggered nos elementos ao carregar
- Micro-interações em botões e ícones

### Visual Assets
- Ícones: Phosphor Icons (estilo thin/light)
- Imagens: fotos de alta qualidade de flores, presentes, cestas
- Elementos decorativos: formas orgânicas, linhas curvas sutis

## 3. Layout & Structure

### Header
- Logo à esquerda com tipografia script
- Navegação central (Desktop) / Menu hamburguer (Mobile)
- Carrinho e ícones sociais à direita
- Header sticky com blur backdrop

### Hero Section
- Full-width com imagem de fundo
- Título em grandes tipografia script
- Subtítulo elegante
- CTA "Ver Produtos" com hover animado

### Categorias
- Grid de 4 categorias principais
- Cards com imagem, overlay gradiente e texto
- Hover com zoom sutil na imagem

### Produtos em Destaque
- Título de seção com linha decorativa
- Grid responsivo (4 colunas desktop, 2 mobile)
- Cards com imagem, nome, preço, botão

### Sobre
- Layout 2 colunas (texto + imagem)
- Ícones de benefícios (frete, presente, carinho)

### Newsletter
- Background rosa pálido
- Input de email com botão integrado

### Footer
- 4 colunas: Logo+descrição, Links, Categorias, Contato
- Redes sociais com ícones animados
- Copyright

## 4. Features & Interactions

### Navegação
- Menu mobile com slide-in da direita
- Smooth scroll para seções
- Hover underline animado nos links

### Cards de Produto
- Hover: elevação + sombra expandida
- Badge de desconto (se aplicável)
- Botão "Comprar" aparece no hover

### Carrinho
- Ícone com contador
- Animação de pulse ao adicionar
- Toast notification de confirmação

### Formulário Newsletter
- Validação de email
- Feedback visual de sucesso
- Shake animation em erro

### Responsividade
- Breakpoints: 1200px, 992px, 768px, 576px
- Menu colapsa para hamburger abaixo de 992px
- Grid adapta de 4→2→1 colunas

## 5. Component Inventory

### Button Primary
- Background: gradient rosa
- Padding: 16px 32px
- Border-radius: 50px
- States: hover (brilho), active (scale 0.98), disabled (opacity 0.5)

### Button Secondary
- Border: 2px solid primary
- Background: transparent
- States: hover (fill primary, text white)

### Card Produto
- Background: white
- Shadow: 0 4px 20px rgba(0,0,0,0.08)
- Hover: shadow expands, translateY(-8px)
- Image: aspect-ratio 1:1, object-fit cover

### Card Categoria
- Height: 300px
- Overlay: gradient black to transparent
- Text: white, bottom positioned

### Input Field
- Border: 2px solid #ddd
- Focus: border primary
- Border-radius: 12px

### Toast Notification
- Fixed bottom-right
- Slide-in animation
- Auto-dismiss 3s

## 6. Technical Approach

### Stack
- HTML5 semântico
- CSS3 com custom properties
- Vanilla JavaScript ES6+
- Sem frameworks - código puro e otimizado

### Arquivos
- `index.html` - estrutura completa
- `style.css` - todos os estilos
- `script.js` - interatividade

### Performance
- Lazy loading para imagens
- CSS otimizado sem redundâncias
- Fontes com display: swap

### Acessibilidade
- Contraste adequado
- Focus states visíveis
- Semântica HTML correta
- Alt text em imagens
