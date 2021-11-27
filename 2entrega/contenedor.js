const Archivo = require('./archivo')

class Contenedor {
    constructor(archivo){
        this.lastId = 0
        this.productos = []
        this.archivo = new Archivo(archivo)
        this.getAll().then(data => this.lastId = this.maxId())
    }
    async save(objeto){
        try{
            await this.getAll()
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
        await this.getAll()
        return await this.productos.find(item => item.id == id)
    }
    async getAll(){
        this.productos = JSON.parse(await this.archivo.check())
        return this.productos
    }
    async deleteById(id){
        try{
            await this.getAll()
            let index = this.productos.findIndex(item => item.id == id)
            this.productos.splice(index, 1);
            await this.archivo.escribir(this.productos)
        }catch(e){
            console.error("Se re pico", e)
        }  
    }
    async deleteAll(){
        await this.getAll()
        this.productos = []
        await this.archivo.escribir(this.productos)
    }
}

const test = async () => {

    let archivito = new Contenedor("test.JSON")

    await archivito.save({
        nombre: 'mandarina', 
        URL: 'No la se', 
        precio: 450,
    }).then(resp => console.log("elemento guardado: \n", resp))

    await archivito.getById(3).then(resp => console.log("objeto encontrado: \n", resp))
    
    await archivito.getAll().then(resp => console.log("El archivo contiene: \n", resp))

    await archivito.deleteById(3).then(console.log("elemento eliminado\n"))

    await archivito.getAll().then(resp => console.log("El archivo contiene: \n", resp))

    await archivito.deleteAll().then(console.log("Archivo formateado\n"))
    
}

console.log("Corriendo Test: \n")

test().then(resp => console.log("Test Finalizado"))











