import { random } from 'lodash'
import uuid from 'uuid/v4'

import { dispatch } from '../../store'

export const createNewRandomTimelineData = () => {
  const date = `2013-0${random(4, 5)}-${random(1, 30)}`

  const datum = {
    id: uuid(),
    content: 'Here\'s a random new thing that happened on ' + date,
    start: date
  }

  dispatch({ type: 'RANDOM_TIMELINE_DATUM_GENERATED', datum })
}
