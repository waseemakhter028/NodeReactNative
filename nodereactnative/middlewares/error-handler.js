// Error response middleware for 404 not found.
exports.notFound = (req, res) => {
  res.status(404).json({
    error: {
      code: 404,
      message: 'page not found'
    }
  })
}

// Method not allowed error middleware.
exports.methodNotAllowed = (req, res) => {
  res.status(405).json({
    error: {
      code: 405,
      message: 'Method not allowed'
    }
  })
}

// Generic error response middleware for validation and internal server errors.
exports.genericErrorHandler = (err, req, res) => {
  let error
  console.log(err.message)

  if (err.isJoi) {
    // Validation error
    error = {
      code: 400,
      message: 'validation error',
      details: err.details
        ? err.details.map((e) => ({ message: e.message, param: e.path.join('.') }))
        : err.errors.map((e) => e.messages.join('. ')).join(' and ')
    }
  } else if (err.status === undefined && err?.response?.data) {
    ({ error } = err.response.data)
  } else if (err.status === 405) {
    error = {
      code: err.status,
      message: 'method not allowed',
      lineNumber: err.stack
    }
  } else if (err.status < 500) {
    error = {
      code: err.status,
      message: err.message,
      lineNumber: err.stack
    }
  } else {
    // Return INTERNAL_SERVER_ERROR for all other cases
    error = {
      code: 500,
      message: err.message,
      lineNumber: err.stack
    }
  }

  if (process.env.NODE_ENV === 'production') {
    error = {
      code: error.code,
      message: 'something is wrong'
    }
  }

  res.status(error.code).json({ error })
}
