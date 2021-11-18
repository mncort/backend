const fs = require('fs')

class Contenedor {
    constructor(archivo){
        this.archivo = archivo
        this.id = 0
        this.productos = []
    }

    save(objeto){
        this.productos.push(...objeto, this.id)
        this.id++
    }
    getById(id){
        return this.productos.find(producto => producto.id == id) || null
    }
    getAll(){
        return this.productos
    }
    deleteById(id){
        this.productos = this.productos.filter(producto => producto.id != id)
        return this.productos
    }
    deleteAll(){
        this.productos = []
    }
}