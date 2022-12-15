import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type AddInputElementPropsType = {
  addElement: (title: string) => void,
}

export function AddInputElement(props: AddInputElementPropsType) {
  const [newElementTitle, setNewElementTitle] = useState('')
  const [error, setError] = useState('')

  function onChangeInput(e: ChangeEvent<HTMLInputElement>) {
    setNewElementTitle(e.currentTarget.value)
    setError('')
  }

  function onPressAddElement() {
    if (newElementTitle.trim() !== '') {
      props.addElement(newElementTitle.trim())
      setNewElementTitle('')
    } else {
      setError('Field is empty!')
    }
  }

  function onKeyPressHandler(e: KeyboardEvent<HTMLInputElement>) {
    console.log(e)
    if (e.code === 'Enter' && e.ctrlKey) {
      onPressAddElement()
    }
  }

  return (
    <div className="addInput">
      <input
        type="text"
        value={newElementTitle}
        onChange={onChangeInput}
        onKeyPress={onKeyPressHandler}
        className={error ? 'error__input' : ''}
      />
      <button onClick={onPressAddElement}>+</button>
      {error && <div className="error">
        <p>{error}</p>
      </div>}
    </div>
  )
}