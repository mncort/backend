const express = require("express")
const Contenedor = require('./contenedor')


const app = express()
const PORT = 3000 
let archivo = new Contenedor("test.JSON")

let test = app.listen(PORT)

test.on('error', error => console.log)


app.get('/productos', (request, response) => {
    archivo.getAll()
        .then(data => response.send(data))
        .catch(e => console.log)
})

//archivo.getAll().then(resp => app.get('/productos', (request, response) => {response.send(resp)}))


app.get('/productoRandom', (request, response) => {
    archivo.getRandom()
        .then(data => response.send(data))
        .catch(e => console.log)
})