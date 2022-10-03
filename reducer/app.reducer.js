const AppReducer = (state, action) => {
  switch (action.type) {
    case 'KEYCODE':
      return {
        ...state,
        keycode: {
          ...state.test,
          value: action.value,
        },
      };

    default:
      return state;
  }
};

export default AppReducer;
