const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;

    const review = await service.read(reviewId);

    if (review) {
        res.locals.review = review;
        return next();
    }

    next({
        status: 404,
        message: "Review cannot be found."
    })
}

async function update(req, res) {
  const updatedReview = { ...res.locals.review, ...req.body.data };
  await service.update(updatedReview);
  const reviewToReturn = await service.getReviewWithCritic(
    res.locals.review.review_id
  );
  res.json({ data: reviewToReturn });
}

async function destroy(req, res, next) {
    await service.delete(res.locals.review.review_id);
    res.sendStatus(204);
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}