import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export const Location = (props) => (
	<Svg
		{...props}
		viewBox="0 0 54.757 54.757"
		width={props.width ? props.width : 16}
		height={props.height ? props.height : 16}
		style={[
			props.style,
			{ marginRight: props.spacing ? props.spacing : 0 }
		]}
	>
		<G fill="#1ea3cc">
			<Path d="M27.557 12c-3.859 0-7 3.141-7 7s3.141 7 7 7 7-3.141 7-7-3.141-7-7-7zm0 12c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z" />
			<Path d="M40.94 5.617A19.052 19.052 0 0 0 27.38 0a19.05 19.05 0 0 0-13.56 5.617c-6.703 6.702-7.536 19.312-1.804 26.952L27.38 54.757 42.721 32.6c5.755-7.671 4.922-20.281-1.781-26.983zm.159 25.814L27.38 51.243 13.639 31.4C8.44 24.468 9.185 13.08 15.235 7.031 18.479 3.787 22.792 2 27.38 2s8.901 1.787 12.146 5.031c6.05 6.049 6.795 17.437 1.573 24.4z" />
		</G>
	</Svg>
);
