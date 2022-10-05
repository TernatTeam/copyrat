const AppReducer = (state, action) => {
  switch (action.type) {
    case 'ROOM_DATA':
      return {
        ...state,
        roomData: {
          ...state.roomData,
          keyCode: action.keyCode,
          game_admin_uid: action.game_admin_uid,
        },
      };

    default:
      return state;
  }
};

export default AppReducer;
