const BootCampModel = require("../models/bootcamps");
const ErrorResponse = require("../utils/errorResponse");
/**
 * @ desc ->  get all bootcamps
 * @ route -> GET /api/v1/bootcamps
 * @ access - public
 */

const getBootcamps = async (req, res) => {
  try {
    const bootcamps = await BootCampModel.find();
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @ desc ->  get single bootcamps
 * @ route -> GET /api/v1/bootcamps/:id
 * @ access - public
 */

const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCampModel.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    // res.status(400).json({
    //   success: false,
    // });
    next(error);
  }
};

/**
 * @ desc ->  create bootcamps
 * @ route -> POST /api/v1/bootcamps/
 * @ access - private
 */

const createBootcamp = async (req, res, next) => {
  //console.log(req.body);
  try {
    const bootcamp = await BootCampModel.create(req.body);
    res.status(200).json({
      success: true,
      msg: "create new bootcamp",
      data: bootcamp,
    });
  } catch (err) {
    next(err);

    console.log(err);
  }
};

/**
 * @ desc ->  update bootcamps
 * @ route -> PUT /api/v1/bootcamps/:id
 * @ access - private
 */

const updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCampModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @ desc ->  deleted bootcamps
 * @ route -> DELETE /api/v1/bootcamps/:id
 * @ access - private
 */

const deletedBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCampModel.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deletedBootcamp,
};
