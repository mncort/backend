const Archivo = require('./archivo')

class ContenedorMensajes {
    constructor(archivo){
        this.lastId = 0
        this.mensajes = []
        this.archivo = new Archivo(archivo)
        
    }
    async save(objeto){
        try{
            await this.getAll().then(data => this.lastId = this.maxId())
            this.lastId++
            this.mensajes.push({...objeto, id: this.lastId})
            await this.archivo.escribir(this.mensajes)
            return this.lastId
        }catch(e){
            console.error("Se re pico", e)
        }  
    }

    maxId(){
        return Math.max(...this.mensajes.map(item => item?.id || 1)) 
    }
    async getById(id){
        try{
            await this.getAll()
            let variable = this.mensajes.find(item => item.id == id) || false
            if(!variable) throw new Error("no se encontro el producto")
            return variable
        }catch(e){
            throw new Error("no se encontro el producto")
        }
        
    }
    async getAll(){
        this.mensajes = JSON.parse(await this.archivo.check())
        return this.mensajes
    }
    async deleteById(id){
        try{
            await this.getAll()
            let index = this.mensajes.findIndex(item => item.id == id)
            if(index == -1) {
                throw new Error("el producto no existe")
            }
            
            this.mensajes.splice(index, 1);
            await this.archivo.escribir(this.mensajes)
        }catch(e){
            throw new Error("el producto no existe")
        }  
    }
    async deleteAll(){
        await this.getAll()
        this.mensajes = []
        await this.archivo.escribir(this.mensajes)
    }
    async getRandom(){
        await this.getAll()
        let idDisponibles = this.mensajes.map(producto => producto.id)
        return await this.getById(idDisponibles[Math.floor(Math.random() * idDisponibles.length)]);
    }
    async updateById(id, obj){
        try{
            await this.getAll()
            let index = this.mensajes.findIndex(item => item.id == id)
            if (index == -1) throw new Error("El producto no existe")
            this.mensajes[index] = {
                nombre: obj.nombre,
                uri: obj.uri,
                precio: obj.precio,
                id: parseInt(id)
            }
            await this.archivo.escribir(this.mensajes) 
        }catch(e){
            throw new Error(e.message)
        }
           
    }
}

module.exports = ContenedorMensajes












