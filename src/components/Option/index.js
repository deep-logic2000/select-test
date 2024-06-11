import React from "react";

import starFull from "../../assets/images/star-full2.png";
import starEmpty from "../../assets/images/star-empty2.png";

import "./styles.css";

const Option = ({ data, toggleFavorite, styles }) => {
  const { value, label, isFavorite } = data;
  return (
    <li key={value} className="option" style={styles}>
      <div className="option__img">
        <img
          src={isFavorite ? starFull : starEmpty}
          alt="star"
          className="star__icon"
          onClick={() => toggleFavorite(value)}
        />
      </div>
      <span className="option__text">{label}</span>
    </li>
  );
};

export default Option;
