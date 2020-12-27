import React from 'react'

export const Loader = () => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}