import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/pages/NotFound";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("@/pages/Home"));
const RestaurantDetailPage = lazy(() => import("@/pages/RestaurantDetail"));
const ReservationPage = lazy(() => import("@/pages/Reservation"));
const ConfirmationPage = lazy(() => import("@/pages/Confirmation"));
const AdminPage = lazy(() => import("@/pages/Admin"));
const ProfilePage = lazy(() => import("@/pages/Profile"));

function PageLoader() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <NotFound />
    </div>
  ),
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => <Layout />,
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: HomePage,
});

const restaurantDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/restaurants/$id",
  component: RestaurantDetailPage,
});

const reservationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/restaurants/$id/reserve",
  component: ReservationPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/reservation/confirmation",
  component: ConfirmationPage,
});

const adminRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/admin",
  component: AdminPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    restaurantDetailRoute,
    reservationRoute,
    confirmationRoute,
    adminRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
