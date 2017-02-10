'use strict';

import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import combineReducers from '../reducers';

const loggerMiddleware = createLogger();

export let store = createStore(
  combineReducers,
  applyMiddleware(
    loggerMiddleware,
  ),
);
