import {
    UpdateBody as BaseUpdateBody,
    UpdateButton as BaseUpdateButton,
    UpdateDialog as BaseUpdateDialog,
    UpdateLink as BaseUpdateLink
} from "../../../../_template/src/Base/Mutations/Update";

import { MediumEditableContent, UpdateItemURI } from "../Components";
import { UpdateAsyncAction } from "../Queries";

// Výchozí obsah formuláře
const DefaultContent = (props) => <MediumEditableContent {...props} />;

// Čisté napojení GQL akce bez zpoždění a bez automatického refreshe
const mutationAsyncAction = UpdateAsyncAction;

// Oprávnění pro zobrazení a editaci
const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

// Transformace klíčů formuláře pro odpovídající formát GQL mutace
const attributeTransformer = (id, value) => {
    let key = id;
    if (key === 'startDate') key = 'startdate';
    if (key === 'endDate') key = 'enddate';
    return { [key]: value };
};

// Zajištění odeslání povinných primárních klíčů
const payloadBuilder = (item) => ({ 
    id: item?.id, 
    lastchange: item?.lastchange 
});

// Exportované komponenty s pojistkami proti chybějícím datům

export const UpdateLink = ({ uriPattern = UpdateItemURI, item, ...props }) => {
    if (!item) return null; 
    return <BaseUpdateLink {...props} item={item} uriPattern={uriPattern} {...permissions} />;
};

export const UpdateDialog = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    if (!item) return null;
    return (
        <BaseUpdateDialog
            {...props}
            item={item}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
            onAttributeChange={attributeTransformer}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};

export const UpdateButton = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    Dialog = UpdateDialog,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    if (!item) return null;
    return (
        <BaseUpdateButton
            {...props}
            item={item}
            DefaultContent={DefaultContent_}
            Dialog={Dialog}
            mutationAsyncAction={mutationAsyncAction_}
            onAttributeChange={attributeTransformer}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};

export const UpdateBody = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    if (!item) return null;
    return (
        <BaseUpdateBody
            {...props}
            item={item}
            DefaultContent={DefaultContent_}
            mutationAsyncAction={mutationAsyncAction_}
            onAttributeChange={attributeTransformer}
            onOk={payloadBuilder}
            {...permissions}
        />
    );
};