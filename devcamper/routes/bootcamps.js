const express = require("express");
// load controllers
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deletedBootcamp,
} = require("../controllers/bootcamps");
const router = express.Router();

router.route("/").get(getBootcamps).post(createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deletedBootcamp);

module.exports = router;
