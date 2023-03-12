import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from '@mui/material';
import {AddBox} from '@mui/icons-material';
import styles from './AddInputElement.module.css'

type AddInputElementPropsType = {
  addElement: (title: string) => void
}

export function AddInputElement(props: AddInputElementPropsType) {
  const [newElementTitle, setNewElementTitle] = useState<string>('')
  const [error, setError] = useState<string>('')

  function onChangeInput(e: ChangeEvent<HTMLInputElement>): void {
    setNewElementTitle(e.currentTarget.value)
    setError('')
  }
  function onPressAddElement(): void {
    if (newElementTitle.trim() !== '') {
      props.addElement(newElementTitle.trim())
      setNewElementTitle('')
    } else {
      setError('Field is empty!')
    }
  }
  function onKeyPressHandler(e: KeyboardEvent<HTMLInputElement>): void {
    (e.code === 'Enter' && e.ctrlKey) && onPressAddElement()
  }

  return (
    <div className={styles.addInput}>
      <TextField
        className={styles.input}
        variant={'outlined'}
        size={'small'}
        value={newElementTitle}
        onChange={onChangeInput}
        onKeyPress={onKeyPressHandler}
        error={!!error}
        label={'Task title'}
        placeholder={error}
      />
      <IconButton
        onClick={onPressAddElement}
        style={{maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}}
      >
        <AddBox style={{maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px', color: '#20c9b5'}}/>
      </IconButton>
      {error && <div className="error">
        <p>{error}</p>
      </div>}
    </div>
  )
}