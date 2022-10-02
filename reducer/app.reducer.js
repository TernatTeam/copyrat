const AppReducer = (state, action) => {
  switch (action.type) {
    case 'TEST':
      return {
        ...state,
        test: {
          ...state.test,
          value: action.value,
        },
      };

    default:
      return state;
  }
};

export default AppReducer;
