//importamos express para crear rutas
//nos permite acceso a express.Router() 
// y a funciones get, post, put, delete
const express = require('express');

//importamos el modelo de Pedido definido
//permite interactuar con la colección de pedidos
//en MongoDB (crear, buscar, actualizar, eliminar)
const Pedido = require('../models/pedido');

//creamos un router para definir rutas relacionadas 
//con pedidos y luego montarlas en el servidor 
//principal con app.use('/api/pedidos', pedidosRouter);
const router = express.Router();



// Crear pedido: define la ruta POST
router.post('/', async (req, res) => {

  try { 
    console.log("📩 Body recibido:", req.body);
    const nuevoPedido = new Pedido({
      para: req.body.para,
      productos: req.body.productos,
      
    }); 
    await nuevoPedido.save(); 
    res.status(201).json(nuevoPedido);

    // 🔔 Disparar notificación al microservicio 
    await fetch('http://localhost:5000/notificaciones', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ para: nuevoPedido.para, fecha: nuevoPedido.fecha }) 
    }); 
    res.status(201).json(nuevoPedido); 
  } catch (err) { 
      console.error("❌ Error al crear pedido:", err); 
      res.status(500).json({ error: err.message }); 
  }


});

// Listar pedidos: define la ruta GET para listar 
// todos los pedidos
router.get('/',  async (req, res) => {
  const pedidos = await Pedido.find();//consulta todos los docs de la colección pedidos
  res.json(pedidos);
});

// Actualizar estado: define la ruta PUT para 
// actualizar un pedido por su ID
router.put('/:id', async (req, res) => {
  try{
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });//{new:true} actualiza y devuelve el doc ya modificado en la respuesta
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });//si no existe el pedido, devuelve error 404
    res.json(pedido);
  }catch(err){
    res.status(500).json({ error: err.message });
  } 
});

// Eliminar pedido: define la ruta DELETE para 
// eliminar un pedido por su ID
router.delete('/:id', async (req, res) => {
  try {
    const pedido=await Pedido.findByIdAndDelete( req.params.id );// 👈 solo borra si pertenece al usuario
    if(!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });//si no existe el pedido, devuelve error 404
    res.json({ mensaje: 'Pedido eliminado' });//res.json confirma la eliminación con un mensaje JSON  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
});

module.exports = router;//exportamos para poder utilizarlo en el servidor principal
