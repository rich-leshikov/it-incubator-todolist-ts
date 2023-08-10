import { ChangeEvent, KeyboardEvent, memo, useState } from 'react'
import { IconButton, TextField } from '@mui/material'
import { AddBox } from '@mui/icons-material'
import styles from './AddInputElement.module.css'

type AddInputElementPropsType = {
	addElement: (title: string) => void
	isDisabled: boolean
}

export const AddInputElement = memo((props: AddInputElementPropsType) => {
	// console.log('render input')

	const [newElementTitle, setNewElementTitle] = useState<string>('')
	const [error, setError] = useState<string>('')

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		setNewElementTitle(e.currentTarget.value)
		error && setError('')
	}
	const onPressAddElement = () => {
		if (newElementTitle.trim() !== '') {
			props.addElement(newElementTitle.trim())
			setNewElementTitle('')
		} else {
			setError('Field is empty!')
		}
	}
	const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		e.code === 'Enter' && e.ctrlKey && onPressAddElement()
	}

	return (
		<div className={styles.addInput}>
			<div className={styles.form}>
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
					disabled={props.isDisabled}
				/>
				<IconButton
					onClick={onPressAddElement}
					style={{
						maxWidth: '40px',
						maxHeight: '40px',
						minWidth: '40px',
						minHeight: '40px'
					}}
					disabled={props.isDisabled}
				>
					<AddBox
						style={{
							maxWidth: '35px',
							maxHeight: '35px',
							minWidth: '35px',
							minHeight: '35px',
							color: '#20c9b5'
						}}
					/>
				</IconButton>
			</div>
			{error && (
				<div className={styles.error}>
					<p>{error}</p>
				</div>
			)}
		</div>
	)
})