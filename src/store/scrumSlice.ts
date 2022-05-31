import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import hub, { ClientMethods } from "../hub";

import { v5 } from "uuid";

const defaultScoreList = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];

interface EmittableValue<T> {
  value: T;
  shouldEmit?: boolean;
}

interface UserState {
  user: User;
  room: Room;
  isResultRevealed: boolean;
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
        .map((n) => parseInt(n)) ?? defaultScoreList,
    issueIndex: 0,
  },
  isOwner: false,
  isResultRevealed: false,
};

const scrumSlice = createSlice({
  name: "scrum",
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.user.name = action.payload;
      window.localStorage.setItem("username", action.payload);

      state.room.id !== "" &&
        hub.connection.send(
          ClientMethods.SEND_SET_NAME,
          state.room.id,
          state.user.id,
          action.payload
        );
    },
    createRoom(state, action: PayloadAction<string>) {
      console.debug("createRoom");
      const room: Room = {
        ...state.room,
        id: action.payload,
        ownerId: state.user.id,
      };

      if (!state.user.name || state.user.name.length === 0)
        state.user.name = `user${Date.now().toString().slice(0, 8)}`;

      room.members.push(state.user);
      state.room = room;
      state.isOwner = true;
      console.debug(room.id);
      hub.connection.send(ClientMethods.SEND_CREATE_ROOM, room);
    },
    loadRoom(state, action: PayloadAction<Room>) {
      console.debug("loadRoom");
      state.room = action.payload;
    },
    setScoreList(state, action: PayloadAction<number[]>) {
      console.debug("setScoreList");
      if (!state.isOwner) return;
      state.room.scoreList = action.payload;

      window.localStorage.setItem("lastUsedSet", action.payload.join(","));
      const cardSetStorage = window.localStorage.getItem("cardSetStorage");
      let storageVal: CardSetStorage = { sets: [action.payload] };
      if (cardSetStorage) {
        storageVal = JSON.parse(cardSetStorage) as CardSetStorage;
        storageVal.sets.push(action.payload);
        storageVal.sets.length > 3 && storageVal.sets.shift();
      }
      window.localStorage.setItem("cardSetStorage", JSON.stringify(storageVal));

      hub.connection.send(
        ClientMethods.SEND_SET_SCORE_LIST,
        state.room.id,
        state.user.id,
        action.payload
      );
    },
    newScoreList(state, action: PayloadAction<number[]>) {
      console.debug("loadScoreList");
      state.room.scoreList = action.payload;
    },
    newMember(state, action: PayloadAction<User>) {
      console.debug("newMember");
      state.room.members.push(action.payload);
    },
    newIssue(state, action: PayloadAction<EmittableValue<Issue>>) {
      console.debug("newIssue");
      state.room.issues.push(action.payload.value);
      action.payload.shouldEmit &&
        hub.connection.send(
          ClientMethods.SEND_ADD_ISSUE,
          state.room.id,
          action.payload.value
        );
    },
    removeIssue(state, action: PayloadAction<EmittableValue<string>>) {
      console.debug("removeIssue");
      const index = state.room.issues.findIndex(
        (issue) => issue.id === action.payload.value
      );
      state.room.issueIndex > index && state.room.issueIndex--;
      state.room.issues.splice(index, 1);
      action.payload.shouldEmit &&
        hub.connection.send(
          ClientMethods.SEND_REMOVE_ISSUE,
          state.room.id,
          action.payload.value
        );
    },
    switchIssue(state, action: PayloadAction<EmittableValue<number>>) {
      console.debug("switchIssue");
      const index = action.payload.value;
      if (index >= state.room.issues.length || index < 0) return;
      state.room.issueIndex = action.payload.value;
      state.isResultRevealed = false;
      state.currentVoteValue = undefined;

      action.payload.shouldEmit &&
        hub.connection.send(
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
    castVote(state, action: PayloadAction<{ roomId: string; vote: Vote }>) {
      console.debug("castVote");
      if (state.isResultRevealed) return;
      const issue = state.room.issues.find(
        (i) => i.id === action.payload.vote.issueId
      );
      issue &&
        updateVotes(
          issue.rounds[issue.rounds.length - 1].votes,
          action.payload.vote
        );
      state.currentVoteValue = action.payload.vote.value;
      hub.connection.send(
        ClientMethods.SEND_CAST_VOTE,
        action.payload.roomId,
        action.payload.vote
      );
    },
    revealResult(state) {
      console.debug("revealResult");
      if (state.isResultRevealed) return;
      state.isResultRevealed = true;
      state.isOwner &&
        hub.connection.send(
          ClientMethods.SEND_REVEAL_RESULT,
          state.room.id,
          state.user.id
        );
    },
    nextRound(state, action: PayloadAction<EmittableValue<null>>) {
      console.debug("nextRound");
      state.room.issues[state.room.issueIndex].rounds.push({ votes: [] });
      state.isResultRevealed = false;
      state.currentVoteValue = undefined;

      action.payload.shouldEmit &&
        hub.connection.send(ClientMethods.SEND_NEXT_ROUND, state.room.id);
    },
    joinRoom(state, action: PayloadAction<string>) {
      console.debug("joinRoom");
      if (!state.user.name || state.user.name.length === 0)
        state.user.name = `user${Date.now().toString().slice(0, 8)}`;

      state.room.id = action.payload;
      hub.connection.send(
        ClientMethods.SEND_JOIN_ROOM,
        action.payload,
        state.user
      );
    },
    leaveRoom(state) {
      console.debug("leaveRoom");
      hub.connection.send(
        ClientMethods.SEND_LEAVE_ROOM,
        state.room.id,
        state.user.id
      );
      return initialState;
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
  },
});

const updateVotes = (votes: Vote[], newVote: Vote) => {
  const index = votes.findIndex((v) => v.userId === newVote.userId);
  if (index === -1) votes.push(newVote);
  else votes[index].value = newVote.value;
};

export const {
  setName, //
  createRoom, //
  loadRoom, //
  setScoreList, //
  newScoreList, //
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
} = scrumSlice.actions;

export default scrumSlice.reducer;
