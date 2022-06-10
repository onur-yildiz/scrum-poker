import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v5, validate } from "uuid";

import { HubConnection } from "@microsoft/signalr";

export enum ClientMethods {
  SEND_SET_NAME = "SetName",
  SEND_CREATE_ROOM = "CreateRoom",
  SEND_JOIN_ROOM = "JoinRoom",
  SEND_LEAVE_ROOM = "LeaveRoom",
  SEND_ADD_ISSUE = "AddIssue",
  SEND_CAST_VOTE = "CastVote",
  SEND_SET_SCORE_LIST = "SetScoreList",
  SEND_REVEAL_RESULT = "RevealResult",
  SEND_NEXT_ROUND = "NextRound",
  SEND_SWITCH_ISSUE = "SwitchIssue",
  SEND_REMOVE_ISSUE = "RemoveIssue",
  SEND_SET_CONSENSUS_THRESHOLD = "SetConsensusThreshold",
  // SEND_MESSAGE = "SendMessage",
}

const defaultScoreList = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];

interface EmittableValue<T> {
  value: T;
  connection?: HubConnection;
}

interface EmittedValue<T> extends EmittableValue<T> {
  connection: HubConnection;
}

type EmittablePayloadAction<T> = PayloadAction<EmittableValue<T>>;
type EmittedPayloadAction<T> = PayloadAction<EmittedValue<T>>;

interface UserState {
  user: User;
  room: Room;
  isOwner: boolean;
  currentVoteValue?: number;
}

if (window.localStorage.getItem("userId") == null) {
  const name = window.navigator.userAgent.replace(/\D+/g, "");
  const userId = v5(name, v5.DNS);
  window.localStorage.setItem("userId", userId);
}

const initialState: UserState = {
  user: {
    id: window.localStorage.getItem("userId")!,
    name:
      window.localStorage.getItem("username") ??
      `user${(Math.random() * 10000).toFixed(0)}`,
  },
  room: {
    id: "",
    ownerId: "",
    members: [],
    issues: [
      {
        id: "starting-issue",
        creatorId: window.localStorage.getItem("userId")!,
        title: "Issue 1",
        description: "Try to find a way to make this work",
        rounds: [{ votes: [] }],
      },
    ],
    scoreList:
      window.localStorage
        .getItem("lastUsedSet")
        ?.split(",")
        .map((n) => Number(n)) ?? defaultScoreList,
    issueIndex: 0,
    consensusThreshold: Number(
      window.localStorage.getItem("consensusThreshold") ?? -1
    ),
    isResultRevealed: false,
  },
  isOwner: false,
};

