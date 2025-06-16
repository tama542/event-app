import React, { useState } from "react";
//import "./RatingStars.css";

const RatingStars = ({ rating, totalStars = 5 }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="rating-stars">
      {Array.from({ length: totalStars }, (_, i) => {
        const starNumber = i + 1;
        const filled = hovered ? starNumber <= hovered : starNumber <= rating;
        return (
          <span
            key={i}
            className={`star ${filled ? "filled" : "empty"}`}
            onMouseEnter={() => setHovered(starNumber)}
            onMouseLeave={() => setHovered(null)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;
