import React, { useState } from 'react';

const AdvancedFilter = ({ data, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Extract unique categories from data
  const categories = ['all', ...new Set(data.map(item => item.category).filter(Boolean))];
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    applyFilters(e.target.value, selectedCategory);
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    applyFilters(searchTerm, e.target.value);
  };
  
  const applyFilters = (search, category) => {
    let filteredData = [...data];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(item => 
        Object.values(item).some(val => 
          val && val.toString().toLowerCase().includes(searchLower)
        )
      );
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      filteredData = filteredData.filter(item => item.category === category);
    }
    
    onFilterChange(filteredData);
  };
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search in data..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="md:w-1/4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter; 