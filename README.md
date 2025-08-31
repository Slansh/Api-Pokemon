# Meu Site Dinâmico de Pokémon ⚡️

> Uma aplicação web moderna e interativa construída com React, que oferece funcionalidades de busca, listagem e gerenciamento de dados de Pokémon.

---

## 🚀 Sobre o Projeto

Este projeto é uma demonstração de uma aplicação web dinâmica desenvolvida com **React**. O objetivo principal é ilustrar o uso de conceitos fundamentais como:

* **Roteamento:** Navegação entre diferentes páginas (`Home`, `Pesquisa`, `Lista`, `Formulário` e `Sobre`) utilizando `react-router-dom`.
* **Consumo de API:** Busca de dados em uma API externa, a **PokeAPI**, para exibir informações detalhadas de Pokémon.
* **Gerenciamento de Estado:** Utilização de `useState` e `useEffect` para controlar o estado dos componentes, lidar com carregamentos e erros.
* **Context API:** Implementação de um sistema de "Pokémon Vistos Recentemente" que compartilha dados entre os componentes e persiste no `localStorage`.
* **Estilização Profissional:** Design moderno e totalmente responsivo, construído com o framework CSS **Tailwind CSS**.
* **Validação de Formulário:** Demonstração de um formulário com validação de campos em tempo real.

---

## ✨ Funcionalidades

-   **Página Inicial:** Exibe uma saudação e uma seção de Pokémon visualizados recentemente.
-   **Pesquisa de Pokémon:** Permite buscar um Pokémon por nome e visualizar seus detalhes, como ID, tipos, habilidades e estatísticas.
-   **Lista de Pokémon:** Exibe uma lista paginada de Pokémon, permitindo a navegação entre as páginas e a busca por nome.
-   **Formulário de Contato:** Uma página de formulário simples com validação para demonstrar o manuseio de inputs e validação de dados.
-   **Página "Sobre":** Uma visão geral do projeto e dos conceitos de React utilizados.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:**
    * **React:** Biblioteca JavaScript.
    * **React Router DOM:** Para o roteamento.
    * **Tailwind CSS:** Para estilização e layout responsivo.
    * **Context API:** Para gerenciamento de estado global.
    * **Lucide React:** Biblioteca de ícones.
* **API:**
    * **PokeAPI:** API RESTful para dados de Pokémon.

---

## ⚙️ Como Rodar o Projeto

Siga os passos abaixo para ter uma cópia do projeto em execução na sua máquina local.

### Pré-requisitos

Certifique-se de que você tem o **Node.js** e o **Git** instalados.

### Instalação

1.  Clone o repositório para sua máquina:
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd seu-repositorio
    ```
3.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn
    ```

### Executando a Aplicação

Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
