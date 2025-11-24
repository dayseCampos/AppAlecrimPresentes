# 📱 Alecrim Presentes – App Mobile

Aplicativo mobile desenvolvido em **React Native (Expo)** para apoiar a loja **Alecrim Presentes** na organização do catálogo de produtos e na experiência de compra dos clientes.

Este projeto foi desenvolvido como parte de um **projeto de extensão universitária**, conectando prática em desenvolvimento mobile com uma necessidade real de uma pequena empresa.

---

## 🌿 Objetivo

Oferecer uma solução simples, bonita e funcional para:

- Organizar e visualizar os produtos da loja;
- Facilitar o acesso dos clientes ao catálogo;
- Apoiar o controle de itens pelo administrador.

---

## ✨ Principais funcionalidades

- 🛍️ **Catálogo de produtos**  
  Lista de produtos com imagem, nome, categoria e preço.

- ⭐ **Favoritos**  
  Cliente pode marcar produtos favoritos para acessá-los com mais rapidez.

- 🧺 **Carrinho**  
  Simulação de carrinho de compras, permitindo adicionar e remover itens.

- 🔐 **Login de administrador**  
  Acesso restrito para gerenciamento de produtos.

- ⚙️ **Área administrativa**  
  - Cadastro de novos produtos  
  - Edição e remoção de itens existentes  
  - Organização por categorias

---

## 🛠️ Tecnologias utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Supabase](https://supabase.com/) – autenticação e banco de dados
- JavaScript
- Tailwind CSS (via NativeWind ou similar) para estilização

---

## 📂 Estrutura básica do projeto

```bash
.
├── assets/            # Imagens e ícones
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── screens/       # Telas do app (Home, Catálogo, Admin, etc.)
│   ├── services/
│   │   └── supabase.js # Configuração do cliente Supabase
│   └── navigation/    # Navegação (stack/drawer/tab)
├── App.js             # Entrada principal do app
├── package.json
└── tailwind.config.js
