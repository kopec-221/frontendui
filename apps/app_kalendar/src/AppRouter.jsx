import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
} from "react-router-dom";
import { NavigationHistoryLinks, NavigationHistoryProvider } from '../../../packages/_template/src/Base/Helpers/NavigationHistoryProvider';

import { BaseRouterSegments } from "../../../packages/_template/src/Base/Pages/RouterSegment";

// import { GroupRouterSegments } from "../../../packages/_template/src/GroupGQLModel/Pages/RouterSegment";
// import { RoleTypeRouterSegments } from "../../../packages/_template/src/RoleTypeGQLModel/Pages";
// import { UserRouterSegments } from "../../../packages/_template/src/UserGQLModel/Pages/RouterSegment";
// import { GroupTypeRouterSegments } from "../../../packages/_template/src/GroupTypeGQLModel/Pages/RouterSegment";
// import { RoleRouterSegments } from "../../../packages/_template/src/RoleGQLModel/Pages";
// import { Page } from "../../../packages/_template/src/Base/Pages/Page";
import { AppNavbar } from "./AppNavbar";
import { EventGQLModelRouterSegments } from "../../../packages/kalendar/src/EventGQLModel/Pages/RouterSegment";

/**
 * AppLayout — kořenový layout komponenta celé aplikace.
 *
 * Obaluje všechny stránky do NavigationHistoryProvider který
 * sleduje historii navigace a umožňuje zobrazení breadcrumbs.
 *
 * Obsahuje:
 *   AppNavbar             — hlavní navigační lišta s breadcrumbs aktuální entity
 *   NavigationHistoryLinks — odkaz zpět v historii navigace
 *   Outlet                — zde React Router renderuje aktuální stránku
 *
 * @component
 * @returns {JSX.Element}
 */
const AppLayout = () => (
    <NavigationHistoryProvider>
        <AppNavbar />
        <NavigationHistoryLinks />
        <Outlet />
    </NavigationHistoryProvider>
);

/**
 * Routes — definice routovací struktury aplikace.
 *
 * Kořenová cesta "/" používá AppLayout jako wrapper pro všechny stránky.
 * Children pole obsahuje route segmenty z jednotlivých GQLModel modulů.
 *
 * Aktivní segmenty:
 *   EventGQLModelRouterSegments — kalendářová aplikace (list, view, edit, create, delete)
 *   BaseRouterSegments          — základní stránky ze šablony
 *
 * Zakomentované segmenty (dostupné ale neaktivní):
 *   GroupRouterSegments, RoleTypeRouterSegments, UserRouterSegments atd.
 *
 * @type {Array<{path: string, element: JSX.Element, children: Array}>}
 */
const Routes = [
    {
        path: "/",
        element: <AppLayout />,
        children: [
            ...EventGQLModelRouterSegments,
            ...BaseRouterSegments,
            // ...GroupRouterSegments,
            // ...RoleTypeRouterSegments,
            // ...UserRouterSegments,
            // ...GroupTypeRouterSegments,
            // ...RoleRouterSegments,
        ],
    },
];

/**
 * router — instance React Router vytvořená z Routes definice.
 *
 * Používá createBrowserRouter (HTML5 History API) místo HashRouter —
 * URL jsou čisté bez "#" fragmentu (např. /kalendar/EventGQLModel/view/uuid).
 */
const router = createBrowserRouter(Routes);

/**
 * AppRouter — kořenová routovací komponenta aplikace.
 *
 * Renderuje RouterProvider s předkonfigurovaným router objektem.
 * Vkládá se do App.jsx uvnitř RootProviders.
 *
 * @component
 * @returns {JSX.Element}
 */
export const AppRouter = () => <RouterProvider router={router} />;