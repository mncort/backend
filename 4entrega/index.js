const express = require("express")
const { Router } = express
const Contenedor = require('./contenedor')

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

const app = express()
const router = Router();
app.use(express.urlencoded({extended: true}))

let archivo = new Contenedor("test.JSON")

const server = app.listen(server_port, server_host, () => {
    console.log(`El servidor esta escuchando en el puerto: ${server.address().port}`)
    archivo.getAll().then(data => console.log(`La 'base de datos' cargo con exito ${data.length} registros`))
})

server.on("error", error => console.log(`El servidor ha sufrido un error ${error}`))


router.get('/productos', (request, response) => {
    archivo.getAll()
        .then(data => response.send(data))
        .catch(e => console.log)
})

router.get('/productos/:id', (request, response) => {
    archivo.getById(request.params.id)
        .then(data => response.send(data))
        .catch(e => console.log)
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
            "URL": request.body.URL,
            "precio": request.body.precio
        }
    ).then(data => archivo.getById(data).then(resp => response.send(resp)))
})

router.put('/productos/:id', (request, response) => {
    
    archivo.updateById(request.params.id,
        {
            "nombre": request.body.nombre,
            "URL": request.body.URL,
            "precio": request.body.precio
        }
    ).then(data => archivo.getById(data).then(resp => response.send(resp)))
})

router.delete('/productos/:id', (request, response) => {
    
    archivo.deleteById(request.params.id)
            .then(data => response.send("elemento eliminado"))
})

app.use('/api', router)