const scrumSlice = createSlice({
  name: "scrum",
  initialState,
  reducers: {
    setName(state, action: EmittablePayloadAction<string>) {
      state.user.name = action.payload.value;
      window.localStorage.setItem("username", action.payload.value);

      if (state.room.id !== "") return;
      const user = state.room.members.find((u) => u.id === state.user.id);
      user && (user.name = action.payload.value);

      action.payload.connection?.send(
        ClientMethods.SEND_SET_NAME,
        state.room.id,
        state.user.id,
        action.payload.value
      );
    },
    createRoom(state, action: EmittedPayloadAction<string>) {
      console.debug("createRoom");
      const room: Room = {
        ...state.room,
        id: action.payload.value,
        ownerId: state.user.id,
      };

      if (!state.user.name || state.user.name.length === 0)
        state.user.name = `user${Date.now().toString().slice(0, 8)}`;

      room.members.push(state.user);
      state.room = room;
      state.isOwner = true;
      console.debug(room.id);
      action.payload.connection.send(ClientMethods.SEND_CREATE_ROOM, room);
    },
    loadRoom(state, action: PayloadAction<Room>) {
      console.debug("loadRoom");
      state.room = action.payload;
    },
    setScoreList(state, action: EmittablePayloadAction<number[]>) {
      console.debug("setScoreList");
      state.room.scoreList = action.payload.value;

      if (!action.payload.connection || !state.isOwner) return;
      window.localStorage.setItem(
        "lastUsedSet",
        state.room.scoreList.join(",")
      );
      const cardSetStorage = window.localStorage.getItem("cardSetStorage");
      let storageVal: CardSetStorage = { sets: [state.room.scoreList] };
      if (cardSetStorage) {
        storageVal = JSON.parse(cardSetStorage) as CardSetStorage;
        storageVal.sets.push(action.payload.value);
        storageVal.sets.length > 3 && storageVal.sets.shift();
      }
      window.localStorage.setItem("cardSetStorage", JSON.stringify(storageVal));

      action.payload.connection.send(
        ClientMethods.SEND_SET_SCORE_LIST,
        state.room.id,
        state.user.id,
        action.payload
      );
    },
    newMember(state, action: PayloadAction<User>) {
      console.debug("newMember");
      state.room.members.push(action.payload);
    },
    newIssue(state, action: EmittablePayloadAction<Issue>) {
      console.debug("newIssue");
      state.room.issues.push(action.payload.value);

      action.payload.connection?.send(
        ClientMethods.SEND_ADD_ISSUE,
        state.room.id,
        action.payload.value
      );
    },
    removeIssue(state, action: EmittablePayloadAction<string>) {
      console.debug("removeIssue");
      const index = state.room.issues.findIndex(
        (issue) => issue.id === action.payload.value
      );

      state.room.issueIndex >= index &&
        state.room.issueIndex !== 0 &&
        state.room.issueIndex--;

      state.room.issues.splice(index, 1);

      action.payload.connection?.send(
        ClientMethods.SEND_REMOVE_ISSUE,
        state.room.id,
        action.payload.value
      );
    },
    switchIssue(state, action: EmittablePayloadAction<number>) {
      console.debug("switchIssue");
      const index = action.payload.value;
      if (index >= state.room.issues.length || index < 0) return;
      state.room.issueIndex = action.payload.value;
      state.room.isResultRevealed = false;
      state.currentVoteValue = undefined;

      action.payload.connection?.send(
        ClientMethods.SEND_SWITCH_ISSUE,
        state.room.id,
        state.user.id,
        action.payload.value
      );
    },
    newVote(state, action: PayloadAction<Vote>) {
      console.debug("newVote");
      const issue = state.room.issues.find(
        (i) => i.id === action.payload.issueId
      );
      issue &&
        updateVotes(
          issue.rounds[issue.rounds.length - 1].votes,
          action.payload
        );
    },
    castVote(
      state,
      action: EmittedPayloadAction<{ roomId: string; vote: Vote }>
    ) {
      console.debug("castVote");
      const vote = action.payload.value.vote;
      const roomId = action.payload.value.roomId;
      if (state.room.isResultRevealed) return;
      const issue = state.room.issues.find((i) => i.id === vote.issueId);
      issue &&
        updateVotes(
          issue.rounds[issue.rounds.length - 1].votes,
          action.payload.value.vote
        );
      state.currentVoteValue = vote.value;

      action.payload.connection.send(
        ClientMethods.SEND_CAST_VOTE,
        roomId,
        vote
      );
    },
    revealResult(state, action: PayloadAction<HubConnection | null>) {
      console.debug("revealResult");
      if (state.room.isResultRevealed) return;
      state.room.isResultRevealed = true;
      state.isOwner &&
        action.payload!.send(
          ClientMethods.SEND_REVEAL_RESULT,
          state.room.id,
          state.user.id
        );
    },
    nextRound(state, action: PayloadAction<HubConnection | null>) {
      console.debug("nextRound");
      state.room.issues[state.room.issueIndex].rounds.push({ votes: [] });
      state.room.isResultRevealed = false;
      state.currentVoteValue = undefined;

      action.payload?.send(ClientMethods.SEND_NEXT_ROUND, state.room.id);
    },
    joinRoom(state, action: EmittedPayloadAction<string | void>) {
      console.debug("joinRoom");
      if (!state.user.name || state.user.name.length === 0)
        state.user.name = `user${Date.now().toString().slice(0, 8)}`;

      if (action.payload.value) state.room.id = action.payload.value;
      validate(state.room.id) &&
        action.payload.connection.send(
          ClientMethods.SEND_JOIN_ROOM,
          state.room.id,
          state.user
        );
    },
    leaveRoom(state, action: PayloadAction<HubConnection>) {
      console.debug("leaveRoom");
      action.payload.send(
        ClientMethods.SEND_LEAVE_ROOM,
        state.room.id,
        state.user.id
      );
      state.room = initialState.room;
      state.isOwner = false;
    },
    removeUser(state, action: PayloadAction<string>) {
      console.debug("removeUser");
      state.room.members = state.room.members.filter(
        (u) => u.id !== action.payload
      );
    },
    designateOwner(state, action: PayloadAction<string>) {
      if (state.user.id === action.payload) state.isOwner = true;
      state.room.ownerId = action.payload;
    },
    setConsensusThreshold(state, action: EmittablePayloadAction<number>) {
      console.debug("setConsensusThreshold");
      state.room.consensusThreshold = action.payload.value;
      window.localStorage.setItem(
        "consensusThreshold",
        action.payload.value.toString()
      );

      action.payload.connection?.send(
        ClientMethods.SEND_SET_CONSENSUS_THRESHOLD,
        state.room.id,
        state.user.id,
        action.payload.value
      );
    },
    assignUserToIssue(
      state,
      action: PayloadAction<{ issueId: string; assigneeId: string }>
    ) {
      const issue = state.room.issues.find(
        (i) => i.id === action.payload.issueId
      );
      if (!issue) return;
      issue.assigneeId = action.payload.assigneeId;
    },
    changeUserName(
      state,
      action: PayloadAction<{ userId: string; name: string }>
    ) {
      const user = state.room.members.find(
        (u) => u.id === action.payload.userId
      );
      if (!user) return;
      user.name = action.payload.name;
    },
  },
});

const updateVotes = (votes: Vote[], vote: Vote) => {
  const index = votes.findIndex((v) => v.userId === vote.userId);
  if (index === -1) votes.push(vote);
  else votes[index].value = vote.value;
};

export const {
  setName, //
  createRoom, //
  loadRoom, //
  setScoreList, //
  newMember, //
  newIssue, //
  removeIssue,
  switchIssue,
  newVote, //
  castVote, //
  revealResult, //
  nextRound, //
  joinRoom, //
  leaveRoom, //
  removeUser, //
  designateOwner, //
  setConsensusThreshold,
  assignUserToIssue,
  changeUserName,
} = scrumSlice.actions;

export default scrumSlice.reducer;
