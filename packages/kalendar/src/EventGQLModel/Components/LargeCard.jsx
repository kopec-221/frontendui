import { CardCapsule as CardCapsule_ } from "./CardCapsule"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { MediumContent as MediumContent_ } from "./MediumContent"
import { LiveEdit } from "./LiveEdit"
import { InteractiveMutations } from '../Mutations/InteractiveMutations'
import { LeftColumn, MiddleColumn } from "../../../../_template/src/Base/Components/Col"

/**
 * LargeCard — hlavní layout komponenta pro detail stránku události.
 *
 * Struktura:
 *   LeftColumn  — LiveEdit (editovatelné inputy) + InteractiveMutations (tlačítka)
 *   MiddleColumn — children (obsah předaný z PageReadItem/SubPage)
 *
 * Proč children a ne přímo SubeventsVector + MediumCardScalars:
 *   Obsah MiddleColumn řídí SubPage komponenta předaná z PageReadItem.
 *   Tím lze různé stránky (read, edit, roles...) zobrazit různý obsah
 *   bez nutnosti měnit LargeCard.
 */
export const LargeCard = ({
    item,
    children,
    CardCapsule = CardCapsule_,
    MediumContent = MediumContent_
}) => {
    return (
        <CardCapsule item={item}>
            <Row>
                {/*
                 * LeftColumn — editovatelný detail a akční tlačítka.
                 * LiveEdit zobrazí inputy pro všechna skalární pole.
                 * Změny se ukládají automaticky při opuštění pole (onBlur).
                 */}
                <LeftColumn>
                    <CardCapsule item={item} title="Detail">
                        <LiveEdit item={item} />
                    </CardCapsule>
                    <InteractiveMutations item={item} />
                </LeftColumn>

                {/*
                 * MiddleColumn — obsah z SubPage komponenty.
                 * V PageReadItem je SubPage=EventSubPage která zobrazí
                 * SubeventsVector + Tree + MediumCardScalars + MediumCardVectors.
                 */}
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </CardCapsule>
    )
}