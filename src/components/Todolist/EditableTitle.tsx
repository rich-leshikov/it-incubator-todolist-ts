import {TextField} from '@mui/material';
import {ChangeEvent, memo, useState} from 'react';


type TitleElementPropsType = {
  title: string
  changeTitle: (title: string) => void
}


export const EditableTitle = memo((props: TitleElementPropsType) => {
  // console.log('render title')

  const [changing, setChanging] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.title)

  const onChangeValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }
  const changingOnTitleHandler = () => {
    setChanging(true)
  }
  const changingOffTitleHandler = () => {
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