import { PageVector } from "./PageVector"
import { PageUpdateItem } from "./PageUpdateItem"
import { PageCreateItem } from "./PageCreateItem"
import { PageReadItem } from "./PageReadItem"
import { PageDeleteItem } from "./PageDeleteItem"
import { PageCalendar } from "./PageCalendar"

import { DeleteItemURI, UpdateItemURI } from "../Components"
import { CreateURI, ReadItemURI, VectorItemsURI } from "../Components"

/**
 * CalendarURI — URL cesta ke kalendářové stránce.
 * Definujeme ji zde lokálně protože ji nepotřebujeme exportovat
 * jako navigační URI (zatím není link v navbaru).
 *
 * Výsledná URL: /kalendar/EventGQLModel/calendar/
 */
const CalendarURI = VectorItemsURI.replace("list", "calendar")

/**
 * EventGQLModelRouterSegments — pole route definic pro EventGQLModel entity.
 *
 * Každý objekt obsahuje:
 *   path    - URL vzor (může obsahovat :id parametr)
 *   element - React komponenta která se vykreslí při shodě URL
 *
 * Jak React Router páruje URL:
 *   /kalendar/EventGQLModel/calendar/  → PageCalendar (nová!)
 *   /kalendar/EventGQLModel/list/      → PageVector (seznam eventů)
 *   /kalendar/EventGQLModel/view/:id   → PageReadItem (detail eventu)
 *   /kalendar/EventGQLModel/edit/:id   → PageUpdateItem (editace eventu)
 *   /kalendar/EventGQLModel/create/    → PageCreateItem (vytvoření eventu)
 *   /kalendar/EventGQLModel/delete/:id → PageDeleteItem (smazání eventu)
 *
 * Pořadí je důležité — React Router vyzkouší routes shora dolů
 * a použije první která sedí. Konkrétnější cesty (calendar) musí být
 * před obecnějšími (:any) aby nebyly zachyceny dříve.
 */
export const EventGQLModelRouterSegments = [
    {
        // Kalendářová stránka — NOVÁ ROUTE
        // URL: /kalendar/EventGQLModel/calendar/
        path: CalendarURI,
        element: (<PageCalendar />),
    },
    {
        // Stránka pro vytvoření nové události
        // URL: /kalendar/EventGQLModel/create/
        path: CreateURI,
        element: (<PageCreateItem />),
    },
    {
        // Seznam všech událostí s filtrací a infinite scroll
        // URL: /kalendar/EventGQLModel/list/
        path: VectorItemsURI,
        element: (<PageVector />),
    },
    {
        // Detail stránka jedné události
        // URL: /kalendar/EventGQLModel/view/:id
        path: ReadItemURI,
        element: (<PageReadItem />),
    },
    {
        // Editační stránka události
        // URL: /kalendar/EventGQLModel/edit/:id
        path: UpdateItemURI,
        element: (<PageUpdateItem />),
    },
    {
        // Stránka pro smazání události (s potvrzením)
        // URL: /kalendar/EventGQLModel/delete/:id
        path: DeleteItemURI,
        element: (<PageDeleteItem />),
    },
    {
        // Fallback pro libovolnou akci nad seznam (např. /list/something/)
        // :any zachytí jakýkoli string místo "list"
        path: VectorItemsURI.replace("list", ":any"),
        element: (<PageVector />),
    },
    {
        // Fallback pro libovolnou akci nad entitou (např. /view/something/)
        // :any zachytí jakýkoli string místo "view"
        path: ReadItemURI.replace("view", ":any"),
        element: (<PageReadItem />),
    }
]