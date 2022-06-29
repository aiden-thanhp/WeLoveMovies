const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
    if (req.query) {
        res.json({ data: await service.listShowing() });
    }
    res.json({ data: await service.list() });
}

async function movieExists(req, res, next) {
    const { movieId } = req.params;

    const movie = await service.read(movieId);

    if (movie) {
        res.locals.movie = movie;
        return next();
    }

    next({
        status: 404,
        message: "Movie cannot be found."
    });
}

async function read(req, res, next) {
    const { movie } = res.locals;
    res.json({ data: movie })
}

async function readTheaters(req, res, next) {
    const movieId = res.locals.movie.movie_id;
    res.json({ data: await service.listTheaters(movieId) });
};

async function readReviews(req, res, next) {
    const movieId = res.locals.movie.movie_id;
    res.json({ data: await service.listReviews(movieId) });
};

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), read],
    readTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readTheaters)],
    readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)],
};