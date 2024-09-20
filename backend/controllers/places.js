const router = require('express').Router();
const db = require("../models");
// const jwt = require('jsonwebtoken');

const { Place, Comment, User } = db;

// Middleware to set currentUser from JWT
router.use(async (req, res, next) => {
    req.currentUser = null;
    try {
        const [method, token] = req.headers.authorization?.split(' ') || [];
        if (method === 'Bearer') {
            const result = await jwt.verify(token, process.env.JWT_SECRET);
            const { id } = result;
            req.currentUser = await User.findOne({ where: { userId: id } });
        }
    } catch (err) {
        // Handle token verification error or user not found
    }
    next();
});

router.post('/', async (req, res) => {
    if(req.currentUser?.role !== 'admin'){
        return res.status(403).json({ message: 'You are not allowed to add a place'});
    }

    if (!req.body.pic) {
        req.body.pic = 'http://placekitten.com/400/400';
    }
    if (!req.body.city) {
        req.body.city = 'Anytown';
    }
    if (!req.body.state) {
        req.body.state = 'USA';
    }
    const place = await Place.create(req.body);
    res.json(place);
});

router.get('/', async (req, res) => {
    const places = await Place.findAll();
    res.json(places);
});

router.get('/:placeId', async (req, res) => {
    let placeId = Number(req.params.placeId);
    if (isNaN(placeId)) {
        return res.status(404).json({ message: `Invalid id "${placeId}"` });
    }

    const place = await Place.findOne({
        where: { placeId: placeId },
        include: {
            association: 'comments',
            include: 'author'
        }
    });

    if (!place) {
        return res.status(404).json({ message: `Could not find place with id "${placeId}"` });
    }

    res.json(place);
});

router.put('/:placeId', async (req, res) => {
    if(req.currentUser?.role !== 'admin'){
        return res.status(403).json({ message: 'You are not allowed to edit places'});
    }

    let placeId = Number(req.params.placeId);
    if (isNaN(placeId)) {
        return res.status(404).json({ message: `Invalid id "${placeId}"` });
    }

    const place = await Place.findOne({ where: { placeId: placeId } });
    if (!place) {
        return res.status(404).json({ message: `Could not find place with id "${placeId}"` });
    }

    Object.assign(place, req.body);
    await place.save();
    res.json(place);
});

router.delete('/:placeId', async (req, res) => {
    if(req.currentUser?.role !== 'admin'){
        return res.status(403).json({ message: 'You are not allowed to delete places'});
    }

    let placeId = Number(req.params.placeId);
    if (isNaN(placeId)) {
        return res.status(404).json({ message: `Invalid id "${placeId}"` });
    }

    const place = await Place.findOne({ where: { placeId: placeId } });
    if (!place) {
        return res.status(404).json({ message: `Could not find place with id "${placeId}"` });
    }

    await place.destroy();
    res.json(place);
});

router.post('/:placeId/comments', async (req, res) => {
    const placeId = Number(req.params.placeId);

    req.body.rant = req.body.rant ? true : false;

    const place = await Place.findOne({ where: { placeId: placeId } });
    if (!place) {
        return res.status(404).json({ message: `Could not find place with id "${placeId}"` });
    }

    if (!req.currentUser) {
        return res.status(401).json({ message: `You must be logged in to leave a rant or rave.` });
    }

    const comment = await Comment.create({
        ...req.body,
        authorId: req.currentUser.userId,
        placeId: placeId
    });

    res.send({
        ...comment.toJSON(),
        author: req.currentUser
    });
});

router.delete('/:placeId/comments/:commentId', async (req, res) => {
    let placeId = Number(req.params.placeId);
    let commentId = Number(req.params.commentId);

    if (isNaN(placeId)) {
        return res.status(404).json({ message: `Invalid id "${placeId}"` });
    } else if (isNaN(commentId)) {
        return res.status(404).json({ message: `Invalid id "${commentId}"` });
    }

    const comment = await Comment.findOne({
        where: { commentId: commentId, placeId: placeId }
    });

    if (!comment) {
        return res.status(404).json({ message: `Could not find comment with id "${commentId}" for place with id "${placeId}"` });
    }

    if (comment.authorId !== req.currentUser?.userId) {
        return res.status(403).json({ message: `You do not have permission to delete comment "${comment.commentId}"` });
    }

    await comment.destroy();
    res.json(comment);
});

router.get('/profile', async (req, res) => {
    if (req.currentUser) {
        res.json(req.currentUser);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

module.exports = router;
