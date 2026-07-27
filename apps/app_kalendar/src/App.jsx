import 'bootstrap/dist/css/bootstrap.min.css';

import { AppRouter } from './AppRouter';
import { RootProviders } from '../../../packages/dynamic/src/Store';

/**
 * GQLENDPOINT_ — výchozí URL adresa GraphQL endpointu.
 *
 * Relativní cesta "/api/gql" funguje vůči origin aktuální stránky —
 * v dev prostředí Vite proxy přesměruje requesty na backend server.
 *
 * @type {string}
 */
export const GQLENDPOINT_ = "/api/gql"

/**
 * App — kořenová komponenta celé aplikace.
 *
 * Obaluje celou aplikaci do RootProviders který zajistí:
 *   - Redux store (globální state management)
 *   - Apollo GraphQL klient (komunikace s backendem přes GQLENDPOINT)
 *   - ostatní context providery potřebné pro funkčnost aplikace
 *
 * AppRouter uvnitř provideru definuje routing a renderuje
 * správnou stránku podle aktuální URL.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.GQLENDPOINT=GQLENDPOINT_]
 *   URL adresa GraphQL endpointu. Lze přepsat pro testování nebo
 *   nasazení na jiné prostředí (staging, produkce).
 * @returns {JSX.Element}
 *
 * @example
 * // Výchozí endpoint
 * <App />
 *
 * @example
 * // Vlastní endpoint pro testování
 * <App GQLENDPOINT="https://staging.example.com/api/gql" />
 */
export const App = ({ GQLENDPOINT=GQLENDPOINT_}) => {
    return (
        <RootProviders clientOptions={{ endpoint: GQLENDPOINT }}>
            <AppRouter />
        </RootProviders>
    );
};