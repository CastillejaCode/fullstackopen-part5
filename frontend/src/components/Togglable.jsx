import { useState, forwardRef, useImperativeHandle } from 'react';

const Togglable = forwardRef((props, refs) => {
	const [visible, setVisible] = useState(false);

	const toggleVisible = () => {
		setVisible(!visible);
	};

	useImperativeHandle(refs, () => {
		return {
			toggleVisible,
		};
	});

	return (
		<div>
			<div style={{ display: !visible ? '' : 'none' }}>
				<button onClick={toggleVisible}>{props.label}</button>
			</div>
			<div style={{ display: visible ? '' : 'none' }}>
				{props.children}
				<button onClick={toggleVisible}>cancel</button>
			</div>
		</div>
	);
});

export default Togglable;
