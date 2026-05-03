import prisma from '../config/db.js';

export const getFavorites = async (req, res) => {
    try{
        const favourites = await prisma.favourite.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ favourites });
    } catch(error){
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({ error: 'Error al obtener favoritos' });
    }
};

export const addFavorite = async (req, res) => {
    try{
        const { type, itemId, data } = req.body;
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_type_itemId: {
                    userId: req.userId,
                    type,
                    itemId
                }
            }
        });

        if(existing){
            return res.status(400).json({ error: 'Ya está en favoritos' });
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId: req.userId,
                type,
                itemId,
                data
            }
        });

        res.status(201).json({
            message: 'Agregado a favoritos',
            favorite
        });

    }catch(error){
        console.error('Error al agregar a favoritos:', error);
        res.status(500).json({ error: 'Error al agregar a favoritos' });
    }
};

export const removeFavorite = async (req,res) => {
    try{
        const { id } = req.params;

        const favorite = await prisma.favorite.findUnique({
            where: { id }
        });

        if(!favorite) {
            return res.status(404).json({ error: 'Favorito no encontrado' });
        }

        if(favorite.userId !== req.userId){
            return res.status(403).json({ error: 'No tienes acceso a este favorito' });
        }
        
        res.json({ message: 'Elinado de favoritos correctamente' });
    }catch(error){
        console.error('Error al eliminar de favoritos:', error);
        res.status(500).json({ error: 'Error al eliminar de favoritos' });
    }
};