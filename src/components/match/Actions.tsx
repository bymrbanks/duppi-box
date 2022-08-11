import React from "react";

interface Actions {
  ready: boolean;
  action: (play:string) => void;
}
function Actions({ready, action }: Actions) {
  const runAction = (play: string) => {
    if (ready) {
      action(play);
    } else {
      alert("Not ready yest bossy.");
    }
  };

  return (
    <div className="py-10">
      <div className="options_container flex w-full justify-items-center  justify-between text-6xl">
        <div
          id="option_rock"
          className="options"
          onClick={() => {
            runAction("ROCK");
          }}
        >
          👊🏽
        </div>
        <div
          id="option_paper"
          className="options"
          onClick={() => {
            runAction("PAPER");
          }}
        >
          🤚🏽
        </div>
        <div
          id="option_rock"
          className="options"
          onClick={() => {
            runAction("SCISSORS");
          }}
        >
          ✌🏽
        </div>
      </div>
    </div>
  );
}

export default Actions;
