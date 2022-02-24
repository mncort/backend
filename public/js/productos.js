function mostrarProductos(id, productList, admin)  {
    let domObject = document.getElementById(id)
    
    domObject.innerHTML = productList.reverse().map(product => admin ? actualizarProductos(product) : mostrarProducto(product)).join("")
    admin && domObject.prepend(btnNewProduct())

}

const mostrarProducto = (product) => `
    <div class="card mb-1" style="width: 18rem;">
        <img class="card-img-top" src="${product.foto}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${product.nombre}</h5>
            <p class="card-text">${product.descripcion}</p>
            <div class="row d-flex justify-content-around align-items-center">
                <span class="col-5">$ ${product.precio}</span>
                <button class="btn btn-primary col-5" onclick="checkCarrito(event)">Agregar</button>
            </div>
        </div>
    </div>
`

const renderKeys = {
    'nombre': {
        edit: "",
        type: "text",
        defaultValue: "Nombre"
    },
    'descripcion': {
        edit: "",
        type: "text",
        defaultValue: "Descripcion"
    },
    'codigo': {
        edit: "",
        type: "text",
        defaultValue: "Codigo"
    },
    'foto': {
        edit: "",
        type: "text",
        defaultValue: "Foto"
    },
    'precio': {
        edit: "",
        type: "number",
        defaultValue: "Precio"
    },
    'stock': {
        edit: "",
        type: "number",
        defaultValue: "Stock"
    },
    'id': {
        edit: "disabled",
        type: "number",
    },
}


const actualizarProductos = (product) => {
    const productoRespuesta = {}

    const checkValue = (key, nombre = renderKeys[key].defaultValue) => product[key] === undefined ? `placeholder=${nombre}` : `value=${product[key]}`
    const checkTitulo = (key, nombre = renderKeys[key].defaultValue) => product[key] === undefined ? `${nombre}` : `${product[key]}`
    
    return `
        <div id="producto-${product.id}" class="card mb-2" style="width: 25rem;">
            <img class="card-img-top" src="${product.foto}" alt=${checkTitulo("nombre", "Falta Imagen")}>
            <div class="card-body">
                <h5 class="card-title">${checkTitulo("nombre", "Nuevo Producto")}</h5>
                <form>
                    ${Object.keys(renderKeys).map(key => `
                        <div class="form-group row my-1">
                            <label for=${key} class="col-sm-4 col-form-label text-capitalize">${key}</label>
                            <div class="col-sm-8">
                                <input type="${renderKeys[key].type}" class="form-control" id=${key} ${checkValue(key)} ${renderKeys[key].edit}>
                            </div>
                        </div>
                    `).join("")}
                    <div class="form-group row justify-content-around">
                        <button onclick="updateProducto(event,${product.id})" class="btn btn-primary col-5 m-1">Guardar</button>
                        <button onclick="eliminarProducto(event,${product.id})" class="btn btn-danger col-5 m-1">Eliminar</button>
                    </div>
                </form>
            </div>
        </div>`
}

const updateProducto = (e, id) =>{
    e.preventDefault();

    const values = [...e.target.parentNode.getElementsByTagName("input")]

    let producto = {}
    
    values.forEach(item => producto[item.id] = item.value)

    fetch(
        `http://localhost:8080/api/productos/${id}`,
        {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        }
    )
}

const eliminarProducto = (e, id) =>{
    e.preventDefault()

    fetch(
        `http://localhost:8080/api/productos/${id}`,
        {
            method: 'DELETE',
        }
    ).then( () => renderProductos(e))
}

const btnNewProduct = () =>{
    let btn = document.createElement('button')
    btn.className = 'btn btn-primary my-2'
    btn.textContent = 'Nuevo Producto ➕'
    btn.onclick = (event) => pushNewProduct(event)
    return btn
}

const pushNewProduct = (e) => {
    e.preventDefault()

    fetch( 
        `http://localhost:8080/api/productos`,
        {
            method: 'POST',
        }
    ).then( () => renderProductos(e))
}