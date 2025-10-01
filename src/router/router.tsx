import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from '../App'
import AssociatesPage from '../modules/associatesInformation/AssociatePage'
import EventsPage from '../modules/events/EventsPage'
import VolunteersPage from '../modules/volunteersInformation/VolunteersPage'
import HomePage from './HomePage'

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
  component: AssociatesPage,
})

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsPage,
})

const volunteersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/volunteers',
  component: VolunteersPage,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  associatesRoute,
  volunteersRoute,
  eventsRoute
])

export const router = createRouter({ routeTree })
