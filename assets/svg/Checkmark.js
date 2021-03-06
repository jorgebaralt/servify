import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const Checkmark = (props) => (
	<Svg
		{...props}
		width={props.width ? props.width : 14}
		height={props.height ? props.height : 14}
		viewBox="0 0 97.619 97.618"
	>
		<Path
			d="M96.939 17.358L83.968 5.959a1.99 1.99 0 0 0-1.449-.494 2.002 2.002 0 0 0-1.373.677L34.1 59.688 17.372 37.547a1.995 1.995 0 0 0-1.319-.773 1.972 1.972 0 0 0-1.481.385L.794 47.567a2 2 0 0 0-.39 2.801l30.974 40.996c.362.479.922.771 1.522.793h.073c.574 0 1.122-.246 1.503-.68L97.12 20.18a1.998 1.998 0 0 0-.181-2.822z"
			fill="#ff7043"
		/>
	</Svg>
);
