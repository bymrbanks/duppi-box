import React from "react";
import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Actions from "../../../components/match/Actions";
import PlayerUI from "../../../components/match/PlayerUI";
import { Player } from "@prisma/client";
import io from "socket.io-client";
import useSocket from "../../../hooks/useSocket";
import MatchHUD from "../../../components/match/MatchHUD";
import gameBg from"../../../images/match/game-bg.png";
import Image from "next/image";





let socket: any;

function PlayMatch() {
  const router = useRouter();
  const { matchid } = router.query;
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const matchQuery = trpc.useQuery([
    "match.getMatch",
    { id: matchid as string },
  ]);
  const getResults = trpc.useMutation("match.getResults");
  const submitAction = trpc.useMutation("match.submitAction");
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [opponentPlayer, setOpponentPlayer] = useState<Player>();
  const [match, setMatch] = useState(matchQuery.data);
  const [round, setRound] = useState<number>(0);
  useEffect(() => {
    if (matchQuery.data == null || matchQuery.data == undefined) return;
    setMatch(matchQuery.data);
    sortPlayers();
    setRound(matchQuery?.data?.rounds as number);
  }, [matchQuery]);

  const sortPlayers = () => {
    if (match != null && match) {
      match?.player?.map((player: Player) => {
        if (player.userId === match.opponent?.id) {
          setCurrentPlayer(player);
        } else {
          setOpponentPlayer(player);
        }
      });
    }
  };

  useEffect(() => {
    socketInitializer();
    return () => {
      console.log("This will be logged on unmount");
    };
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket/server");
    socket = io();

    socket.on("connect", () => {
      console.log(session + "connected");
    });

    socket.on("playerMove", (playerMove: {}) => {
      utils.invalidateQueries(["match.getMatch"]);
    });
  };

  const updatePlayerMove = () => {
    let playerMove = { id: "1", move: true, rounds: 1 };
    socket.emit("playerMove", playerMove);
  };

  const gameAction = (play: string) => {
    if (currentPlayer) {
      let playerId = currentPlayer.id as string;
      let action = play;
      let matchId = match?.id as string;

      submitAction.mutate(
        { playerId, action, matchId },
        {
          onSuccess: () => {
            // utils.invalidateQueries(["match.getMatch"]);
            updatePlayerMove();
          },
        }
      );

      getResults.mutate(
        { matchId: matchId },
        {
          onSuccess: () => {
            utils.invalidateQueries(["match.getMatch"]);
          },
        }
      );
    }
  };

  // const gameResults = ()=>{
  //   getResults.query(match?.id)
  // }

  return (
    
    <div className="gameContainer">
      <img alt="" className="gameBg"  width={gameBg.width} height={gameBg.height} src={gameBg.src} />
      <div className="flex  justify-end">
        {opponentPlayer && (
          <PlayerUI moves={opponentPlayer?.action} name={match?.opponent?.name} opponent={true} />
        )}
      </div>
      <MatchHUD /> Welcome to match: {matchid}
      <div>Round: {match?.rounds}</div>
      <div>Winner: {match?.winner}</div>
      <div>Loser: {match?.loser}</div>
      <br />
      <br />
      <div>
        {currentPlayer && (
          <div>
            <div>Me: {session?.user?.name}</div>
            {/* <div>Status : {currentPlayer?.status} </div> */}
            <div>Action : {currentPlayer?.action[round]}</div>
            <div>Score : {currentPlayer?.score}</div>
          </div>
        )}
        <br />
        <br />

        {opponentPlayer && (
          <div>
            <div>Opponent: {match?.opponent?.name}</div>
            {/* <div>Status : {opponentPlayer?.status} </div> */}
            <div>Action : {opponentPlayer?.action[round]}</div>
            <div>Score : {opponentPlayer?.score}</div>
          </div>
        )} 

        {currentPlayer && (
          <PlayerUI
            opponent={false}
            moves={currentPlayer?.action}
            name={session?.user?.name ? session?.user?.name : ""}
          />
        )}
        <div className="actionsContainer">
          <Actions ready={true} action={gameAction} />
        </div>
      </div>
    </div>
  );
}

export default PlayMatch;
