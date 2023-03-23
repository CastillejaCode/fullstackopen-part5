import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef((props, ref) => {
	const [visible, setVisible] = useState(false);

	const toggleVisible = () => {
		setVisible(!visible);
	};

	useImperativeHandle(ref, () => {
		return {
			toggleVisible,
		};
	});

	return (
		<div>
			<div style={{ display: !visible ? '' : 'none' }}>
				<button
					type='button'
					onClick={toggleVisible}>
					{props.label}
				</button>
			</div>
			<div style={{ display: visible ? '' : 'none' }}>
				{props.children}
				<button
					type='button'
					onClick={toggleVisible}>
					cancel
				</button>
			</div>
		</div>
	);
});

Togglable.propTypes = {
	label: PropTypes.string.isRequired,
};

export default Togglable;
