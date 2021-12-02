const Archivo = require('./archivo')

class Contenedor {
    constructor(archivo){
        this.lastId = 0
        this.productos = []
        this.archivo = new Archivo(archivo)
        
    }
    async save(objeto){
        try{
            await this.getAll().then(data => this.lastId = this.maxId())
            this.lastId++
            this.productos.push({...objeto, id: this.lastId})
            await this.archivo.escribir(this.productos)
            return this.lastId
        }catch(e){
            console.error("Se re pico", e)
        }  
    }

    maxId(){
        return Math.max(...this.productos.map(item => item?.id || 1)) 
    }
    async getById(id){
        try{
            await this.getAll()
            let variable = this.productos.find(item => item.id == id) || false
            if(!variable) throw false
            return variable
        }catch(e){
            throw new Error()
        }
        
    }
    async getAll(){
        this.productos = JSON.parse(await this.archivo.check())
        return this.productos
    }
    async deleteById(id){
        try{
            await this.getAll()
            let index = this.productos.findIndex(item => item.id == id) || false
            if(!index) throw false
            this.productos.splice(index, 1);
            await this.archivo.escribir(this.productos)
        }catch(e){
            console.error("Se re pico", e)
            throw new Error()
        }  
    }
    async deleteAll(){
        await this.getAll()
        this.productos = []
        await this.archivo.escribir(this.productos)
    }
    async getRandom(){
        await this.getAll()
        let idDisponibles = this.productos.map(producto => producto.id)
        return await this.getById(idDisponibles[Math.floor(Math.random() * idDisponibles.length)]);
    }
    async updateById(id, obj){
        try{
            await this.getAll()
            let index = this.productos.findIndex(item => item.id == id) || null
            this.productos[index] = {
                nombre: obj.nombre,
                uri: obj.uri,
                precio: obj.precio,
                id: parseInt(id)
            }
            await this.archivo.escribir(this.productos) 
        }catch(e){
            console.error("actualizando tiro error: ", e)
        }
           
    }
}

module.exports = Contenedor












