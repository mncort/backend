let socket = io();

socket.on('recienConectado', (data) => {
  renderTable(data)
})

socket.on('productos', (data) => {
  renderTable(data)
});

const enviar = (e) => {
  e.preventDefault()
  let [inputs, valores] =[ [...e.target.form], {} ]
  inputs.forEach(input => (input.name !="") && (valores[input.name] = input.value) )
  socket.emit('new-product', valores)
  e.target.form.reset()
}

const eliminar = (id) => {
  socket.emit('eliminar', id)
}


const renderTable = (data) => {
  let productos = document.getElementById("productos")
  productos.innerHTML = data.map(
    producto => 
      `<tr>
          <th scope='row'>${producto.id}</th>
          <td> ${producto.nombre}</td>
          <td> ${producto.precio}</td>
          <td> ${producto.uri}</td>
          <td> <button onclick='eliminar(${producto.id})'>eliminar</button></td>
      </tr>`
    ).join("")
}

const envMensaje = (e) => {
  e.preventDefault()
  let mensaje = {
    texto: document.getElementById('chatMensaje').value,
    usuario: document.getElementById('chatUsuario').value
  }
 
  socket.emit('new-mensaje', mensaje)
  document.getElementById('chatMensaje').value = ""
}

socket.on('mensajes', (data) => {
  renderMensajes(data)
})

const renderMensajes = (mensajes) => {

  console.log(mensajes)
  document.getElementById('chat').innerHTML = mensajes.map( mensaje => 
    `<tr>
      <td class="col-2"> ${new Date(mensaje.date).toISOString().substring(0, 19).replace("T", " ")}</td>
      <td class="col-1"> ${mensaje.usuario}</td>
      <td class="col-9"> ${mensaje.texto}</td>
    </tr>`
  ).join("")
}