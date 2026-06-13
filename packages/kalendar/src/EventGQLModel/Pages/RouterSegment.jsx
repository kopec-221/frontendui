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
 * URL mapování:
 *   /kalendar/EventGQLModel/list/      → PageVector (seznam eventů)
 *   /kalendar/EventGQLModel/view/:id   → PageReadItem (detail eventu + sub-události + kalendář)
 *   /kalendar/EventGQLModel/edit/:id   → PageUpdateItem (editace eventu)
 *   /kalendar/EventGQLModel/create/    → PageCreateItem (vytvoření eventu)
 *   /kalendar/EventGQLModel/delete/:id → PageDeleteItem (smazání eventu)
 *
 * PageCalendar byla odstraněna — kalendář je nyní součástí detail stránky
 * (SubeventsVector zobrazuje sub-události v tabulce + kalendáři).
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