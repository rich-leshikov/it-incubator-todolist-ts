import { TextField } from '@mui/material'
import { ChangeEvent, FC, memo, useState } from 'react'

type TitleElementProps = {
  title: string
  changeTitle: (title: string) => void
  isDisabled: boolean
}

export const EditableTitle: FC<TitleElementProps> = memo(({ title, changeTitle, isDisabled }) => {
  // console.log('render title')

  const [changing, setChanging] = useState<boolean>(false)
  const [localTitle, setLocalTitle] = useState<string>(title)

  const onChangeValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.currentTarget.value)
  }
  const changingOnTitleHandler = () => {
    if (isDisabled) {
      return
    }
    setChanging(true)
  }
  const changingOffTitleHandler = () => {
    localTitle.trim() !== '' && changeTitle(localTitle.trim())
    setChanging(false)
  }

  return (
    <>
      {!changing && <span onDoubleClick={changingOnTitleHandler}>{title}</span>}
      {changing && (
        <TextField
          variant={'outlined'}
          size={'small'}
          value={localTitle}
          onChange={onChangeValueHandler}
          onBlur={changingOffTitleHandler}
          autoFocus
        />
      )}
    </>
  )
})
