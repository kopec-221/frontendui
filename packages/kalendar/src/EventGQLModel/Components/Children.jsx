import { ChildWrapper } from "@hrbolek/uoisfrontend-shared";

/**
 * Children — utility komponenta která obalí children pomocí ChildWrapper
 * a předá jim společnou entitu item spolu s ostatními props.
 *
 * Používá se pro injektování společného item objektu do více children
 * komponent najednou bez nutnosti předávat prop každé zvlášť.
 * Všechny children obdrží item prop s předanou entitou.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.item - EventGQLModel objekt předávaný do všech children
 * @param {React.ReactNode} props.children - children elementy k obalení
 * @param {...any} props - další props předané každému child elementu
 * @returns {JSX.Element} ChildWrapper komponenta obsahující children s injektovaným item
 *
 * @example
 * // Předání event entity do více children najednou
 * <Children item={event}>
 *     <MediumContent />
 *     <InteractiveMutations />
 * </Children>
 * // Obě komponenty obdrží prop item={event}
 */
export const Children = ({item, children, ...props}) => 
    <ChildWrapper item={item} children={children} {...props} />