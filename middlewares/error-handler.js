import HttpStatus from 'http-status'

// Error response middleware for 404 not found.
export const notFound = (req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({
    error: {
      code: HttpStatus.NOT_FOUND,
      message: 'page not found'
    }
  })
}

// Method not allowed error middleware.
export const methodNotAllowed = (req, res) => {
  res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
    error: {
      code: HttpStatus.METHOD_NOT_ALLOWED,
      message: HttpStatus[HttpStatus.METHOD_NOT_ALLOWED]
    }
  })
}

// Generic error response middleware for validation and internal server errors.
export const genericErrorHandler = (err, req, res) => {
  let error
  console.log(err.message)

  if (err.isJoi) {
    // Validation error
    error = {
      code: HttpStatus.BAD_REQUEST,
      message: HttpStatus[HttpStatus.BAD_REQUEST],
      details: err.details
        ? err.details.map((e) => ({ message: e.message, param: e.path.join('.') }))
        : err.errors.map((e) => e.messages.join('. ')).join(' and ')
    }
  } else if (err.status === undefined && err.response && err.response.data) {
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
      code: HttpStatus.INTERNAL_SERVER_ERROR,
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
