const express = require('express');
const app = express();
const cors = require('cors');
const Pedido = require('../models/pedido');

app.use(cors());
app.use(express.json());


//Definimos una ruta POST en /notify para recibir
//notificaciones de nuevos pedidos
app.post('/notificaciones', (req, res) => {
  const { cliente, producto } = req.body;
  console.log(`📩 Notificación: Pedido de ${producto} para ${cliente}`);
  res.json({ mensaje: 'Notificación enviada' });
});


app.listen(5000, () => {
  console.log('Microservicio de Notificaciones en http://localhost:5000');
});

/*
Este código crea un **microservicio independiente** 
que:
1. Escucha peticiones POST en `/notify`.
2. Recibe datos de un pedido (cliente y producto).
3. Simula enviar una notificación imprimiendo un 
mensaje en consola.
4. Devuelve una respuesta JSON confirmando la acción.
*/
