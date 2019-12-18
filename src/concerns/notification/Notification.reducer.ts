import { cloneDeep } from 'lodash'
import * as T from 'concerns/notification/Notification.d'
import { ActionKeys } from 'common/actionKeys'

const startingState: T.TBranchState = {
  notifications: []
}

const reducer = (state: T.TBranchState = startingState, action: T.TAction): T.TBranchState => {

  // We clonedeep here so the reference changes using a strict equality comparison
  // https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
  let newState = cloneDeep(state)

  switch (action.type) {
    case ActionKeys.NOTIFICATIONS_FETCHED:
      newState.notifications = newState.notifications.concat(action.payload)
      break
    default:
      // Exhastiveness check (make sure all actions are accounted for in switch statement)
      // (function(action: never){})(action)
      break
  }

  return newState
}

export default reducer
