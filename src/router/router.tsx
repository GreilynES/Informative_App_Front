import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from '../App'
import HomePage from './HomePage'

import VolunteersForm from '../pages/VolunteersForm'
import AssociatesForm from '../pages/AssociatesForm'
import EventsPage from '../pages/EventsPage'



const rootRoute = createRootRoute({
  component: App,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const associatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/associates',
  component: AssociatesForm,
})

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsPage,
})

const volunteersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/volunteers',
  component: VolunteersForm,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  associatesRoute,
  volunteersRoute,
  eventsRoute
])

export const router = createRouter({ routeTree })
