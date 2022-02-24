const Archivo = require('./archivo')

class ClassProductos {
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
        if(this.productos.length == 0) return 0
        
        return Math.max(...this.productos.map(item => item.id))
    }

    async getById(id){
        try{
            await this.getAll()
            let variable = this.productos.find(item => item.id == id) || false
            if(!variable) throw new Error("no se encontro el producto")
            return variable
        }catch(e){
            throw new Error("no se encontro el producto")
        }
    }

    async getAll(){
        this.productos = JSON.parse(await this.archivo.check())
        return this.productos
    }

    async deleteById(id){
        try{
            await this.getAll()
            let index = this.productos.findIndex(item => item.id == id)
            if(index == -1) {
                throw new Error("el producto no existe")
            }
            this.productos.splice(index, 1);
            await this.archivo.escribir(this.productos)
        }catch(e){
            throw new Error("el producto no existe")
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
            let index = this.productos.findIndex(item => item.id == id)
            if (index == -1) throw new Error("El producto no existe")
            this.productos[index] = {
                id,
                timestamp: obj.timestamp,
                nombre: obj.nombre,
                descripcion: obj.descripcion,
                codigo: obj.codigo,
                foto: obj.foto,
                precio: obj.precio,
                stock: obj.stock
            }
            await this.archivo.escribir(this.productos) 
        }catch(e){
            throw new Error(e.message)
        }
    }
}

module.exports = ClassProductos












