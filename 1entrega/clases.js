class Usuario {
    constructor(nombre, apellido){
        this.nombre = nombre
        this.apellido = apellido
        this.libros = []
        this.mascotas = []
    }

    getFullName = () => `${this.nombre} ${this.apellido}`

    addMascota = (nombre) => this.mascotas.push(nombre)

    countMascotas = () => this.mascotas.length

    addBook = (nombre, autor) => this.libros.push({nombre, autor})

    getBookNames = () => this.libros.map( libro => libro.nombre)

}

let usuario1 = new Usuario("Mariano", "Cortina")

usuario1.addMascota("perro")
usuario1.addMascota("gato")

usuario1.addBook("El señor de los anillos", "tolkien")
usuario1.addBook("El señor de los anillos 2", "tolkien too")

console.log(usuario1.getFullName())
console.log(usuario1.countMascotas())
console.log(usuario1.getBookNames())