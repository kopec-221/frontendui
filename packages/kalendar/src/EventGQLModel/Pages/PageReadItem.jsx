import { PageItemBase } from "./PageBase"
import { Tree } from "../../../../_template/src/Base/Vectors/VectorAttribute"
import { MediumCardScalars } from "../../../../_template/src/Base/Scalars/ScalarAttribute"
import { SubeventsVector } from "../Vectors/SubeventsVector"

/**
 * EventSubPage — obsah MiddleColumn na detail stránce události.
 *
 * Zobrazuje v tomto pořadí:
 *   1. SubeventsVector    — naše vlastní tabulka sub-událostí s CRUD operacemi
 *   2. Tree               — stromová reprezentace všech atributů entity
 *   3. MediumCardScalars  — skalární relace (type, createdby, changedby...)
 *
 * Proč NENÍ MediumCardVectors:
 *   MediumCardVectors by zobrazil "VEKTOROVÉ ATRIBUTY / SUBEVENTS []" —
 *   generický výpis bez možnosti editace, duplicitní vůči SubeventsVector.
 *   Proto ho vynecháváme a subevents spravuje jen SubeventsVector.
 */
const EventSubPage = ({ item }) => {
    return (
        <>
            <SubeventsVector item={item} />
            <Tree item={item} />
            <MediumCardScalars item={item} />
        </>
    )
}

/**
 * PageReadItem — detail stránka jedné události.
 * Používá EventSubPage jako SubPage pro MiddleColumn obsah.
 */
export const PageReadItem = ({
    SubPage = EventSubPage,
    ...props
}) => {
    return (
        <PageItemBase SubPage={SubPage} {...props} />
    )
}