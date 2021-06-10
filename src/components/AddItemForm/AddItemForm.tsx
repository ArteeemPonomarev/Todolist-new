import React, {KeyboardEvent, ChangeEvent, useState} from 'react';
import {IconButton, TextField} from '@material-ui/core';
import {AddBox} from '@material-ui/icons';

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {

    const [title, setTitle] = useState<string>('');
    const [error, setError] = useState<string | null>(null)


    const addItem = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addItem(trimmedTitle);
        } else {
            setError('Title is required!')
        }
        setTitle('');
    };

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(null);
        setTitle(e.currentTarget.value);
    };

    const onKeyPressAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
        error && setError(null);
        if (e.key === 'Enter') {
            addItem();
        }
    };
    return (
        <div>
            <TextField
                variant={'outlined'}
                value={title}
                onKeyPress={onKeyPressAddItem}
                onChange={onChangeInputHandler}
                label={'Title'}
                error={!!error}
                helperText={error}/>

            <IconButton onClick={addItem} color={'primary'} disabled={props.disabled}>
                <AddBox/>
            </IconButton>
        </div>
    )
})

