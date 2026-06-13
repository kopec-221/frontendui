import { CardCapsule as CardCapsule_ } from "./CardCapsule"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { MediumContent as MediumContent_ } from "./MediumContent"
import { InteractiveMutations } from '../Mutations/InteractiveMutations'
import { LeftColumn, MiddleColumn } from "../../../../_template/src/Base/Components/Col"

/**
 * LargeCard — hlavní layout komponenta pro detail stránku události.
 *
 * LeftColumn zobrazuje:
 *   - MediumContent — readonly zobrazení skalárních atributů
 *   - InteractiveMutations — sekce NÁSTROJE s tlačítky Upravit, Odstranit atd.
 *
 * Inline editace (LiveEdit) byla odstraněna — editace probíhá pouze
 * přes tlačítko Upravit v sekci NÁSTROJE.
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
                    <CardCapsule item={item} title="Detail">
                        <MediumContent item={item} />
                    </CardCapsule>
                    <InteractiveMutations item={item} />
                </LeftColumn>

                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </CardCapsule>
    )
}