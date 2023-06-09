import {TextField} from '@mui/material';
import React, {ChangeEvent, useState} from 'react';


type TitleElementPropsType = {
  title: string
  changeTitle: (title: string) => void
}


export const EditableTitle = React.memo((props: TitleElementPropsType) => {
  console.log('render title')
  const [changing, setChanging] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.title)

  const onChangeValueHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.currentTarget.value)
  }
  const changingOnTitleHandler = (): void => {
    setChanging(true)
  }
  const changingOffTitleHandler =(): void => {
    title.trim() !== '' && props.changeTitle(title.trim())
    setChanging(false)
  }

  return (
    <>
      {!changing && <span onDoubleClick={changingOnTitleHandler}>{props.title}</span>}
      {changing && <TextField
        variant={'outlined'}
        size={'small'}
        value={title}
        onChange={onChangeValueHandler}
        onBlur={changingOffTitleHandler}
        autoFocus/>}
    </>
  )
})