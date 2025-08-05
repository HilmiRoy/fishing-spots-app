import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilter, spots }) => {
    const [filters, setFilters] = useState({
        species: '',
        technique: '',
        bait: '',
        state: '',
        minRating: 0 // Added back
    });

    // Extract unique values from spots for dropdown options
    const getUniqueValues = (field) => {
        if (!spots || spots.length === 0) return [];
        const values = spots
            .map(spot => spot[field])
            .filter(value => value && value.trim() !== '')
            .map(value => value.toLowerCase().trim());
        return [...new Set(values)].sort();
    };

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            species: '',
            technique: '',
            bait: '',
            state: '',
            minRating: 0 // Added back
        };
        setFilters(emptyFilters);
        onFilter(emptyFilters);
    };

    const hasActiveFilters = () => {
        return filters.species || filters.technique || filters.bait || filters.state || filters.minRating > 0; // Added back rating check
    };

    return (
        <div className="filter-bar">
            <div className="filter-title">
                <h3>🔍 Filter Fishing Spots</h3>
                {hasActiveFilters() && (
                    <span className="active-filters-count">
                        {Object.values(filters).filter(val => val && val !== 0).length} active
                    </span>
                )}
            </div>
            
            <div className="filter-controls">
                {/* Species Filter */}
                <div className="filter-group">
                    <label>🐟 Species</label>
                    <select 
                        value={filters.species} 
                        onChange={e => handleFilterChange('species', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Species</option>
                        {getUniqueValues('species').map(species => (
                            <option key={species} value={species}>
                                {species.charAt(0).toUpperCase() + species.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Technique Filter */}
                <div className="filter-group">
                    <label>🎣 Technique</label>
                    <select 
                        value={filters.technique} 
                        onChange={e => handleFilterChange('technique', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Techniques</option>
                        {getUniqueValues('technique').map(technique => (
                            <option key={technique} value={technique}>
                                {technique.charAt(0).toUpperCase() + technique.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Bait Filter */}
                <div className="filter-group">
                    <label>🪱 Bait</label>
                    <select 
                        value={filters.bait} 
                        onChange={e => handleFilterChange('bait', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Baits</option>
                        {getUniqueValues('bait').map(bait => (
                            <option key={bait} value={bait}>
                                {bait.charAt(0).toUpperCase() + bait.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* State Filter */}
                <div className="filter-group">
                    <label>📍 State</label>
                    <select 
                        value={filters.state} 
                        onChange={e => handleFilterChange('state', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All States</option>
                        {getUniqueValues('state').map(state => (
                            <option key={state} value={state}>
                                {state.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rating Filter - RESTORED */}
                <div className="filter-group">
                    <label>⭐ Min Rating</label>
                    <select 
                        value={filters.minRating} 
                        onChange={e => handleFilterChange('minRating', Number(e.target.value))}
                        className="filter-select"
                    >
                        <option value={0}>Any Rating</option>
                        <option value={1}>1+ Stars</option>
                        <option value={2}>2+ Stars</option>
                        <option value={3}>3+ Stars</option>
                        <option value={4}>4+ Stars</option>
                        <option value={5}>5 Stars Only</option>
                    </select>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters() && (
                    <div className="filter-group">
                        <button 
                            onClick={clearFilters}
                            className="clear-filters-btn"
                            title="Clear all filters"
                        >
                            🗑️ Clear
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBar;