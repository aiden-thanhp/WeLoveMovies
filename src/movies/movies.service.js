const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
})

function list() {
    return knex("movies").select("*");
}

function listShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .distinct("m.*")
        .where({ "mt.is_showing": true })
        .orderBy("m.movie_id");
}

function read(movieId) {
    return knex("movies").select("*").where({ "movie_id": movieId }).first();
}

function listTheaters(movieId) {
    return knex("theaters as t")
        .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
        .select("t.*", "mt.movie_id", "mt.is_showing")
        .where({ "mt.movie_id": movieId });
}

function listReviews(movieId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({ "r.movie_id": movieId })
        .then(reviews => reviews.map(review => addCritic(review)));
};

module.exports = {
    list,
    listShowing,
    read,
    listTheaters,
    listReviews
}