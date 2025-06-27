import React from 'react'

const Loading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-card overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-[4/3] bg-gray-200 shimmer" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded shimmer" />
              <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
            </div>
            
            {/* Badges */}
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded-full w-20 shimmer" />
              <div className="h-4 bg-gray-200 rounded w-24 shimmer" />
            </div>
            
            {/* Specifications */}
            <div className="grid grid-cols-2 gap-2">
              <div className="h-4 bg-gray-200 rounded shimmer" />
              <div className="h-4 bg-gray-200 rounded shimmer" />
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="h-3 bg-gray-200 rounded w-32 shimmer" />
              <div className="h-4 bg-gray-200 rounded w-4 shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading