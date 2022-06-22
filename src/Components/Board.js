import React, { useEffect, useState, useRef } from "react";

export default function Board() {
  const boardSize = 10;
  const [matrix, setMatrix] = useState(
    Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => 0)
    )
  );
  const generateFruit = () => {
    let pos = [...availablePos];
    console.log(pos);
    let fruitPos = pos[Math.floor(Math.random() * availablePos.size)];
    setMatrix((prev) => {
      let newMatrix = [...prev];
      newMatrix[(fruitPos - (fruitPos % boardSize)) / boardSize][
        fruitPos % boardSize
      ] = 2;
      return newMatrix;
    });
  };
  const [availablePos, setavailablePos] = useState(
    new Set(
      Array.from({ length: boardSize * boardSize }, (_, i) => {
        if (i !== boardSize * (boardSize / 2 - 1) + (boardSize / 2 - 1))
          return i;
        else return 0;
      })
    )
  );
  const [keyPressed, setkeyPressed] = useState("");
  const [snake, setSnake] = useState([]);
  const handleEvent = (e) => {
    if (e.key === "a") setkeyPressed(() => "left");
    if (e.key === "w") setkeyPressed(() => "up");
    if (e.key === "d") setkeyPressed(() => "right");
    if (e.key === "s") setkeyPressed(() => "down");
  };
  const addAvailblePos = (i, j) => {
    setavailablePos((prev) => {
      let newSet = new Set([...prev]);
      newSet.add(i * boardSize + j);
      return newSet;
    });
  };
  const removeAvailblePos = (i, j) => {
    console.log(`Remove ${i}, ${j} ${i * boardSize + j}`);
    setavailablePos((prev) => {
      let newSet = new Set([...prev]);
      newSet.delete(i * boardSize + j);
      return newSet;
    });
  };

  const kpref = useRef(handleEvent);
  useEffect(() => {
    if (keyPressed === "up") moveUp();
    if (keyPressed === "down") moveDown();
    if (keyPressed === "right") moveRight();
    if (keyPressed === "left") moveLeft();
    setkeyPressed(() => "");
  }, [keyPressed]);

  useEffect(() => {
    kpref.current = handleEvent;
  }, []);
  useEffect(() => {
    gameReset();
    const cb = (e) => kpref.current(e);
    window.addEventListener("keydown", cb);

    return () => {
      window.removeEventListener("keydown", cb);
    };
  }, []);

  const updateMatrix = (addPos) => {
    removeAvailblePos(addPos[0], addPos[1]);
    if (matrix[addPos[0]][addPos[1]] === 2) {
      setSnake((prev) => {
        let newSnake = [...prev];
        newSnake.unshift(addPos);
        return newSnake;
      });
      setMatrix((prev) => {
        let newMatrix = [...prev];
        newMatrix[addPos[0]][addPos[1]] = 1;
        return newMatrix;
      });
      generateFruit();
    } else {
      let removePos = snake[snake.length - 1];
      setSnake((prev) => {
        let newSnake = [...prev];
        newSnake.unshift(addPos);
        newSnake.pop();
        return newSnake;
      });
      addAvailblePos(removePos[0], removePos[1]);
      setMatrix((prev) => {
        let newMatrix = [...prev];
        newMatrix[addPos[0]][addPos[1]] = 1;
        newMatrix[removePos[0]][removePos[1]] = 0;
        return newMatrix;
      });
    }
  };

  const gameReset = () => {
    setavailablePos(
      (prev) =>
        new Set(
          Array.from({ length: boardSize * boardSize }, (_, i) => {
            if (i !== boardSize * (boardSize / 2 - 1) + (boardSize / 2 - 1))
              return i;
            else return 0;
          })
        )
    );
    setMatrix((prev) => {
      let newMatrix = [...prev];
      newMatrix = newMatrix.map((row) => row.map((val) => 0));
      newMatrix[boardSize / 2 - 1][boardSize / 2 - 1] = 1;
      return newMatrix;
    });
    setSnake((prev) => {
      let newSnake = [];
      newSnake.push([boardSize / 2 - 1, boardSize / 2 - 1]);
      return newSnake;
    });
    generateFruit();
  };
  const checkValid = (i, j) => {
    if (matrix[i][j] !== 1) return true;
    else {
      alert(`Game Over. Final Score: ${snake.length}`);
      gameReset();
    }
  };
  const moveUp = () => {
    let head = snake[0];
    if (head[0] - 1 >= 0 && checkValid(head[0] - 1, head[1])) {
      updateMatrix([head[0] - 1, head[1]]);
    }
  };
  const moveDown = () => {
    let head = snake[0];
    if (head[0] + 1 < boardSize && checkValid(head[0] + 1, head[1])) {
      updateMatrix([head[0] + 1, head[1]]);
    }
  };
  const moveRight = () => {
    let head = snake[0];
    if (head[1] + 1 < boardSize && checkValid(head[0], head[1] + 1)) {
      updateMatrix([head[0], head[1] + 1]);
    }
  };
  const moveLeft = () => {
    let head = snake[0];
    if (head[1] - 1 >= 0 && checkValid(head[0], head[1] - 1)) {
      updateMatrix([head[0], head[1] - 1]);
    }
  };
  return (
    <>
      <h1>Board</h1>
      <p>Use WASD to move</p>
      <h3>{`Score: ${snake.length}`}</h3>
      <div className="board">
        {matrix.map((row, indexi) => {
          return (
            <div key={indexi} className="row">
              {row.map((value, indexj) => {
                return (
                  <div
                    key={`${indexi}-${indexj}`}
                    className={`cell ${
                      value === 1
                        ? "snake-cell"
                        : value === 2
                        ? "fruit-cell"
                        : ""
                    }`}
                  >
                    {/* {indexi * boardSize + indexj} */}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
