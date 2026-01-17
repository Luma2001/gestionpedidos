
//Importar la biblioteca Mongoose
//Permite definir esquemas, modelos y conectar a MongoDB desde Node.js
const mongoose = require('mongoose');

//Schema: para definir la estructura de los documentos
//que se guardaran en la colección pedidos
//es como decir cada pedido debe tener estos campos
//vamos a definir arrays embebidos para que el pedido
//pueda contener múltiples productos

//Schema para los productos dentro de un pedido
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true},
  cantidad: { type: Number, required: true},
  unidad: { 
    type: String, 
    enum: ["unidades", "kg", "g", "litros", "ml", "paquetes", "cajas"], 
    default: "unidades"
  },
  estado: { type: String, enum: ["pendiente", "comprado"], default: "pendiente" },
});

//Schema principal para el pedido
const pedidoSchema = new mongoose.Schema({
  para: { type: String, required: true }, // destino del pedido 
  productos: [productoSchema], // lista de productos 
  estado: { type: String, enum: ["pendiente", "finalizado"], default: "pendiente", }, 
  fecha: { type: Date, default: Date.now },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },//referencia al usuario que creó el pedido 
});


//Model: crea un modelo basado en el esquema definido "pedidoSchema"
//El modelo es una clase que se utiliza para crear y leer documentos
//de la colección pedidos en la base de datos
//Lo exporta para que pueda usarse en otros archivos (`require('./models/pedido')`).

module.exports = mongoose.model('Pedido', pedidoSchema);


/*
Este código define un modelo de datos para MongoDB 
usando Mongoose, que es una biblioteca de Node.js  
que facilita trabajar con MongoDB.
Este archivo define cómo se guarda un **pedido** 
en MongoDB, qué campos tiene, qué tipos de datos 
acepta, y qué valores se asignan por defecto. 
Es el corazón del backend: sin este modelo, 
no podríamos guardar ni consultar pedidos
correctamente.
*/