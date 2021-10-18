import React, {KeyboardEvent, ChangeEvent, useState} from 'react';
import {IconButton, TextField} from '@material-ui/core';
import {AddBox} from '@material-ui/icons';

export type AddItemFormSubmitHelperType = { setError: (error: string) => void, setTitle: (title: string) => void}

export type AddItemFormPropsType = {
    addItem: (title: string, helper: AddItemFormSubmitHelperType) => void
    disabled?: boolean
}

export const AddItemForm:React.FC<AddItemFormPropsType> = React.memo(({addItem, disabled=false}) => {

    const [title, setTitle] = useState<string>('');
    const [error, setError] = useState<string | null>(null)


    const addItemHandler = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            addItem(trimmedTitle, {setError, setTitle});
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
            addItemHandler();
        }
    };
    return (
        <div>
            <TextField
                disabled={disabled}
                variant={'outlined'}
                value={title}
                onKeyPress={onKeyPressAddItem}
                onChange={onChangeInputHandler}
                label={'Title'}
                error={!!error}
                helperText={error}/>

            <IconButton onClick={addItemHandler} color={'primary'} disabled={disabled}>
                <AddBox/>
            </IconButton>
        </div>
    )
})

