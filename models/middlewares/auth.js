const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = auth;


/*
1) jsonwebtoken: es la librería que sabe crear y verificar tokens JWT.

2)Definimos la función auth:

    Busca un token en los headers (Authorization).

    Si no hay token → corta y devuelve error 401.

    Si hay token → lo verifica con la clave secreta (process.env.JWT_SECRET).

    Si es válido → guarda el id del usuario en req.userId y deja pasar la petición.

    Si es inválido → devuelve error 401.

3) Exportamos la función para poder usarla en cualquier ruta.

*/