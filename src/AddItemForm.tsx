import React, {KeyboardEvent, ChangeEvent, useState} from 'react';
import {Button, IconButton, TextField} from '@material-ui/core';
import {AddBox} from '@material-ui/icons';

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

function AddItemForm(props: AddItemFormPropsType) {

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
        setError(null);
        setTitle(e.currentTarget.value);
    };

    const onKeyPressAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
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
            {/*<input onChange={onChangeInputHandler}*/}
            {/*       value={title}*/}
            {/*       onKeyPress={onKeyPressAddItem}*/}
            {/*       className={error ? 'error' : ''}/>*/}

            <IconButton  onClick={addItem} color={'primary'}>
                <AddBox/>
            </IconButton>
            {/*{error && <div className='error-message'>{error}</div>}*/}
        </div>
    )
}

export default AddItemForm;