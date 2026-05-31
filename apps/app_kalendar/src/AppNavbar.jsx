import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { NavDropdown } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

import { selectItemById } from "../../../packages/dynamic/src/Store"
import { PageNavbar } from "../../../packages/_template/src/Base/Pages/PageNavbar"
import { VectorItemsURI } from "../../../packages/kalendar/src/EventGQLModel/Components"

/**
 * CalendarURI — URL kalendářové stránky.
 * Odvozujeme ji z VectorItemsURI (seznam) tím že nahradíme "list" za "calendar".
 * VectorItemsURI je např. "/kalendar/EventGQLModel/list/"
 * CalendarURI bude "/kalendar/EventGQLModel/calendar/"
 *
 * Stejný pattern jako v RouterSegment.jsx — musí být konzistentní.
 */
const CalendarURI = VectorItemsURI.replace("list", "calendar")

/**
 * EventNavDropdown — dropdown menu v navbaru pro navigaci mezi pohledy na události.
 *
 * Obsahuje tři položky:
 *   Kalendář  → /kalendar/EventGQLModel/calendar/  (měsíční mřížka)
 *   Seznam    → /kalendar/EventGQLModel/list/       (tabulka se scrollem)
 *
 * Proč useNavigate místo NavDropdown.Item as={Link}:
 *   ProxyLink a Link komponenty v projektu jsou navázané na entity (item.id, item.__typename).
 *   Pro pevné URL (bez id) je jednodušší použít useNavigate z react-router-dom přímo.
 *
 * Props:
 *   item - aktuálně načtená entita z Redux store (může být prázdný objekt)
 */
const EventNavDropdown = ({ item }) => {
    const navigate = useNavigate()

    return (
        <NavDropdown title="Události" id="events-nav-dropdown">
            {/*
             * Kalendář — měsíční mřížka s barevnými bločky eventů.
             * Kliknutím naviguje na CalendarURI.
             */}
            <NavDropdown.Item onClick={() => navigate(CalendarURI)}>
                📅 Kalendář
            </NavDropdown.Item>

            {/*
             * Seznam — tabulka všech eventů s filtrací a infinite scrollem.
             * Kliknutím naviguje na VectorItemsURI.
             */}
            <NavDropdown.Item onClick={() => navigate(VectorItemsURI)}>
                📋 Seznam událostí
            </NavDropdown.Item>
        </NavDropdown>
    )
}

/**
 * AppNavbar — hlavní navigační lišta celé aplikace.
 *
 * Co dělá:
 *   1. Přečte :id z aktuální URL přes useParams()
 *      (URL může být /kalendar/EventGQLModel/view/:id)
 *   2. Vyhledá entitu v Redux store podle tohoto id
 *   3. Předá entitu do PageNavbar jako item prop
 *      (PageNavbar zobrazí název entity v breadcrumbs nebo titulu)
 *   4. Zobrazí EventNavDropdown s navigačními položkami
 *
 * Proč item může být prázdný objekt {}:
 *   Na stránkách jako /calendar/ nebo /list/ není v URL žádné :id.
 *   useParams() vrátí undefined, selectItemById vrátí undefined,
 *   fallback || {} zajistí že PageNavbar dostane alespoň prázdný objekt
 *   místo undefined (aby nevyhodil chybu).
 */
export const AppNavbar = () => {
    const { id } = useParams()

    /**
     * item — entita z Redux store pro aktuální :id z URL.
     * Pokud id není v URL (stránky jako /calendar/), item bude {}.
     */
    const item = useSelector((dataroot) => selectItemById(dataroot, id)) || {}

    return (
        <PageNavbar item={item}>
            {/*
             * EventNavDropdown vložíme jako child do PageNavbar.
             * PageNavbar renderuje children vedle svých vlastních prvků
             * (logo, breadcrumbs, uživatel atd.)
             */}
            <EventNavDropdown item={item} />
        </PageNavbar>
    )
}