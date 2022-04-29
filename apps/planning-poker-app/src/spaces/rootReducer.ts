import { combineReducers } from "redux";

import { pokerTableReducer } from "./poker-table/reducers/poker-table-reducer";
import { authReducer } from "./auth/reducers/auth-reducer";
import { jiraReducer } from "./jira/reducers/jira-reducer";

export const rootReducer = combineReducers({
    pokerTable: pokerTableReducer,
    auth: authReducer,
    jira: jiraReducer,
});

export type AppState = ReturnType<typeof rootReducer>;