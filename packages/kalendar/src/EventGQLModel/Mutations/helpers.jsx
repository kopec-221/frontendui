/**
 * makeMutationURI — sestaví URL vzor pro mutační stránku z ReadItemURI.
 *
 * Nahradí segment "/view" v URL za zadanou akci (např. "edit", "delete", "create").
 * Používá se pro generování konstant jako UpdateItemURI, DeleteItemURI apod.
 *
 * @param {string} linkURI - základní URL vzor obsahující "/view" segment
 *   (např. "/kalendar/EventGQLModel/view/:id")
 * @param {string} action - název akce který nahradí "view"
 *   (např. "edit", "delete", "create")
 * @param {Object} [options={}] - volitelné nastavení
 * @param {boolean} [options.withId=false] - pokud true, přidá ":id" segment na konec URL
 * @returns {string} URL vzor pro mutační stránku
 *   (např. "/kalendar/EventGQLModel/edit/:id")
 *
 * @throws {Error} pokud linkURI neobsahuje segment "/view"
 *
 * @example
 * const ReadItemURI = "/kalendar/EventGQLModel/view/:id"
 * makeMutationURI(ReadItemURI, "edit")    // "/kalendar/EventGQLModel/edit/:id"
 * makeMutationURI(ReadItemURI, "delete")  // "/kalendar/EventGQLModel/delete/:id"
 * makeMutationURI(ReadItemURI, "create", { withId: false })  // "/kalendar/EventGQLModel/create"
 */
export const makeMutationURI = (linkURI, action, { withId = false } = {}) => {
    const viewSegmentRe = /\/view(\/|$)/;
    if (!viewSegmentRe.test(linkURI)) throw new Error(`LinkURI must contain '/view'. Got: ${linkURI}`);

    const base = linkURI.replace(viewSegmentRe, `/${action}$1`).replace(/\/?$/, "/");
    return withId ? `${base}:id` : base.replace(/\/$/, "");
};