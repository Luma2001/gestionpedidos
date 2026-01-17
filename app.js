//Definimos constante URL de la API
  const API_URL = "http://localhost:4000/api/pedidos";

//Definimos constante REPORTES_URL de microservicio de reportes
  const REPORTES_URL = "http://localhost:8080/reportes";

//obtenemos ul donde se listan los productos del pedido
  const listaProducto = document.getElementById("productosDelPedido");
  listaProducto.innerHTML= "";//limpia la lista para evitar duplicados antes de volver a renderizar

//obtenemos el contenedor de cards
  const listaPedidos = document.getElementById("listaDePedidos");
  


//Creamos función para agregar productos al pedido
  function agregarProducto() {
    //obtenemos valores de los inputs del producto
    const nombre = document.getElementById("nombre").value;
    const cantidad = document.getElementById("cantidad").value;
    const unidad = document.getElementById("unidad").value;

    
    //creamos elemento li 
    const li = document.createElement("li"); 
    li.innerHTML = `<span class="productoTexto">${nombre} (${cantidad} ${unidad})</span><button title="Eliminar producto" onclick="eliminarProducto(this)">✖️</button>`;//asigna contenido al li con botón para eliminar
    listaProducto.appendChild(li);//agrega el li a la lista ul  
    verificarSiHayProductos();
  
  
  // ✅ Limpiar solo los inputs de producto 
  document.getElementById("nombre").value = ""; 
  document.getElementById("cantidad").value = ""; 
  document.getElementById("unidad").value = "";

  
}

//Creamos función para eliminar el producto del pedido con en el botón ✖️
  function eliminarProducto(button) {
    button.parentElement.remove();
    verificarSiHayProductos()
  };

// función para actualizar estado del pedido
  async function cambiarEstado(id, spanElemento) { 
    const estadoActual = spanElemento.textContent.trim().toLowerCase(); 
    const nuevoEstado = estadoActual === "pendiente" ? "finalizado" : "pendiente";

    try{
      const res =await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })//cambia estado a entregado
      });

      if(res.ok){
        spanElemento.textContent = nuevoEstado;//actualiza texto en la tarjeta
        spanElemento.style.color = nuevoEstado === "finalizado" ? "orange" : "green";
      }else{
        console.error("❌ Error al cambiar el estado: ", res.statusText);
      }

        cargarReportes(); // refrescar contadores};
    } catch (error) {
      console.error("❌ Error al cambiar el estado:", error);
    }


  }  

//Función para tachar producto comprado
  function toggleTachado(elemento){
    elemento.classList.toggle("tachado");
  }  

//Función para eliminar pedido
  async function eliminarPedido(id, cardElement) {
    const confirmar = confirm("¿Estás seguro que quieres eliminar este pedido?"); 
    if (!confirmar) return; // si cancela, no hace nada

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        // ✅ eliminamos visualmente la tarjeta del DOM 
        cardElement.remove(); 
        //refrescamos contadores globales 
        cargarPedidos();
        cargarReportes();
      } else {
        console.error("❌ Error al eliminar pedido:", res.statusText);
      }
    } catch (error) {
      console.error("❌ Error de conexión:", err);
    }

  }

//Función para mostrar imagen sin productos
  function verificarSiHayProductos() {
    const sinProductos = document.getElementById("sin_productos");
    if(listaProducto.children.length === 0){
      sinProductos.style.display = "block";
    }else{
      sinProductos.style.display = "none";
    }
  }


//Creamos función asíncrona para cargar y mostrar pedidos creados en la página
  async function cargarPedidos() {

    
    try{
      const res = await fetch(API_URL);//hace pedido get a la API y obtiene todos los pedidos
      const pedidos = await res.json();

      const mensajeVacio = document.getElementById("lista_vacia");
      listaPedidos.innerHTML= "";//limpia el contenedor de cards para evitar duplicados antes de volver a renderizar

      if(pedidos.length === 0){
        mensajeVacio.style.display = "block";//muestra mensaje de vacío
      }else{
        mensajeVacio.style.display = "none";//oculta mensaje de vacío
        
        pedidos.forEach(p => {//recorre cada pedido(p)
          const tarjeta = document.createElement("div");//creo elemento
          tarjeta.className = "card";//asigno clase card al div

          //Generar lista de productos del pedido
          const listadoProductos = p.productos.map(prod=>`
            <li onclick="toggleTachado(this)">${prod.nombre} (${prod.cantidad} ${prod.unidad})</li>
          `).join('');

          //Calcular totales
          const totalProductos = p.productos.length;


          //Asigno contenido HTML a la tarjeta con los datos del pedido
          tarjeta.innerHTML = `   
                          <div class="headerCard">
                              <h3>- ${p.para}</h3>
                              <p><span onclick="cambiarEstado('${p._id}', this)">${p.estado}</span> ${new Date(p.fecha).toLocaleDateString()}</p>
                          </div>
                          <div class="mainCard">                
                              <ul class="listaPedidos">
                                  ${listadoProductos}
                              </ul>
                          </div>
                          <div class="footerCard">
                              <p>Total productos: <span id="totalProductos">${totalProductos}</span></p>
                              <button onclick="eliminarPedido('${p._id}', this.closest('.card'))">Eliminar Pedido</button>
                          </div>
          `;

          listaPedidos.appendChild(tarjeta);//agrego la tarjeta al contenedor de cards

        });
      }

    }catch (err) { console.error("❌ Error al cargar pedidos:", err); }
    
  }

//Creamos función para cargar reportes desde el microservicio de reportes
  async function cargarReportes() {
    const res = await fetch(REPORTES_URL);
    const data = await res.json();

    document.getElementById("total").textContent = data.totalPedidos;
    document.getElementById("pendientes").textContent = data.pendientes;
    document.getElementById("finalizados").textContent = data.totalPedidos - data.pendientes;
  }

//Creamos función que captura el evento submit del formulario
document.getElementById("nuevoPedido").addEventListener("submit", async e => {
  e.preventDefault();//evita recarga de página al enviar formulario
  
  const destino = document.getElementById("para").value;
  const productos = Array.from(document.querySelectorAll("#productosDelPedido li"))
                    .map(li => { 
                      const texto = li.querySelector(".productoTexto").textContent; 
                      const match = texto.match(/^(.+)\s\((\d+)\s(.+)\)$/); 
                      return { 
                        nombre: match[1], 
                        cantidad: parseInt(match[2]), 
                        unidad: match[3], 
                        estado: "pendiente" 
                      }; 
                    });


    await fetch(API_URL, {//hace un post a la API para crear un nuevo pedido
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ para:destino, productos:productos })//json con los datos del nuevo pedido
    });

    alert("✅ Pedido creado y notificación enviada");

    e.target.reset();//resetea el formulario
    listaProducto.innerHTML= "";
    cargarPedidos();//vuelve a cargar la lista de pedidos
    cargarReportes(); // refresca contadores
});


// Cargamos pedidos y reporte al iniciar
cargarPedidos();
cargarReportes();


