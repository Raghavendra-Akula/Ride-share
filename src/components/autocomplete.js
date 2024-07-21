import React, { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';

const AutocompleteInput = ({ id, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = _.debounce(async (inputValue) => {
      try {
        const response = await axios.get('https://api.olamaps.io/places/v1/autocomplete', {
          params: {
            input: inputValue,
            api_key: 'yoIOYyd9TTE8rjmntp0s3X0elA1GMbJGjJRet18G'
          }
        });

        if (response.data.status === 'ok') {
          setSuggestions(response.data.predictions);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.log('Error fetching autocomplete suggestions:', err);
        setSuggestions([]);
      }
    }, 500);

  const handleInputChange = (e) => {
    const value = e.target.value;
    onChange(value);

    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.description);
    setSuggestions([]);
  };

  return (
    <div>
      <input type="text" id={id} className="form-control" value={value} onChange={handleInputChange} 
      style={{ height: "2rem" }} required/>
        {suggestions.length > 0 && (
            <ul className="list-group position-absolute" style={{ zIndex: 10, width: '120%' }}>
                {suggestions.map((suggestion, index) => (
                    <li
                    key={index} className="list-group-item list-group-item-action"
                    onClick={() => handleSuggestionClick(suggestion)} style={{ cursor: 'pointer' }}>
                    {suggestion.description}
                    </li>
                ))}
            </ul>
        )}
    </div>
  );
};

export default AutocompleteInput;
