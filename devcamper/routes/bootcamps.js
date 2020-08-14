const express = require("express");
// load controllers
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deletedBootcamp,
  getBootCampsInRadius,
} = require("../controllers/bootcamps");

// include other resource routers
const courseRouter = require("./courses");

const router = express.Router();
// Re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);
router.route("/").get(getBootcamps).post(createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deletedBootcamp);

module.exports = router;
