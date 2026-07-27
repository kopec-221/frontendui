import { PageVector } from "./PageVector"
import { PageUpdateItem } from "./PageUpdateItem"
import { PageCreateItem } from "./PageCreateItem"
import { PageReadItem } from "./PageReadItem"
import { PageDeleteItem } from "./PageDeleteItem"

import { DeleteItemURI, UpdateItemURI } from "../Components"
import { CreateURI, ReadItemURI, VectorItemsURI } from "../Components"

/**
 * EventGQLModelRouterSegments — pole route definic pro EventGQLModel entity.
 *
 * Každý objekt obsahuje:
 *   path    — URL vzor (string, může obsahovat dynamické segmenty jako :id)
 *   element — React komponenta která se vykreslí při shodě URL
 *
 * React Router prochází routes shora dolů a použije první shodu.
 * Fallback routes na konci zachytí libovolnou akci nad seznam nebo entitu.
 *
 * URL mapování:
 *   /kalendar/EventGQLModel/create/     → PageCreateItem (formulář nové události)
 *   /kalendar/EventGQLModel/list/       → PageVector (seznam událostí s filtrem)
 *   /kalendar/EventGQLModel/view/:id    → PageReadItem (readonly detail + sub-události)
 *   /kalendar/EventGQLModel/edit/:id    → PageUpdateItem (editační formulář)
 *   /kalendar/EventGQLModel/delete/:id  → PageDeleteItem (potvrzení smazání)
 *
 * Poznámka: PageCalendar byla odstraněna — kalendář je nyní součástí
 * detail stránky (SubeventsVector zobrazuje sub-události v tabulce + kalendáři).
 *
 * @type {Array<{path: string, element: JSX.Element}>}
 */
export const EventGQLModelRouterSegments = [
    {
        path: CreateURI,
        element: (<PageCreateItem />),
    },
    {
        path: VectorItemsURI,
        element: (<PageVector />),
    },
    {
        path: ReadItemURI,
        element: (<PageReadItem />),
    },
    {
        path: UpdateItemURI,
        element: (<PageUpdateItem />),
    },
    {
        path: DeleteItemURI,
        element: (<PageDeleteItem />),
    },
    {
        path: VectorItemsURI.replace("list", ":any"),
        element: (<PageVector />),
    },
    {
        path: ReadItemURI.replace(":id", ":id/:any"),
        element: (<PageReadItem />),
    },
]