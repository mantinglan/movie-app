/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LuckyWheel } from "@lucky-canvas/react";
import "./WatchLottery.css";

const WatchLottery = ({ movies }) => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [blocks] = useState([{ padding: "10px", background: "#f0f0f0" }]);
  const [prizes] = useState(
    movies.map((movie) => ({
      background: "#ffefd5",
      fonts: [
        {
          text: movie.title,
          top: "40%",
          wordWrap: true,
          fontColor: "#333",
          fontSize: "14px",
        },
      ],
      gutter: "10px",
    }))
  );
  const [buttons] = useState([
    { radius: "40%", background: "#ff6b6b" },
    { radius: "35%", background: "#ff8c8c" },
    {
      radius: "30%",
      background: "#ff4d4d",
      pointer: true,
      fonts: [
        { text: "Start", top: "-10px", fontColor: "#ffffff", fontSize: "16px" },
      ],
    },
  ]);

  const SpinningWheel = useRef();

  const handleLottery = () => {
    if (movies.length > 0) {
      // setSpinning(true);
      console.log(movies, SpinningWheel);
      SpinningWheel.current.play();
      setTimeout(() => {
        const prizeIndex = Math.floor(Math.random() * movies.length);
        SpinningWheel.current.stop(prizeIndex);
        setSelectedMovie(movies[prizeIndex]);
      }, 2000);
    }
  };

  const onEnd = () => {
    // setSpinning(false);
    setShowModal(true);
  };

  function onClick(movieId) {
    navigate(`/movie/${movieId}`);
  }

  return (
    <div className="watch-lottery">
      <h2>Watch Lottery</h2>
      <div className="lucky-wheel-container">
        <LuckyWheel
          ref={SpinningWheel}
          width="300px"
          height="300px"
          prizes={prizes}
          blocks={blocks}
          buttons={buttons}
          onEnd={(prize) => onEnd(prize.index)}
          onStart={handleLottery}
        />
      </div>
      {showModal && selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <img
              src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
            />
            <h3
              className="modal-header"
              onClick={() => onClick(selectedMovie.id)}
            >
              {selectedMovie.title}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchLottery;
