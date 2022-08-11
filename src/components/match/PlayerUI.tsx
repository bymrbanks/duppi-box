import React from "react";
import player1Img from "../../images/match/player1-avatar.svg";
import player2Img from "../../images/match/avatar-2.svg";
import Image from "next/image";

interface PlayerStats {
  name: string | null;
  opponent: boolean;
  moves: string[];
}

function PlayerUI({ name, opponent, moves }: PlayerStats) {
  return (
    <div className={"p-8 flex " + (opponent ? "flex-row-reverse" : "flex-row")}>
      <div className="player-avatar">
        <Image
          height={opponent ? player2Img.height : player1Img.height}
          width={opponent ? player2Img.width : player1Img.width}
          src={opponent ? player2Img.src : player1Img.src}
          alt="avatar"
          className="w-full h-full"
        />
      </div>
      <div>
        <div
          className={
            "player-name text-outline mb-2 " +
            (opponent ? "text-right mr-2" : "ml-2")
          }
        >
          {name}
        </div>
        <div
          className={
            "player-health-bar rounded-full border-2 border-black w-48 h-5 overflow-hidden  bg-white " +
            (opponent ? "-mr-3" : "-ml-3")
          }
        >
          <div
            className={"player-health-bar-fill h-10 w-20 bg-green-400 " +
              (opponent && "float-right")
            }
          />
        </div>
        {/* actions */}
        <div
          className={"player-actions flex mt-2 " +
            (opponent ? "mr-4 float-right" : "ml-4")
          }
        >
          {moves?.map((move, index) => {
            return (
              <div
                key={index}
                className={  "items-center bg-white h-8 text-xl w-8 border border-black rounded flex justify-center aligned-center line-height-0 " +
                  (opponent ? "-mr-3" : "-ml-3")
                }
              >
                {move === "ROCK" ? "🪨" : move === "PAPER" ? "📄" : "✂️"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PlayerUI;
