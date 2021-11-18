const fs = require('fs').promises



function sinoexistecrear(nombre){
    try{
        return fs.readFileSync(nombre, 'utf-8')
    }catch(e){
        console.log("el archivo no existe, creando...")
        try{
            fs.writeFileSync(nombre, "Tu Vieja", "utf-8")
        }catch(e){
            console.log("el archivo no se pudo crear", e)
        }
    }    
}

console.log(sinoexistecrear("archivo.txt"))