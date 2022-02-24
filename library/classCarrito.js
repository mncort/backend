const Archivo = require('./archivo')

class ClassCarritos {
    constructor(archivo){
        this.lastId = 0
        this.archivo = new Archivo(archivo)
        this.carritos = [] 
        
    }
    async new(){
        try{
            console.log('hola')
            await this.getAll().then(data => this.lastId = this.maxId())
            this.lastId++
            this.carritos.push({id: this.lastId, timestamp: new Date(), productos: []})
            await this.archivo.escribir(this.carritos)
            console.log(this.lastId)
            return parseInt(this.lastId)
        }catch(e){
            throw new Error("Se re pico")
        }  
    }

    maxId(){
        if(this.carritos.length == 0) return 0
        
        return Math.max(...this.carritos.map(item => item.id))
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

    async getProductosById(id){
        try{
            await this.getAll()
            let variable = this.carritos.find(item => item.id == id) || false
            if(!variable) throw new Error("no se encontro el carrito")
            return variable.productos
        }catch(e){
            throw new Error("no se encontro el carrito")
        }
    }

    async pushProducto(id,producto){
        try{
            await this.getAll()
            let variable = this.carritos.find(item => item.id == id) || false
            if(!variable) throw new Error("no se encontro el carrito")
            variable.productos.push(producto)
            await this.archivo.escribir(this.carritos)
            return variable.productos
        }catch(e){
            throw new Error("no se encontro el carrito")
        }
    }

    async deleteProducto(id,idProducto){
        try{
            await this.getAll()
            let idC = this.carritos.findIndex(item => item.id == id)
            console.log(idC)
            if(idC == -1) throw new Error("no se encontro el carrito")
            let idP = this.carritos[idC].productos.findIndex(item => item.id == idProducto)
            if(idP == -1) throw new Error("no se encontro el producto")
            this.carritos[idC].productos.splice(idP, 1);
            await this.archivo.escribir(this.carritos)
            return this.carritos[idC].productos
        }catch(e){
            throw new Error("no se encontro el carrito")
        }
    }


    async getAll(){
        this.carritos = JSON.parse(await this.archivo.check())
        return this.carritos
    }

    async deleteById(id){
        try{
            await this.getAll()
            let index = this.carritos.findIndex(item => item.id == id)
            if(index == -1) {
                throw new Error("el carrito no existe")
            }
            this.carritos.splice(index, 1);
            await this.archivo.escribir(this.carritos)
        }catch(e){
            throw new Error("el carrito no existe")
        }  
    }

    async deleteAll(){
        await this.getAll()
        this.carritos = []
        await this.archivo.escribir(this.carritos)
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
                nombre: obj.nombre,
                uri: obj.uri,
                precio: obj.precio,
                id: parseInt(id)
            }
            await this.archivo.escribir(this.productos) 
        }catch(e){
            throw new Error(e.message)
        }
    }
}

module.exports = ClassCarritos












