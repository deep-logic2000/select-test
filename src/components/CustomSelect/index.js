// CustomSelect.js
import React, { useState, useRef, useEffect, useCallback } from "react";

import Option from "../Option";

import searchIcon from "../../assets/images/search-icon.png";
import starFull from "../../assets/images/star-full2.png";
import xIcon from "../../assets/images/x-icon.png";

import "./styles.css";

const ITEM_HEIGHT = 28;
const VISIBLE_ITEMS_COUNT = 9;

const CustomSelect = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedTab, setSelectedTab] = useState(1);
  const [options, setOptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    fetch("https://api-eu.okotoki.com/coins")
      .then((response) => response.json())
      .then((data) => {
        const updatedOptions = data.map((coin) => ({
          value: coin,
          label: coin,
          isFavorite: false,
        }));
        setOptions(updatedOptions);
      });
  }, []);

  const handleRightClick = (event) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const left = clientX + 200 > innerWidth ? innerWidth - 250 : clientX;
    const top = clientY + 320 > innerHeight ? innerHeight - 320 : clientY;

    setPosition({ top, left });
    setIsVisible(true);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
    setFilter("");
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const toggleFavorite = (value) => {
    const updatedOptions = options.map((option) =>
      option.value === value
        ? { ...option, isFavorite: !option.isFavorite }
        : option
    );
    setOptions(updatedOptions);
  };

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(filter.toLowerCase()) &&
      (selectedTab === 0 ? option.isFavorite : true)
  );

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT) ?? 0;
  const endIndex = startIndex + VISIBLE_ITEMS_COUNT ?? 9;
  const visibleOptions = filteredOptions.slice(startIndex, endIndex);

  return (
    <div className="container" onContextMenu={handleRightClick}>
      {isVisible && (
        <div
          className="select-wrapper"
          ref={containerRef}
          style={{
            top: position.top,
            left: position.left,
          }}>
          <div className="search">
            <img src={searchIcon} alt="search icon" className="search__icon" />
            <input
              className="search-input"
              type="text"
              value={filter}
              onChange={handleFilterChange}
              placeholder="Search..."
            />
            {filter && (
              <img
                src={xIcon}
                alt="x icon"
                className="x__icon"
                onClick={() => setFilter("")}
              />
            )}
          </div>
          <div className="select-tabs">
            <div>
              <button
                className="select-tabs__tab tab__favorite"
                onClick={() => handleTabChange(0)}>
                <img src={starFull} alt="star full" className="star__icon" />
                <span
                  className={`tab__text ${selectedTab === 0 ? "active" : ""}`}>
                  FAVORITES
                </span>
              </button>
            </div>
            <button
              className="select-tabs__tab"
              onClick={() => handleTabChange(1)}>
              <span
                className={`tab__text ${selectedTab === 1 ? "active" : ""}`}>
                ALL COINS
              </span>
            </button>
          </div>
          <div
            className="options-list-wrapper"
            ref={listRef}
            onScroll={handleScroll}
            style={{
              height: `${VISIBLE_ITEMS_COUNT * ITEM_HEIGHT}px`,
            }}>
            <ul
              className="options-list"
              style={{
                height: `${filteredOptions.length * ITEM_HEIGHT}px`,
              }}>
              {visibleOptions.map((option, index) => (
                <Option
                  data={option}
                  toggleFavorite={toggleFavorite}
                  styles={{
                    top: `${(startIndex + index) * ITEM_HEIGHT}px`,
                    height: `${ITEM_HEIGHT}px`,
                  }}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
