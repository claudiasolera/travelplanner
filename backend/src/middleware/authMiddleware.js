// Este archivo sirve para proteger las rutas de la API y permitir el acceso solo a usuarios autenticados mediante JWT (JSON Web Token)

import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    try{
        // obtener token del header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; //Bearer TOKEN --> el JWT (JSON Web Token) que el usuario tiene para demostrar que está autenticado
        
        if(!token){
            return res.status(401).json({
                error: 'No se proporcionó token de autenticación'
            });
        }

        // verificar token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            // si el token es inválido
            if(err){
                return res.status(403).json({
                    error: 'Token inválido o expirado'
                });
            }

            // agregar userId al request para usarlo en las rutas protegidas
            req.userId = decoded.userId;
            req.userEmail = decoded.email;
            next();
        });

    }catch(error){
        console.error('Error en autentucación:', error);
        res.status(500).json({ error: 'Error al verificar autentucación '});
    }
};


export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        req.userId = null;
        return next();
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id || decoded.userId;
    } catch {
        req.userId = null;
    }
    next();
};
