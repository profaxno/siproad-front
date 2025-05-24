import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import type { FC } from 'react';
import '../styles/input-search-with-tag.css';
interface Props<T = any> {
  name: string;
  className?: string;
  placeholder?: string;
  value: string;
  fieldToShow?: string[];
  onNotifyChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: (search: string) => Promise<T[]>;
  onNotifyChangeSelection: (obj: T) => void;
  onNotifyRemoveTag?: () => void;
  switchRestart?: any;
  readOnly: boolean;
}

export const InputSearchWithTag: FC<Props> = ({ 
  name, 
  className = '', 
  value, 
  placeholder = '', 
  fieldToShow = [], 
  onNotifyChange, 
  onSearch,
  onNotifyChangeSelection, 
  onNotifyRemoveTag, 
  switchRestart ,
  readOnly
}) => {
    
  // * hooks
  const [inputValue, setInputValue] = useState<string>(value);
  const [tags, setTags]             = useState<string[]>([]);
  const [objList, setObjList]       = useState<any[]>([]);
  const optionRefs                  = useRef<HTMLLIElement[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useEffect(() => {
    if (value === '') {
      removeTag(tags.length - 1);
    }
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    setTags([]);
  }, [switchRestart]);


  // * handles
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    onNotifyChange?.(e);

    const value = e.target.value;
    setInputValue(value);

    onSearch(value)
    .then((foundObjList) => {
      setObjList(foundObjList);
    })
    .catch((error) => {
      console.error('handleChange: Error', error);
      setObjList([]);
    });
  };

  const buildItem = (obj: any): string => {
    if (fieldToShow.length === 0) return obj[name] ?? '';

    return fieldToShow.reduce((acc, field) => {
      acc += obj[field] ? `${obj[field]} ` : '';
      return acc;
    }, '').trim();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev < objList.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      handleChangeSelection(objList[highlightedIndex]);
      setHighlightedIndex(-1);
    }
  };

  const handleChangeSelection = (obj: any) => {
    setTags([...tags, obj[name]]);
    setInputValue('');
    setObjList([]);
    onNotifyChangeSelection(obj);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
    onNotifyRemoveTag?.();
  };

  return (
    <div className="position-relative w-100">
      <div>
        {tags.map((tag, index) => (
          <div key={index} className="tag">
            {tag}
            <button className="remove-tag" onClick={() => removeTag(index)}>
              ×
            </button>
          </div>
        ))}

        {tags.length === 0 && (
          <input
            type="text"
            name={name}
            className={className}
            value={inputValue}
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            maxLength={100}
            readOnly={readOnly}
          />
        )}
      </div>

      {objList.length > 0 && (
        <ul
          className="list-group position-absolute w-100"
          style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1000 }}
        >
          {objList.map((obj, index) => (
            <li
              key={obj.id}
              ref={(li) => {
                if (li) optionRefs.current[index] = li;
              }}
              className={`list-group-item list-group-item-action ${
                highlightedIndex === index ? 'active' : ''
              }`}
              onClick={() => handleChangeSelection(obj)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {buildItem(obj)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
