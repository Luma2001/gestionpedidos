//Express: framework para crear servidores web y APIs REST
const express = require('express');

const mongoose = require('mongoose');

//Cargamos variables de entorno desde el archivo .env
require("dotenv").config();

//cors: Cross-Origin Resource Sharing
//Permite que mi API sea consumida desde aplicaciones
//que corren en otros dominios
const cors = require('cors');

//Importamos las rutas definidas en routes/pedidos.js
const pedidosRoutes = require('./routes/pedidos');

//Creamos instancia de express
//app es mi servidor web, acá vamos a configurar 
// middlewares y rutas
const app = express();

//Activamos middleware de CORS en el servidor 
// para que pueda recibir peticiones
app.use(cors());

//Middleware para parsear JSON, convierte el cuerpo
//de las peticiones en JSON
app.use(express.json());

// Conexión a MongoDB (Atlas)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.error("❌ Error de conexión:", err));


//Definimos las rutas para pedidos
app.use('/api/pedidos', pedidosRoutes);
/*
- Define que todas las rutas que empiezan con 
  `/api/pedidos` se manejen en el archivo 
  `routes/pedidos.js`.
- Ejemplo:
  - `GET /api/pedidos` → lista todos los pedidos.
  - `POST /api/pedidos` → crea un pedido.
  - `PUT /api/pedidos/:id` → actualiza un pedido.
  - `DELETE /api/pedidos/:id` → elimina un pedido.
*/

//Iniciamos el servidor en el puerto 4000
app.listen(4000, () => {
  console.log('Servidor corriendo en http://localhost:4000');
});
