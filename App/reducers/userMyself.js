'use strict';

import * as TYPES from '../actions/types.js';

const initialUserState = {
  username:'',
  tokenStr:'',
  name:'',
  photo:'259',
};

export default function user(state = initialUserState,action){
  console.log('reducer');
  switch(action.type){
    case TYPES.SETUSERNAME:
      state.username=action.username;
      return {
        ...state,
      };
    case TYPES.SETTOKENSTR:
      state.tokenStr=action.tokenStr;
      return {
        ...state,
      };
    case TYPES.UPDATENAME:
      state.name=action.name;
      return {
        ...state,
      };
    case TYPES.UPDATEPHOTO:
      state.photo=action.photo;
      return {
        ...state,
      };
    default:
      return state;

  }
}
