const BootCampModel = require("../models/bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geoCoder = require("../utils/geocoder");
/**
 * @ desc ->  get all bootcamps
 * @ route -> GET /api/v1/bootcamps
 * @ access - public
 */

const getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // copy of req.query
  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = BootCampModel.find(JSON.parse(queryStr));
  // Selected Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await BootCampModel.countDocuments();
  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootcamps = await query;

  //Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    pagination,
    count: bootcamps.length,
    data: bootcamps,
  });
});

/**
 * @ desc ->  get single bootcamps
 * @ route -> GET /api/v1/bootcamps/:id
 * @ access - public
 */

const getBootcamp = asyncHandler(async (req, res, next) => {
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
});

/**
 * @ desc ->  create bootcamps
 * @ route -> POST /api/v1/bootcamps/
 * @ access - private
 */

const createBootcamp = asyncHandler(async (req, res, next) => {
  //console.log(req.body);
  const bootcamp = await BootCampModel.create(req.body);
  res.status(200).json({
    success: true,
    msg: "create new bootcamp",
    data: bootcamp,
  });
});

/**
 * @ desc ->  update bootcamps
 * @ route -> PUT /api/v1/bootcamps/:id
 * @ access - private
 */

const updateBootcamp = asyncHandler(async (req, res, next) => {
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
});

/**
 * @ desc ->  deleted bootcamps
 * @ route -> DELETE /api/v1/bootcamps/:id
 * @ access - private
 */

const deletedBootcamp = asyncHandler(async (req, res, next) => {
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
});

/**
 * @ desc ->  Get bootcamps By Radius
 * @ route -> DELETE /api/v1/bootcamps/radius/:zipcode/:distance
 * @ access -> private
 */

const getBootCampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocode
  const loc = await geoCoder.geocode(zipcode);
  const lon = loc[0].latitude;
  const lng = loc[0].longitude;

  // cal radius using radians
  // Divide dist by radius of earth
  // Earth Radius = 3,963 mi / 6,38 km
  const radius = distance / 3963;
  const bootcamps = await BootCampModel.find({
    location: { $geoWithin: { $centerSphere: [[lon, lng], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deletedBootcamp,
  getBootCampsInRadius,
};
