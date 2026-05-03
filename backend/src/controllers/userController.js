import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import crypto from 'crypto';
import { sendVerificationEmail, sendResetPasswordEmail } from '../services/emailService.js';

const storage = multer.memoryStorage();
export const uploadAvatar = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    }
});

export const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'El email ya está registrado' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await prisma.user.create({
            data: {
                email, name,
                password: hashedPassword,
                verificationToken,
                emailVerified: false
            },
            select: { id: true, email: true, name: true }
        });

        await sendVerificationEmail(email, name, verificationToken);

        res.status(201).json({
            message: 'Cuenta creada. Revisa tu email para verificarla.',
            user
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user){
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        if (!user.emailVerified) {
            return res.status(401).json({ 
                error: 'Debes verificar tu email antes de iniciar sesión' 
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar
            },
            token
        });

    }catch(error){
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await prisma.user.findFirst({ where: { verificationToken: token } });
        if (!user) return res.status(400).json({ error: 'Token inválido o expirado' });

        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true, verificationToken: null }
        });

        res.json({ message: 'Email verificado correctamente' });
    } catch {
        res.status(500).json({ error: 'Error al verificar email' });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.json({ message: 'Si el email existe, recibirás un enlace.' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry }
        });

        await sendResetPasswordEmail(email, user.name, resetToken);

        res.json({ message: 'Si el email existe, recibirás un enlace.' });
    } catch {
        res.status(500).json({ error: 'Error al procesar solicitud' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() }
            }
        });

        if (!user) return res.status(400).json({ error: 'Token inválido o expirado' });

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
        });

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch {
        res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: {
                        following: true,
                        followedBy: true,
                        trips: true
                    }
                }
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el perfil" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        let avatarUrl = avatar;

        if (req.file) {
            avatarUrl = await uploadToCloudinary(
                req.file.buffer,
                `users/${req.userId}/avatar`
            );
        }

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: {
                ...(name && { name }),
                ...(avatarUrl !== undefined && { avatar: avatarUrl })
            },
            select: { id: true, name: true, email: true, avatar: true, role: true }
        });
        res.json({ user });
    } catch {
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
};

export const logout = async(req, res)=> {
    res.json({ message: 'Logout exitoso' });
}

export const followUser = async (req, res) => {
    try {
        const { userIdToFollow } = req.params;
        const currentUserId = req.userId;

        if (userIdToFollow === currentUserId) return res.status(400).json({ error: "No puedes seguirte" });

        await prisma.user.update({
            where: { id: currentUserId },
            data: { following: { connect: { id: userIdToFollow } } }
        });

        const follower = await prisma.user.findUnique({ where: { id: currentUserId } });
        await createNotification(userIdToFollow, "FOLLOW", `${follower.name} ha empezado a seguirte.`);

        const followerCount = await prisma.user.findUnique({
            where: { id: userIdToFollow },
            select: { _count: { select: { followedBy: true } } }
        });
        if (followerCount._count.followedBy >= 10) {
            await awardBadge(userIdToFollow, 'SOCIAL');
        }

        res.json({ message: "Usuario seguido correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al seguir" });
    }
};

export const getMyFollowers = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                followedBy: { select: { id: true, name: true, avatar: true } }
            }
        });
        res.json({ followers: user.followedBy });
    } catch {
        res.status(500).json({ error: 'Error al obtener seguidores' });
    }
};

export const getMyFollowingList = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                following: { select: { id: true, name: true, avatar: true } }
            }
        });
        res.json({ following: user.following });
    } catch {
        res.status(500).json({ error: 'Error al obtener siguiendo' });
    }
};

const createNotification = async (userId, type, content) => {
    await prisma.notification.create({
        data: { userId, type, content }
    });
};

export const unfollowUser = async (req, res) => {
    try {
        const { userIdToUnfollow } = req.params;
        const currentUserId = req.userId;

        await prisma.user.update({
            where: { id: currentUserId },
            data: {
                following: {
                    disconnect: { id: userIdToUnfollow }
                }
            }
        });

        res.json({ message: "Has dejado de seguir al usuario correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al dejar de seguir al usuario" });
    }
};

export const getMyFollowing = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { following: { select: { id: true } } }
        });
        res.json({ followingIds: user.following.map(u => u.id) });
    } catch {
        res.status(500).json({ error: 'Error al obtener siguiendo' });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener notificaciones" });
    }
};

