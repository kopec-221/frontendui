import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { selectItemById } from "../../../packages/dynamic/src/Store"
import { PageNavbar } from "../../../packages/_template/src/Base/Pages/PageNavbar"

/**
 * AppNavbar — hlavní navigační lišta celé aplikace.
 *
 * Načte aktuální entitu ze store podle :id z URL
 * a předá ji do PageNavbar pro zobrazení breadcrumbs.
 *
 * Dropdown "Události" byl odstraněn — navigace probíhá
 * přes seznam událostí a detail jednotlivých událostí.
 */
export const AppNavbar = () => {
    const { id } = useParams()
    const item = useSelector((dataroot) => selectItemById(dataroot, id)) || {}

    return (
        <PageNavbar item={item} />
    )
}