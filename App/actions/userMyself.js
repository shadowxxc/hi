'use strict';

import * as TYPES from './types.js';

export function setUsername(username) {
  console.log("actions");
  return {
    type: TYPES.SETUSERNAME,
    username:username,
  };
}

export function setTokenStr(tokenStr) {
  return {
    type: TYPES.SETTOKENSTR,
    tokenStr:tokenStr
  };
}

export function updateName(name) {
	return {
		type: TYPES.UPDATENAME,
    name: name,
	}
}

export function updatePhoto(photo) {
	return {
		type: TYPES.UPDATEPHOTO,
    photo: photo,
	}
}
