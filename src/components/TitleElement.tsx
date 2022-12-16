import React, {ChangeEvent, useState} from 'react';

type TitleElementPropsType = {
  title: string,
  changeTitle: (title: string) => void,
}

export function TitleElement(props: TitleElementPropsType) {
  const [isChanging, switchChanging] = useState(false)
  const [value, changeValue] = useState(props.title)

  const onChangeValueHandler = (e: ChangeEvent<HTMLInputElement>) => changeValue(e.currentTarget.value)
  const changingOnTitleHandler = () => switchChanging(true)
  const changingOffTitleHandler = () => {
    value.trim() !== '' && props.changeTitle(value.trim())
    switchChanging(false)
  }

  return (
    <>
      {!isChanging && <span onDoubleClick={changingOnTitleHandler}>{props.title}</span>}
      {isChanging && <input
        type={'text'}
        value={value}
        onChange={onChangeValueHandler}
        onBlur={changingOffTitleHandler}
        autoFocus/>}
    </>
  )
}