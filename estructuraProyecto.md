/logistica-node
  /server.js         -> servidor principal con express, port 4000
  /routes/pedidos.js -> rutas CRUD de pedidos
  /microservices
    /notificaciones.js -> microservicio de notificaciones, port 5000
    /reportes.js     -> microservicio de reportes, port 6000
  /models/pedido.js  -> esquema de pedidos (Mongoose)



Resultado esperado:
Servidor principal en http://localhost:4000/api/pedidos con CRUD completo.

Microservicio de notificaciones en http://localhost:5000/notify.

Microservicio de reportes en http://localhost:6000/reportes.