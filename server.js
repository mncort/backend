const express = require("express")
const { Router } = express
const ClassProductos = require('./library/classProductos')
const ClassCarritos = require('./library/classCarrito')
const { Server: HttpServer } = require('http')
const bodyparser = require('body-parser')

var server_port = process.env.YOUR_PORT || process.env.PORT || 8080;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

const app = express()
app.use(bodyparser.json())
const router = Router();
const productos = Router();
const carrito = Router();
const httpServer = new HttpServer(app)

app.use(express.urlencoded({extended: true}))

let productList = new ClassProductos("./data/listaProductos.JSON")
let listCarritos = new ClassCarritos("./data/listaCarritos.JSON")

let admin = false;

httpServer.listen(server_port,function(){
    console.log(`HTTP server runing`)
    productList.getAll().then(data => console.log(`La 'base de datos' cargo con exito ${data.length} productos`))
    listCarritos.getAll().then(data => console.log(`La 'base de datos' cargo con exito ${data.length} carritos`)).then(resp => console.log)
})

app.use(express.static('./public'))

app.use('/api', router)
router.use('/productos', productos)
router.use('/carrito', carrito)

app.get('/',(request, response) => {})

router.get('/isAdmin',(request, response) => {
    response.send(admin)
})

router.put('/setAdmin',(request, response) => {
    admin = !admin
    response.send("ok")
})

productos.get('/',(request, response) => {
    productList.getAll()
        .then(
            data => response.send(data)
        )
        .catch(e => console.log)
})

productos.get('/:id', (request, response) => {
    productList.getById(request.params.id)
        .then(data => response.send(data))
        .catch(e => response.status(400).send(e.message))
})

productos.post('/', (request, response) => {
  
    if(admin){
        productList.save(
            {
                "timestamp": Date.now(),
                "nombre": request.body.nombre,
                "descripcion": request.body.descripcion,
                "codigo": request.body.codigo,
                "foto": request.body.foto,
                "precio": request.body.precio,
                "stock": request.body.stock,
            }
        ).then(resp => response.status(200).send(resp.toString()))
        .catch(e => response.status(400).send(e.message))
    }else{
        let e = new Error('ruta api/productos metodo post no autorizada')
        response.status(400).send(e.message)
    }
    
})

productos.put('/:id', (request, response) => {

    console.log(request.body)

    if(admin){
        productList.updateById(request.params.id,
            {
                "timestamp": Date.now(),
                "nombre": request.body.nombre,
                "descripcion": request.body.descripcion,
                "codigo": request.body.codigo,
                "foto": request.body.foto,
                "precio": request.body.precio,
                "stock": request.body.stock
            }
        ).then(
            data => 
            productList.getById(data)
                .then(resp => response.send(resp))
                .catch(e => response.status(404).send(e.message))
        ).catch(e => response.status(404).send("error update: " + e.message))
    }else{
        let e = new Error('ruta api/productos/:id metodo put no autorizada')
        response.status(400).send(e.message)
    }
})

productos.delete('/:id', (request, response) => {

    if(admin){    
        productList.deleteById(request.params.id)
            .then(data => response.send("elemento eliminado"))
            .catch(e => response.status(404).send(e.message))
    }else{
        let e = new Error('ruta api/productos/:id metodo delete no autorizada')
        response.status(400).send(e.message)
    }
})

carrito.post('/', (request, response) => {
    listCarritos.new()
        .then(resp => {
            console.log(resp)
            response.status(201).send(resp)
        })
        .catch(e => response.status(400).send(e.message))
})

carrito.delete('/:id', (request, response) => {
 
    listCarritos.deleteById(request.params.id)
        .then(data => response.send("carrito eliminado"))
        .catch(e => response.status(404).send(e.message))
})

carrito.get('/:id/productos', (request, response) => {
   
    listCarritos.getProductosById(request.params.id)
        .then(data => response.send(data))
        .catch(e => response.status(404).send(e.message))
})

carrito.post('/:id/productos', (request, response) => {
  
    productList.getById(request.body.id)
        .then(resp => {
            listCarritos.pushProducto(request.params.id, resp)
                .then(resp => response.status(200).send(resp))
                .catch(e => response.status(404).send(e.message))
        })
        .catch(e => response.status(404).send(e.message))
})

carrito.delete('/:id/productos/:id_prod', (request, response) => {
  
    listCarritos.deleteProducto(request.params.id, request.params.id_prod)
        .then(resp => response.status(200).send(resp))
        .catch(e => response.status(404).send(e.message))
})

