function notFound(req, res) {
  return res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  console.error(error);
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: "Please correct the highlighted information.", errors: error.errors });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with this value already exists." });
  }
  return res.status(error.statusCode || 500).json({ message: error.message || "An unexpected server error occurred." });
}

module.exports = { notFound, errorHandler };
