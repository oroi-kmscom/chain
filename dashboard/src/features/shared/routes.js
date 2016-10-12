import { RoutingContainer } from 'features/shared/components'
import actions from 'actions'

const makeRoutes = (store, type, List, New, Show, options = {}) => {
  const loadPage = (state, replace) => {
    const query = state.location.query
    if (query.filter && options.skipFilter) {
      replace(state.location.pathname)
    }

    const pageNumber = parseInt(state.location.query.page || 1)
    if (pageNumber == 1) {
      store.dispatch(actions[type].fetchPage(query, pageNumber, { refresh: true }))
    } else {
      store.dispatch(actions[type].fetchPage(query, pageNumber))
    }
  }

  const childRoutes = []

  if (New) {
    childRoutes.push({
      path: 'create',
      component: New
    })
  }

  if (options.childRoutes) {
    childRoutes.push(...options.childRoutes)
  }

  if (Show) {
    childRoutes.push({
      path: ':id',
      component: Show
    })
  }

  return {
    path: options.path || type + 's',
    component: RoutingContainer,
    indexRoute: {
      component: List,
      onEnter: (nextState, replace) => { loadPage(nextState, replace) },
      onChange: (_, nextState, replace) => { loadPage(nextState, replace) }
    },
    childRoutes: childRoutes
  }
}

export default makeRoutes
