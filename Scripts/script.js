let quantidadePizza = 1;
let modalkey = 1;
let carrinho = [];

// Função para retornar o document.querySelector
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

pizzaJson.map((item, index) => {
    // Clonando o modelo de pizzas
    let pizzaItem = c(".models .pizza-item").cloneNode(true);

    // Colocando os dados dos itens no clone
    pizzaItem.setAttribute("data-key", index);
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
    
    pizzaItem.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalkey = key;
        c(".pizzaInfo--qt").innerHTML = quantidadePizza;

        // Detalhes do painel da pizza
        c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
        c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        c(".pizzaBig img").src = pizzaJson[key].img;
        c(".pizzaInfo--price").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        c(".pizzaInfo--size.selected").classList.remove("selected");
        
        // Colocando os tamanhos
        cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
            if (sizeIndex === 2) {
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        // Colocando botão de quantidade
        quantidadePizza = 1;
        c(".pizzaInfo--qt").innerHTML = quantidadePizza;

        // Animação para mostrar o painel das pizzas
        c(".pizzaWindowArea").style.opacity = "0";
        c(".pizzaWindowArea").style.display = "flex";
        setTimeout(() => {
            c(".pizzaWindowArea").style.opacity = "1";
        }, 500);
    });

    // Preenchendo o conteúdo da área de pizza
    c(".pizza-area").append(pizzaItem);
});

// Eventos da página
// Fechar os detalhes
function fecharmodal(){
    c(".pizzaWindowArea").style.opacity = "0";
    setTimeout(() => {
        c(".pizzaWindowArea").style.display = "none";
    }, 500);
}

cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) => {
    item.addEventListener("click", fecharmodal);
});

// Diminuir e aumentar o número de pizzas
c(".pizzaInfo--qtmais").addEventListener("click", aumentarPizza);
c(".pizzaInfo--qtmenos").addEventListener("click", diminuirpizza);

function aumentarPizza(){
    quantidadePizza++;
    c(".pizzaInfo--qt").innerHTML = quantidadePizza;
}

function diminuirpizza(){
    if(quantidadePizza >= 2){
        quantidadePizza--;
        c(".pizzaInfo--qt").innerHTML = quantidadePizza;
    }
}

// Mudando os tamanhos das pizzas
cs(".pizzaInfo--size, .pizzaInfo--size span").forEach((size) => {
    size.addEventListener("click", (e) => {
        if (c(".pizzaInfo--size.selected")) {
            c(".pizzaInfo--size.selected").classList.remove("selected");
        }
        if (c(".pizzaInfo--size")) {
            size.classList.add("selected");
        }
    });
});

// Adicionando itens no carrinho
c(".pizzaInfo--addButton").addEventListener("click", () => {
    // Tamanho da pizza
    let tamanhoPizza = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));
    // Verificando se os itens estão no carrinho
    let identificadorDeItem = pizzaJson[modalkey].id + "@" + tamanhoPizza; // Código para identificar cada pizza
    let key = carrinho.findIndex((item) => item.identificadorDeItem === identificadorDeItem);
    if (key > -1) {
        carrinho[key].quantidade += quantidadePizza;
    } else { // Colocando os itens no carrinho
        carrinho.push({
            identificadorDeItem,
            id: pizzaJson[modalkey].id,
            tamanhoPizza,
            quantidade: quantidadePizza,
        });
    }
    atualizarCarrinho();
    fecharmodal();
});


// Fazendo o carrinho de fato aparecer com as informações
function atualizarCarrinho(){
    c(".menu-openner span").innerHTML = carrinho.length;
    if (carrinho.length > 0){
        // Mostrar o carrinho
        c("aside").classList.add("show");
        let subTotal = 0;
        let total = 0;
        let desconto = 0;
        c(".cart").innerHTML = "";

        for (let i in carrinho) {
            let itensCarrinho = c(".models .cart--item").cloneNode(true);
            let texto = document.querySelector(".pizzaInfo--size.selected").textContent;
            let tamanho = texto.charAt(0);
            let pizzaItem = pizzaJson.find((item) => item.id == carrinho[i].id);
            subTotal += pizzaItem.price * carrinho[i].quantidade;
            itensCarrinho.querySelector(".cart--item--qt").innerHTML = carrinho[i].quantidade;
            itensCarrinho.querySelector("img").src = pizzaItem.img;
            itensCarrinho.querySelector(".cart--item-nome").innerHTML = `${pizzaItem.name} (${tamanho})`;
            itensCarrinho.querySelector(".cart--item-qtmais").addEventListener("click", () => {
                carrinho[i].quantidade++;
                atualizarCarrinho();
            });
            itensCarrinho.querySelector(".cart--item-qtmenos").addEventListener("click", () => {
                if (carrinho[i].quantidade > 1) {
                    carrinho[i].quantidade--;
                    atualizarCarrinho();
                } else {
                    carrinho.splice(i, 1);
                    atualizarCarrinho();
                }
            });
            c(".cart").append(itensCarrinho);
        }
        desconto = subTotal * 0.1;
        total = subTotal - desconto;
        c(".subtotal span:last-child").innerHTML = `R$ ${subTotal.toFixed(2)}`;
        c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
        c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c("aside").classList.remove("show");
        c("aside").style.left = "100vw"
        c("aside").style.display = "none"
        document.body.classList.remove("no-scroll");
        document.documentElement.classList.remove("no-scroll");
    }
}
//fazer o aside aparecer no mobile
c(".menu-openner").addEventListener("click", ()=>{
    if(carrinho.length > 0){
        c("aside").style.left = "0"
        c("aside").classList.add("show");
        c("aside").style.display = "flex"
        document.body.classList.add("no-scroll");
        document.documentElement.classList.add("no-scroll");


    }
})
c(".menu-closer").addEventListener("click", ()=>{
    c("aside").style.marginLeft = "230vw"
    c("aside").style.display = "none"
     document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
})
