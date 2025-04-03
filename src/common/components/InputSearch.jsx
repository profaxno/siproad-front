import React, { useState, useEffect, useRef } from 'react'

export const InputSearch = ({name, className, value, searchField, placeholder, onNotifyChangeEvent, onSearchOptions, onNotifySelectOption}) => {

  // * hooks
  const [inputValue, setInputValue] = useState(value);
  const [objList, setObjList] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const optionRefs = useRef([]); // * Referencias a los elementos de la lista

  console.log(`rendered... value=${value}, inputValue=${inputValue}`);
  
  useEffect(() => {
    console.log(`useEffect: executed, value=${value}, inputValue=${inputValue}`);
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    // * Si hay un elemento seleccionado, hacer scroll automáticamente
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [highlightedIndex]);

  // * handles
  const handleInputChange = async(e) => {
    const value = e.target.value;
    console.log(`handleInputChange: value="${value}"`);

    setInputValue(value);
    
    if(onNotifyChangeEvent)
      onNotifyChangeEvent(e);

    if (value.length < 3) {
      setObjList([]);

    } else {
      const foundObjList = await onSearchOptions(value);
      console.log(`handleInputChange: foundObjList=(${foundObjList.length})${JSON.stringify(foundObjList)}`);
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
        name={name}
        type="text"
        className={className}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {objList.length > 0 && (
        <ul className="list-group position-absolute w-100" style={{ maxHeight: "250px", overflowY: "auto", zIndex: 1000 }}>
          {
            objList.map((obj, index) => {
              return (
                <li
                  ref={(li) => (optionRefs.current[index] = li)} // * Guarda la referencia del elemento en la lista
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
