import React from "react";
import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Actions from "../../../components/match/Actions";
import { Player } from "@prisma/client";


function PlayMatch() {
  const router = useRouter();
  const { matchid } = router.query;
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const matchQuery = trpc.useQuery([
    "match.getMatch",
    { id: matchid as string },
  ]);
  const getResults = trpc.useMutation("match.getResults",);
  const submitAction = trpc.useMutation("match.submitAction");
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [opponentPlayer, setOpponentPlayer] = useState<Player>();
  const [match, setMatch] = useState(matchQuery.data);

  useEffect(() => {
    if (matchQuery.data == null || matchQuery.data == undefined) return;
    setMatch(matchQuery.data);
    sortPlayers();
  }, [matchQuery]);

  const sortPlayers = () => {
    if (match != null && match) {
      match?.player?.map((player:Player) => {
        if (player?.userId === match?.opponent?.id) {
          setCurrentPlayer(player);
        } else {
          setOpponentPlayer(player);
        }
      });
    }
  };

  const gameAction = (play: string) => {
    if (currentPlayer) {
      let playerId = currentPlayer.id as string;
      let action = play;

      submitAction.mutate(
        { playerId, action },
        {
          onSuccess: () => {
            utils.invalidateQueries(["match.getMatch"]);
          },
        }
      );
      let matchId = match?.id as string;
      getResults.mutate(
        {matchId: matchId},
        {
          onSuccess: () => {
            utils.invalidateQueries(["match.getMatch"]);
          },
        }
        )
    }
  };

  // const gameResults = ()=>{
  //   getResults.query(match?.id)
  // }




  return (
    <div>
      {" "}
      Welcome to match: {matchid}
      <div>Round: {match?.rounds}</div>
      <div>Winner: {match?.winner}</div>
      <div>Loser: {match?.loser}</div>
      <br />
      <br />
      <div>
        {currentPlayer && (
          <div>
            <div>Me: {session?.user?.name}</div>
            <div>Status : {currentPlayer?.status} </div>
            <div>Action : {currentPlayer?.action}</div>
            <div>Score : {currentPlayer?.score}</div>
          </div>
        )}
        <br />
        <br />

        {opponentPlayer && (
          <div>
            <div>Opponent: { match?.opponent?.name}</div>
            <div>Status : {opponentPlayer?.status} </div>
            <div>Action : {opponentPlayer?.action}</div>
            <div>Score : {opponentPlayer?.score}</div>
          </div>
        )}

        <br />
        <br />
        <br />
        <br />
        <Actions ready={true} action={gameAction} />
      </div>
    </div>
  );
}

export default PlayMatch;
