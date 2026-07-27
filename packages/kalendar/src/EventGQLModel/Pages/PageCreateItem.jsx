import { ReadAsyncAction } from "../Queries"
import { Row } from "../../../../_template/src/Base/Components/Row";
import { CreateBody } from "../Mutations/Create";
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared";
import { PageItemBase } from "./PageBase";

/**
 * PageBody — layout pro stránku vytvoření nové události.
 *
 * Levý sloupec je prázdný — nová entita ještě nemá detail ani nástroje.
 * Pravý (střední) sloupec zobrazuje CreateBody s formulářem pro vyplnění dat.
 *
 * @component
 * @param {Object} props - props předané do CreateBody
 * @returns {JSX.Element}
 */
const PageBody = ({...props}) => (
    <Row>
        <LeftColumn />
        <MiddleColumn>
            <CreateBody {...props} />
        </MiddleColumn>
    </Row>
)

/**
 * PageCreateItem — stránka pro vytvoření nové události.
 *
 * URL: /kalendar/EventGQLModel/create/
 *
 * Zobrazuje formulář s poli: Název, Anglický název, Popis, Začátek, Konec.
 * Po úspěšném vytvoření přesměruje na detail stránku nové události (/view/:id).
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.SubPage=PageBody]
 *   Komponenta renderovaná uvnitř ItemLayout. Výchozí je PageBody s CreateBody formulářem.
 * @returns {JSX.Element}
 */
export const PageCreateItem = ({ 
    SubPage=PageBody,
    ...props
}) => {
    return (
        <PageItemBase 
            SubPage={SubPage}
            {...props}
        />
    )
}