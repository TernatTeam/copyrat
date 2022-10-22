const AppReducer = (state, action) => {
  switch (action.type) {
    case "ROOM_DATA":
      return {
        ...state,
        roomData: {
          ...state.roomData,
          keyCode: action.keyCode,
          game_admin_uid: action.game_admin_uid,
        },
      };
    case "PLAYER_INFO":
      return {
        ...state,
        playerInfo: {
          ...state.playerInfo,
          nameAndColor: action.nameAndColor,
        },
      };
    default:
      return state;
  }
};

export default AppReducer;
