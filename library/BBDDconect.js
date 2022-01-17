class BBDDconect{
    constructor(nombre){
        this.knex
        this.nombre = nombre
        this.data
        this.conect()
    }
    conect(){
        this.knex = require('knex')({
            client: 'mysql',
            connection: {
                host: 'localhost',
                user: 'root',
                password: 'facundo1234',
                database: 'BACKCODER',
            },
            pool: {
                min: 0,
                max: 7,
            }
        })
    }

    async guardar(contenido){
        await this.check().finally(() => {
            this.agregarAlArchivo(contenido)
            console.log("Se agrego el contenido al archivo")
          })
    }
    
    async check(){
        try{
            return await this.knex(this.nombre)
        }catch(e){
            return await this.knex.schema.createTable(this.nombre, (table) => {
                table.increments('id'),
                table.string('nombre'),
                table.integer('precio'),
                table.string('uri')
              })
        }   
    }

    async crearTabla(contenido){
        return await this.knex(this.nombre).insert(contenido)
    }

    async vaciarTabla(){
        return await this.knex(this.nombre).truncate()
    }

    async escribir(contenido){
        return await this.knex(this.nombre).insert(contenido)
    }

    async traerTodos(){
        return await this.knex(this.nombre).select('*')
    }

    async getById(id){
        this.productos = await this.knex(this.nombre).where({ id: id })
        return this.productos
    }

    async deleteById(id){
        this.productos = await this.knex(this.nombre).where({ id: id }).del()
        return this.productos
    }

    agregarAlArchivo(contenido){
        fs.appendFile(this.nombre, JSON.stringify(contenido) + ",\n" , "utf8")
    }

}

module.exports = BBDDconect