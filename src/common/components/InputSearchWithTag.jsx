import { useState, useEffect, useRef } from 'react'

export const InputSearchWithTag = ({
  name, 
  className, 
  placeholder, 
  value, 
  fieldToShow=[], 
  onNotifyChangeEvent, 
  onSearchOptions, 
  onNotifySelectOption, 
  onNotifyRemoveTag, 
  switchRestart
}) => {

  // * hooks
  const [inputValue, setInputValue] = useState(value);
  const [tags, setTags] = useState([]);
  const [objList, setObjList] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const optionRefs = useRef([]); // * Referencias a los elementos de la lista

  console.log(`rendered: value=${value}, inputValue=${inputValue}`);
  
  useEffect(() => {
    // console.log(`useEffect: value=${value}, inputValue=${inputValue}`);
    if(value=='') 
      removeTag(tags.length - 1);

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

  useEffect(() => {
    setTags([]);
  }, [switchRestart]);

  // * handles
  const handleInputChange = async(e) => {
    const value = e.target.value;
    
    setInputValue(value);
    
    if(onNotifyChangeEvent)
      onNotifyChangeEvent(e);

    if (value.length < 3) {
      setObjList([]);

    } else {
      const foundObjList = await onSearchOptions(value);
      setObjList(foundObjList);
    }
  }

  const buildItem = (obj) => {

    if(fieldToShow.length == 0) 
      return obj[name];

    const item = fieldToShow.reduce((acc, field) => {
      acc += `${obj[field]} `;
      return acc;
    }, '');
    
    return item;
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev < objList.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSelectItem(objList[highlightedIndex]);
      setHighlightedIndex(-1);
    }
  }

  const handleSelectItem = (obj) => {
    setTags([...tags, obj[name]]);
    setInputValue("");
    setObjList([]);
    onNotifySelectOption(obj);
  }
  
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));

    if(onNotifyRemoveTag)
      onNotifyRemoveTag();
  }

  // * return component
  return (
    <div className="position-relative w-100">

      <div>
        {
          tags.map((tag, index) => (
            <div key={index} className="tag">
              {tag}<button className="remove-tag" onClick={() => removeTag(index)}>×</button>
            </div>
          ))
        }

        {
          tags.length == 0 && 
          <input
            type="text"
            name={name}
            className={className}
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
        }
      </div>

      {
        objList.length > 0 && (
        <ul className="list-group position-absolute w-100" style={{ maxHeight: "250px", overflowY: "auto", zIndex: 1000 }}>
          {
            objList.map((obj, index) => {
              return (
                <li
                  key={obj.id}
                  ref={(li) => (optionRefs.current[index] = li)} // * Guarda la referencia del elemento en la lista
                  className={`list-group-item list-group-item-action ${highlightedIndex === index ? 'active' : ''}`} // * Highlight selected item
                  onClick={() => handleSelectItem(obj)}
                  onMouseEnter={() => setHighlightedIndex(index)} // * Change highlighted index on mouse enter
                >
                  {buildItem(obj)}
                </li>
              )
            })
          }
        </ul>)
      }
    </div>
  )
}
