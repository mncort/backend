const BBDD = require('./BBDDconect')

class Contenedor {
    constructor(archivo){
        this.lastId = 0
        this.productos = []
        this.archivo = new BBDD(archivo)
        
    }
    async save(objeto){
        try{
            let [producto] = await this.archivo.escribir(objeto)
            return producto
        }catch(e){
            console.error("Se re pico", e)
        }  
    }

    maxId(){
        return Math.max(...this.productos.map(item => item?.id || 1)) 
    }
    async getById(id){
        try{
            let variable = await this.archivo.getById(id)
            if(variable.length == 0) throw new Error("no se encontro el producto")
            return variable
        }catch(e){
            throw new Error("no se encontro el producto")
        }
        
    }
    async getAll(){
        this.productos = await this.archivo.traerTodos()
        console.log(this.productos)
        return this.productos
    }
    async deleteById(id){
        try{
            await this.getAll()
            let index = this.productos.findIndex(item => item.id == id)
            if(index == -1) {
                throw new Error("el producto no existe")
            }
            await this.archivo.deleteById(id)
            await this.getAll()
        }catch(e){
            throw new Error("el producto no existe")
        }  
    }

    async deleteAll(){
        await this.archivo.vaciarTabla()
        return await this.getAll()
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

module.exports = Contenedor












