import React, {ChangeEvent, KeyboardEvent, memo, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {ControlPoint} from "@mui/icons-material";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = memo(({addItem}: AddItemFormPropsType) => {
    console.log("AddItemForm is called")

    let [newItemTitle, setNewItemTitle] = useState<string>('');
    let [error, setError] = useState<string | null>(null);

    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewItemTitle(e.currentTarget.value)
    };
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) setError(null);
        if (e.key === 'Enter') addingItem()
    };
    const addingItem = () => {
        if (newItemTitle.trim() !== '') {
            addItem(newItemTitle.trim());
            setNewItemTitle("")
        } else {
            setError('Title is required')
        }

    };

    return (

        <div>
            <TextField value={newItemTitle}
                       size={"small"}
                       variant={"outlined"}
                       label={"Type value"}
                       onChange={onNewTitleChangeHandler}
                       onKeyDown={onKeyPressHandler}
                       error={!!error}
                       helperText={error}
            />
            <IconButton onClick={addingItem} color={"primary"}>
                <ControlPoint/>
            </IconButton>
        </div>
    )
})