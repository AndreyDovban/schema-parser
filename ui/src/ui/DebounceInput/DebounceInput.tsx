import { useEffect, useState, type InputHTMLAttributes } from 'react';

interface DebounceInputProps {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
}

// A typical debounced input react component
export function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: DebounceInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return <input {...props} value={value} onChange={e => setValue(e.target.value)} />;
}
