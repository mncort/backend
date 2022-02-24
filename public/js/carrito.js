const getLocal = (key) => JSON.parse(localStorage.getItem(key)) 

const setLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data))

async function checkCarrito(e) {
    e.preventDefault()

    try{
        let respuesta = getLocal("idCarrito") || (await fetch( 
            `http://localhost:8080/api/carrito`,
            {
                method: 'POST',
            }
        ),
        console.log(respuesta.json()),
        setLocal("idCarrito", respuesta.json()))
        return respuesta
    }catch(e){
        console.error("a ocurrido un error", e)
        return 0
    }
   


}