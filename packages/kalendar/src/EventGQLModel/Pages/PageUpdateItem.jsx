import { UpdateBody } from "../Mutations/Update"
import { PageItemBase } from "./PageBase"

/**
 * PageUpdateItem — stránka pro editaci události.
 *
 * URL: /kalendar/EventGQLModel/edit/:id
 *
 * Zobrazuje UpdateBody — inline editační formulář s poli:
 * Název, Anglický název, Popis, Začátek, Konec.
 *
 * Pole "Místo" (place) není dostupné — backend EventUpdateGQLModel
 * ho nepodporuje (ověřeno v GraphiQL).
 *
 * Po uložení zůstane na stejné stránce s aktualizovanými daty.
 * Tlačítko "Zobrazit" v sekci NÁSTROJE naviguje zpět na /view/:id.
 *
 * @component
 * @param {Object} props
 * @param {React.ComponentType} [props.SubPage=UpdateBody]
 *   Komponenta renderovaná uvnitř ItemLayout. Výchozí je UpdateBody s editačním formulářem.
 * @returns {JSX.Element}
 */
export const PageUpdateItem = ({ 
    SubPage=UpdateBody,
    ...props
}) => {
    return (
        <PageItemBase 
            SubPage={SubPage}
            {...props}
        />
    )
}