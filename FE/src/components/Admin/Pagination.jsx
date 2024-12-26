import React from 'react'
import { GrFormPrevious } from 'react-icons/gr'
import { GrFormNext } from 'react-icons/gr'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page) => {
    onPageChange(page)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    let startPage, endPage

    if (currentPage === 1) {
      startPage = 1
      endPage = Math.min(3, totalPages)
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2)
      endPage = totalPages
    } else {
      startPage = Math.max(1, currentPage - 1)
      endPage = Math.min(totalPages, currentPage + 1)
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`h-[32px] w-[32px] mx-1 flex items-center justify-center text-center rounded-full shadow-lg ${currentPage === i ? 'bg-accent text-white' : 'bg-secondary text-accent'}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>,
      )
    }
    return pageNumbers
  }

  return (
    <div className='h-14 flex justify-center items-center'>
      <button
        className='p-1 rounded-full text-accent hover:bg-secondary transition-all ease-in-out font'
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <GrFormPrevious size={24} />
      </button>
      {renderPageNumbers()}
      <button
        className='p-1 rounded-full  text-accent hover:bg-secondary transition-all ease-in-out font'
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <GrFormNext size={24} />
      </button>
    </div>
  )
}

export default Pagination