export const markNotificationsRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.userId, read: false },
            data: { read: true }
        });
        res.json({ message: "Notificaciones marcadas como leídas" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar notificaciones" });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const userId = req.userId;

        const [trips, savedTrips, badges, following, followedBy] = await Promise.all([
            prisma.trip.findMany({
                where: { userId },
                include: { flights: true }
            }),
            prisma.savedTrip.count({ where: { userId } }),
            prisma.badge.findMany({ where: { userId }, orderBy: { earnedAt: 'desc' } }),
            prisma.user.findUnique({ where: { id: userId }, select: { _count: { select: { following: true, followedBy: true } } } })
        ]);

        const countries = [...new Set(trips.map(t => t.country).filter(Boolean))];

        const totalFlights = trips.reduce((acc, t) => acc + t.flights.length, 0);
        const estimatedKm = totalFlights * 1200;

        const totalBudget = trips.reduce((acc, t) => acc + (t.budget || 0), 0);

        res.json({
            trips: trips.length,
            countries: countries.length,
            countriesList: countries,
            savedTrips,
            badges,
            kmFlown: estimatedKm,
            totalBudget,
            following: following?._count?.following || 0,
            followedBy: following?._count?.followedBy || 0
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

export const getTripHistory = async (req, res) => {
    try {
        const trips = await prisma.trip.findMany({
            where: { userId: req.userId },
            orderBy: { startDate: 'desc' },
            include: {
                flights: true,
                hotels: true,
                _count: { select: { likes: true, reviews: true } }
            }
        });
        res.json({ trips });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};

export const getSavedTrips = async (req, res) => {
    try {
        const saved = await prisma.savedTrip.findMany({
            where: { userId: req.userId },
            include: {
                trip: {
                    include: {
                        user: { select: { name: true } },
                        _count: { select: { likes: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ trips: saved.map(s => s.trip) });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener viajes guardados' });
    }
};

export const awardBadge = async (userId, type) => {
    try {
        const existing = await prisma.badge.findFirst({ where: { userId, type } });
        if (!existing) {
            await prisma.badge.create({ data: { userId, type } });
        }
    } catch { }
};

export const checkAndAwardBadges = async (req, res) => {
    try {
        const userId = req.userId;

        const [trips, followerData] = await Promise.all([
            prisma.trip.findMany({ where: { userId }, select: { country: true, travelStyle: true, budget: true } }),
            prisma.user.findUnique({ where: { id: userId }, select: { _count: { select: { followedBy: true } } } })
        ]);

        const totalTrips = trips.length;
        const uniqueCountries = new Set(trips.map(t => t.country).filter(Boolean));
        const adventureTrips = trips.filter(t => t.travelStyle === 'Aventura').length;
        const hasBudgetTrip = trips.some(t => t.budget && t.budget < 500);
        const followerCount = followerData._count.followedBy;

        if (totalTrips >= 1) await awardBadge(userId, 'FIRST_TRIP');
        if (totalTrips >= 5) await awardBadge(userId, 'EXPLORER');
        if (uniqueCountries.size >= 10) await awardBadge(userId, 'NOMAD');
        if (adventureTrips >= 3) await awardBadge(userId, 'ADVENTURER');
        if (hasBudgetTrip) await awardBadge(userId, 'BUDGET_MASTER');
        if (followerCount >= 10) await awardBadge(userId, 'SOCIAL');

        const badges = await prisma.badge.findMany({ where: { userId } });
        res.json({ message: 'Insignias actualizadas', badges });
    } catch (error) {
        res.status(500).json({ error: 'Error al comprobar insignias' });
    }
};

export const getMyLikes = async (req, res) => {
    try {
        const likes = await prisma.tripLike.findMany({
            where: { userId: req.userId },
            select: { tripId: true }
        });
        res.json({ likedTripIds: likes.map(l => l.tripId) });
    } catch {
        res.status(500).json({ error: 'Error al obtener likes' });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) return res.json({ users: [] });

        const currentUser = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                following:  { select: { id: true } },
                followedBy: { select: { id: true } },
            }
        });

        const followingIds  = new Set(currentUser.following.map(u => u.id));
        const followerIds   = new Set(currentUser.followedBy.map(u => u.id));

        const mutualIds = [...followingIds].filter(id => followerIds.has(id));

        const users = await prisma.user.findMany({
            where: {
                id: { in: mutualIds }, 
                OR: [
                    { name:  { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                ]
            },
            select: { id: true, name: true, email: true, avatar: true },
            take: 10
        });

        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar usuarios' });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                avatar: true,
                createdAt: true,
                trips: {
                    where: { isPublic: true },
                    select: {
                        id: true,
                        destination: true,
                        country: true,
                        startDate: true,
                        endDate: true,
                        budget: true,
                        travelStyle: true,
                        coverImage: true,
                        isPublic: true,
                        _count: { select: { likes: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                badges: {
                    select: { type: true, earnedAt: true }
                },
                _count: {
                    select: {
                        followedBy: true,
                        following: true,
                        trips: true
                    }
                },
                followedBy: {
                    select: { id: true, name: true, avatar: true }
                },
                following: {
                    select: { id: true, name: true, avatar: true }
                },
            }
        });

        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json(user);
    } catch (error) {
        console.error('Error en getPublicProfile:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};