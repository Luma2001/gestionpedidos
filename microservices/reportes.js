const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pedido = require('../models/pedido');

const app = express(); //creo servidor
app.use(cors());
app.use(express.json()); //middleware para parsear JSON

mongoose.connect('mongodb+srv://lumaqui2001_db_user:yISyPhP4AEqypidH@logisticacluster.z72txom.mongodb.net/?appName=logisticaCluster')
.then(() => console.log("✅ Conectado a MongoDB Atlas desde Reportes"))
.catch(err => console.error("❌ Error de conexión desde Reportes:", err));

app.get('/reportes', async (req, res) => {
  const totalPedidos = await Pedido.countDocuments(); //cuenta todos los pedidos
  const pendientes = await Pedido.countDocuments({ estado: 'pendiente' });//cuenta los pendientes
  res.json({ totalPedidos, pendientes });//devuelve JSON con los datos
});

app.listen(8080, () => {
  console.log('Microservicio de Reportes de Pedidos Totales y Pendientes en http://localhost:8080');
});

/*
Este microservicio:
1. Se conecta a tu base de datos.
2. Expone una ruta `/reportes`.
3. Devuelve estadísticas simples: total de pedidos y cuántos están pendientes.
4. Corre de forma independiente en el puerto 6000.
*/