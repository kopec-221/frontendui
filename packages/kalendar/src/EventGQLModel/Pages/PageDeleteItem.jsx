import { PageItemBase } from "./PageBase";
import { DeleteBody } from "../Mutations/Delete";

/**
 * PageDeleteItem — stránka pro potvrzení smazání události.
 *
 * URL: /kalendar/EventGQLModel/delete/:id
 *
 * Zobrazuje DeleteBody — inline potvrzovací formulář se jménem události
 * a varováním pokud má pod-události (ty musí být smazány nejdříve).
 * Po potvrzení smaže entitu a přesměruje na seznam událostí (/list/).
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.SubPage=DeleteBody]
 *   Komponenta renderovaná uvnitř ItemLayout. Výchozí je DeleteBody.
 * @returns {JSX.Element}
 */
export const PageDeleteItem = ({ 
    SubPage=DeleteBody,
    ...props
}) => {
    return (
        <PageItemBase
            SubPage={SubPage}
            {...props}
        />
    )
}