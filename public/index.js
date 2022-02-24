let productList = []

function renderProductos(e)  {
    e.preventDefault()
    fetch('http://localhost:8080/api/productos',{method: 'GET'})
        .then(resp => resp.json())
        .then(productList => {
            const id = 'App'
            fetch('http://localhost:8080/api/isAdmin',{method: 'GET'}).then(admin => admin.json()).then(admin => mostrarProductos(id, productList, admin))
        })
        .catch(err => console.log(err));    
}

function getProdutos (){
    console.log("hola")
    fetch('http://localhost:8080/api/productos',{method: 'GET'})
    .then(resp => resp.json())
    .then(resp => console.log(resp))
    .catch(err => console.log(err));
}

function setAdmin (e){
    e.preventDefault()

    fetch('http://localhost:8080/api/setAdmin',{method: 'PUT'})
        .then(renderProductos(e))
        .catch(err => console.log(err));
}

