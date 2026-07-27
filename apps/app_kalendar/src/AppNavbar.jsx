import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { selectItemById } from "../../../packages/dynamic/src/Store"
import { PageNavbar } from "../../../packages/_template/src/Base/Pages/PageNavbar"

/**
 * AppNavbar — hlavní navigační lišta celé aplikace.
 *
 * Načte id aktuální entity z URL parametru :id přes useParams()
 * a vyhledá plná data entity v Redux store přes selectItemById.
 * Předá entitu do PageNavbar která zobrazí breadcrumbs a název entity.
 *
 * Pokud entita ve store ještě není (stránka se teprve načítá),
 * předá prázdný objekt {} a PageNavbar zobrazí prázdné breadcrumbs.
 *
 * Dropdown "Události" byl záměrně odstraněn — navigace probíhá
 * přes tlačítka v sekci NÁSTROJE (InteractiveMutations) a přímé
 * URL adresy. Navbar je tak čistší a méně rušivý.
 *
 * @component
 * @returns {JSX.Element} navigační lišta s breadcrumbs aktuální entity
 */
export const AppNavbar = () => {
    const { id } = useParams()
    const item = useSelector((dataroot) => selectItemById(dataroot, id)) || {}

    return (
        <PageNavbar item={item} />
    )
}