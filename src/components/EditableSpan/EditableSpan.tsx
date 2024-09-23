import React, {ChangeEvent, memo, useState} from 'react';
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    onChange: (value: string) => void
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('')

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.title)
    }
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title)
    }
    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    return editMode
        ? <TextField variant={"standard"} value={title} onChange={onChangeTitleHandler} onBlur={activateViewMode} autoFocus/>
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
});