import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

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

export enum HubMethods {
  RECEIVE_MEMBER = "ReceiveMember",
  RECEIVE_ISSUE = "ReceiveIssue",
  RECEIVE_VOTE = "ReceiveVote",
  RECEIVE_SCORE_LIST = "ReceiveScoreList",
  RECEIVE_ROOM_ACCEPTION = "ReceiveRoomAcception",
  RECEIVE_USER_LEFT = "ReceiveUserLeft",
  RECEIVE_RESULT_REVEALED = "ReceiveResultRevealed",
  RECEIVE_NEXT_ROUND = "ReceiveNextRound",
  RECEIVE_ISSUE_SWITCH = "ReceiveIssueSwitch",
  RECEIVE_OWNER_DESIGNATION = "ReceiveOwnerDesignation",
  RECEIVE_CONSENSUS_THRESHOLD = "ReceiveConsensusThreshold",
  RECEIVE_ASSIGNEE = "ReceiveAssignee",
  // RECEIVE_MESSAGE = "ReceiveMessage",
}

const connection = new HubConnectionBuilder()
  .withUrl(process.env.REACT_APP_HUB_URL as string, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .configureLogging(LogLevel.Information)
  .build();

const start = async () => {
  try {
    await connection.start();
    console.log("SignalR Connected.");
  } catch (err) {
    console.log(err);
    setTimeout(start, 5000);
  }
};

connection.onclose(async () => {
  await start();
});

const hub = { start, connection };
export default hub;
