const express = require("express")
const { Router } = express
const Contenedor = require('./library/contenedor')
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

const server = app.listen(server_port, server_host, () => {
    console.log(`El servidor esta escuchando en el puerto: ${server.address().port}`)
    archivo.getAll().then(data => console.log(`La 'base de datos' cargo con exito ${data.length} registros`))
})

server.on("error", error => console.log(`El servidor ha sufrido un error ${error}`))

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
    return response.render('handlebars/index.hbs')
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


