const express = require("express")
const { Router } = express
const Contenedor = require('./library/contenedor')
const ContenedorMensajes = require('./library/mensajes')
const handlebars = require('express-handlebars');
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

const app = express()
const router = Router();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.urlencoded({extended: true}))

let archivo = new Contenedor("./data/test.JSON")
let chat = new ContenedorMensajes("./data/mensajes.JSON")

let serverChat = []


httpServer.listen(server_port,function(){
    console.log(`HTTP server runing`)
    archivo.getAll().then(data => console.log(`La 'base de datos' cargo con exito ${data.length} productos`))
    chat.getAll().then(data => console.log(`La 'base de datos' cargo con exito ${data.length} mensajes`))
})

io.on("connection", (socket) => {

    io.sockets.emit('recienConectado', archivo.productos)
    io.sockets.emit('mensajes', chat.mensajes)

    socket.on('new-product', (data) => {
        console.log("data",data)
        archivo.save(
            {
                "nombre"  : data.nombre,
                "precio"  : data.precio,
                "uri"     : data.uri
            }
        ).then(resp => archivo.getAll().then(productos => io.sockets.emit('productos', productos )) )
    })

    socket.on('eliminar', (id) =>{
        archivo.deleteById(id)
        .then(res => archivo.getAll().then(productos => io.sockets.emit('productos', productos )) )
    })
    socket.on('new-mensaje', (mensaje) =>{
        chat.save(
            {
                "date": Date.now(),
                "texto": mensaje.texto,
                "usuario": mensaje.usuario
            }
        ).then(res => chat.getAll().then(resp => io.sockets.emit('mensajes', resp)))
        
    })

})

app.use(express.static('./public'))

app.use('/api', router)

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        partialsDir: __dirname + "/views/partials"
    })
)

app.set('views', './views')
app.set('views engine', 'hbs')

app.get('/',(request, response) => {
    let scripts = [
        { script: '/socket.io/socket.io.js' },
        { script: './mainhbs.js'}
    ]
    return response.render('handlebars/index.hbs', {scripts})
})

app.get('/productos', (request, response) => {
    archivo.getAll()
        .then(productos => {
            let showList = productos.length !==0
            response.render('handlebars/productos.hbs', {productos, showList})
        })
        .catch(e => console.log)
})

router.get('/productos/:id', (request, response) => {
    archivo.getById(request.params.id)
        .then(data => response.send(data))
        .catch(e => response.status(404).send(e.message))
})

router.get('/productoRandom', (request, response) => {
    archivo.getRandom()
        .then(data => response.send(data))
        .catch(e => console.log)
})

router.post('/productos', (request, response) => {

    console.log(request.params)
    
    archivo.save(
        {
            "nombre": request.body.nombre,
            "uri": request.body.uri,
            "precio": request.body.precio
        }
    ).then(resp => response.redirect('/'))
})

router.put('/productos/:id', (request, response) => {
    
    archivo.updateById(request.params.id,
        {
            "nombre": request.body.nombre,
            "uri": request.body.uri,
            "precio": request.body.precio
        }
    ).then(
        data => 
            archivo.getById(data)
            .then(resp => response.send(resp))
            .catch(e => response.status(404).send(e.message))
    ).catch(e => response.status(404).send("error update: " + e.message))
})

router.delete('/productos/:id', (request, response) => {
    
    archivo.deleteById(request.params.id)
            .then(data => response.send("elemento eliminado"))
            .catch(e => response.status(404).send(e.message))
})


