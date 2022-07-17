import React from "react";
import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import { Player, Match } from "../../../utils/types";
import { useRouter } from "next/router";

function PlayMatch() {
  const router = useRouter();
  const { matchid } = router.query;
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const match = trpc.useQuery(["match.getMatch", { id: matchid as string }]);

  console.log(match.data)


  return <div>match T3</div>;
}

export default PlayMatch;
