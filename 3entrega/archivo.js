const fs = require('fs').promises

class Archivo{
    constructor(nombre){
        this.nombre = nombre
        this.data
    }

    async guardar(contenido){
        await this.check().finally(() => {
            this.agregarAlArchivo(contenido)
            console.log("Se agrego el contenido al archivo")
          })
    }
    
    async check(){
        try{
            return await fs.readFile(this.nombre, "utf8")
        }catch(e){
            return await this.escribir("")
        }   
    }

    async escribir(contenido){
        return await fs.writeFile(this.nombre, JSON.stringify(contenido), "utf8")
    }

    agregarAlArchivo(contenido){
        fs.appendFile(this.nombre, JSON.stringify(contenido) + ",\n" , "utf8")
    }

}

module.exports = Archivo