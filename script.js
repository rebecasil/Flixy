// Seleciona o elemento HTML com a classe "card-container" e o armazena na variável cardContainer.
let cardContainer = document.querySelector(".card-container");
// Seleciona o primeiro elemento <input> do tipo "text" e o armazena na variável inputBusca.
let inputBusca = document.querySelector("input[type='text']");
// Inicializa um array vazio chamado 'dados' que será usado para armazenar os dados do arquivo JSON.
let dados = [];

// Adiciona um evento que será disparado assim que o conteúdo da página for carregado.
document.addEventListener('DOMContentLoaded', iniciarPagina);

// Adiciona um evento para a tecla "Enter" no campo de busca.
inputBusca.addEventListener('keydown', function(event) {
    // Verifica se a tecla pressionada foi a "Enter".
    if (event.key === 'Enter') {
        // Impede o comportamento padrão da tecla (como submeter um formulário, que recarregaria a página).
        event.preventDefault();
        // Chama a função de busca.
        iniciarBusca();
    }
});

// Adiciona um evento que filtra os resultados em tempo real, conforme o usuário digita.
inputBusca.addEventListener('input', filtrarERenderizar);

// Define uma função assíncrona chamada iniciarBusca.
async function carregarDados() {
    // Verifica se o array 'dados' está vazio (ou seja, se os dados ainda não foram carregados).
    if (dados.length === 0) {
        // Se estiver vazio, faz uma requisição para buscar o arquivo "data.json". 'await' pausa a função até a requisição ser concluída.
        let resposta = await fetch("data.json");
        // Converte a resposta da requisição para o formato JSON e armazena na variável 'dados'. 'await' pausa até a conversão ser finalizada.
        dados = await resposta.json();
    }
}

// Função que filtra e renderiza os cards com base no termo de busca
function filtrarERenderizar() {
    // Pega o valor atual do campo de busca, converte para letras minúsculas e armazena na variável 'termoBusca'.
    let termoBusca = inputBusca.value.toLowerCase();

    // Filtra o array 'dados' para criar um novo array 'dadosFiltrados' com os itens que correspondem ao 'termoBusca'.
    let dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || // Verifica se o nome do item (em minúsculas) inclui o termo da busca.
        dado.descricao.toLowerCase().includes(termoBusca) || // Ou verifica se a descrição do item (em minúsculas) inclui o termo da busca.
        dado.sinopse.toLowerCase().includes(termoBusca) // Ou verifica se a sinopse do item (em minúsculas) inclui o termo da busca.
    );

    // Chama a função renderizarCards, passando os dados filtrados para serem exibidos na tela.
    renderizarCards(dadosFiltrados);
}

// Função que é chamada quando a página carrega
async function iniciarPagina() {
    await carregarDados(); // Espera os dados serem carregados
    filtrarERenderizar(); // Renderiza todos os cards (termo de busca está vazio)
}

// Função de busca que será chamada pelo botão
function iniciarBusca() {
    filtrarERenderizar(); // Chama a função de filtro e renderização
}

// Define uma função chamada renderizarCards que recebe um array de dados como parâmetro.
function renderizarCards(dados) {
    // Limpa todo o conteúdo HTML dentro do cardContainer para remover os cards de resultados anteriores.
    cardContainer.innerHTML = "";
    // Inicia um loop 'for...of' para iterar sobre cada item (chamado 'dado') no array de dados recebido.
    for (let dado of dados) {
        // Cria um novo elemento HTML <article> e o armazena na variável 'article'.
        let article = document.createElement("article");
        // Adiciona a classe CSS "card" ao elemento <article> que foi criado.
        article.classList.add("card");
        // Define o conteúdo HTML interno do <article> usando um template string com as informações do item atual ('dado').
        article.innerHTML = `
        <img src="${dado.imagem}" alt="Capa de ${dado.nome}">
        <div class="card-content">
            <h2>${dado.nome}</h2>
            <div class="card-info">
                <span class="tipo">${dado.tipo}</span>
                <span class="ano">Ano: ${dado.ano}</span>
            </div>
            <p>${dado.descricao}</p>
            <p class="sinopse">${dado.sinopse}</p>
            <a href="${dado.link}" target="_blank">Assista já</a>
        </div>
        `
        // Adiciona o <article> criado e preenchido como um elemento filho do 'cardContainer' no documento HTML.
        cardContainer.appendChild(article);
    }

}