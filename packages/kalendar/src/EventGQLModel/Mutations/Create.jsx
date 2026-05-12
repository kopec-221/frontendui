import {
    CreateBody as BaseCreateBody,
    CreateButton as BaseCreateButton,
    CreateDialog as BaseCreateDialog,
    CreateLink as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create";

import { MediumEditableContent, CreateURI } from "../Components";
import { InsertAsyncAction } from "../Queries";

const DefaultContent = (props) => <MediumEditableContent {...props} />
const mutationAsyncAction = InsertAsyncAction

const permissions = {
    oneOfRoles: ["plánovací administrátor"],
    mode: "absolute",
};

const attributeTransformer = (id, value) => {
    let key = id;
    if (key === 'startDate') key = 'startdate';
    if (key === 'endDate') key = 'enddate';
    return { [key]: value };
};

const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// ----------------------------

export const CreateLink = ({ uriPattern = CreateURI, item, ...props }) => {
    return <BaseCreateLink {...props} item={item} uriPattern={uriPattern} {...permissions} />
}

export const CreateDialog = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item, 
    ...props
}) => {
    const payloadBuilder = () => ({
        id: generateUUID(),
        mastereventId: item?.id
    });

    return (
        <BaseCreateDialog
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

export const CreateButton = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    Dialog = CreateDialog,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    const payloadBuilder = () => ({
        id: generateUUID(),
        mastereventId: item?.id
    });

    return (
        <BaseCreateButton
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

export const CreateBody = ({
    DefaultContent: DefaultContent_ = DefaultContent,
    mutationAsyncAction: mutationAsyncAction_ = mutationAsyncAction,
    item,
    ...props
}) => {
    const payloadBuilder = () => ({
        id: generateUUID(),
        mastereventId: item?.id
    });

    return (
        <BaseCreateBody
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