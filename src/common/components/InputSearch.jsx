import React, { useState, useEffect } from 'react'

export const InputSearch = ({className, value, searchField, placeholder, onSearchOptions, onNotifySelectOption}) => {

  // * hooks
  const [inputValue, setInputValue] = useState(value);
  const [objList, setObjList] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  console.log(`rendered... value=${value}, inputValue=${inputValue}`);
  
  useEffect(() => {
    console.log(`useEffect: executed, value=${value}, inputValue=${inputValue}`);
    setInputValue(value);
  }, [value]);

  // * handles
  const handleInputChange = (e) => {
    const value = e.target.value;

    setInputValue(value);

    if (value.trim() === "") {
      setObjList([]);

    } else {
      const foundObjList = onSearchOptions(value);
      setObjList(foundObjList);
    }
  }

  const handleSelectOption = (obj) => {
    setInputValue(obj[searchField]);
    setObjList([]);
    console.log(`handleSelectOption: notifying to...`);
    onNotifySelectOption(obj);
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev < objList.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSelectOption(objList[highlightedIndex]);
      setHighlightedIndex(-1);
    }
  };

  
  // * return component
  return (
    <div className="position-relative">
      <input
        type="text"
        className={className}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {objList.length > 0 && (
        <ul className="list-group position-absolute w-100" style={{ maxHeight: "150px", overflowY: "auto", zIndex: 1000 }}>
          {
            objList.map((obj, index) => {
              return (
                <li
                  key={obj.id}
                  onClick={() => handleSelectOption(obj)}
                  className={`list-group-item list-group-item-action ${highlightedIndex === index ? 'active' : ''}`} // * Highlight selected item
                  onMouseEnter={() => setHighlightedIndex(index)} // * Change highlighted index on mouse enter
                >
                  {obj[searchField]}
                </li>
              )
            })
          }
        </ul>
      )}
    </div>
  )
}
