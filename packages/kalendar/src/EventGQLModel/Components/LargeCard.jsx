import { CardCapsule as CardCapsule_ } from "./CardCapsule"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { MediumContent as MediumContent_ } from "./MediumContent"
import { InteractiveMutations } from '../Mutations/InteractiveMutations'
import { LeftColumn, MiddleColumn } from "../../../../_template/src/Base/Components/Col"

/**
 * LargeCard — hlavní layout komponenta pro detail stránku události.
 *
 * Rozděluje stránku na dva sloupce:
 *   LeftColumn  — readonly detail (MediumContent) + panel NÁSTROJE (InteractiveMutations)
 *   MiddleColumn — children (typicky SubeventsVector s tabulkou a kalendářem sub-událostí)
 *
 * Celá karta je obalena CardCapsule s hlavičkou která obsahuje odkaz na událost.
 *
 * Inline editace (LiveEdit) byla záměrně odstraněna — editace probíhá pouze
 * přes tlačítko Upravit v sekci NÁSTROJE které naviguje na /edit/:id.
 *
 * CardCapsule a MediumContent lze přepsat přes props pro customizaci
 * bez nutnosti měnit LargeCard samotnou.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt
 * @param {React.ReactNode} [props.children] - obsah MiddleColumn (typicky SubeventsVector)
 * @param {React.ComponentType} [props.CardCapsule=CardCapsule_]
 *   Komponenta pro obalení karty. Výchozí je EventGQLModel CardCapsule s ikonou a odkazem.
 * @param {React.ComponentType} [props.MediumContent=MediumContent_]
 *   Komponenta pro zobrazení atributů v LeftColumn. Výchozí je readonly MediumContent.
 * @returns {JSX.Element}
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
                <LeftColumn>
                    {/* Readonly detail události */}
                    <CardCapsule item={item} title="Detail">
                        <MediumContent item={item} />
                    </CardCapsule>
                    {/* Panel NÁSTROJE — tlačítka Stránka, Zobrazit, Upravit, Odstranit, Aktualizovat */}
                    <InteractiveMutations item={item} />
                </LeftColumn>

                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </CardCapsule>
    )
}