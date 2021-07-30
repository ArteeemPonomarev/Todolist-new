import React, {ChangeEvent, useState} from 'react';
import {TextField} from '@material-ui/core';

export type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
    disabled?: boolean
}

export const EditableSpan: React.FC<EditableSpanPropsType> = React.memo(({disabled = false, ...props}) => {
    console.log('EditableSpan called')

    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.title)
    const onEditMode = () => {
        if (!disabled) {
            setEditMode(true);
        }
    }
    const offEditMode = () => {
        setEditMode(false);
        props.changeTitle(title);
    };

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    }


    return (
        editMode
            ? <TextField
                color={'primary'}
                variant={'standard'}
                value={title}
                autoFocus
                onBlur={offEditMode}
                onChange={changeTitle}/>
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    )
})

export default EditableSpan;