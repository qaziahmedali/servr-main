import rootReducer from '../reducers';

export interface IState extends ReturnType<typeof rootReducer> {}
