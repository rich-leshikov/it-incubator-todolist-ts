import { TextField } from '@mui/material';
import React, {ChangeEvent, useCallback, useState} from 'react';

type TitleElementPropsType = {
  title: string
  changeTitle: (title: string) => void
}

export const EditableTitle = React.memo((props: TitleElementPropsType) => {
  // console.log('EditableTitle changed')

  const [changing, setChanging] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.title)

  const onChangeValueHandler = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.currentTarget.value)
  }, [])
  const changingOnTitleHandler = useCallback((): void => {
    setChanging(true)
  }, [])
  const changingOffTitleHandler = useCallback((): void => {
    title.trim() !== '' && props.changeTitle(title.trim())
    setChanging(false)
  }, [props.changeTitle])

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