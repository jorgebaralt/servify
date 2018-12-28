export const formatPhone = (text) => {
	const input = text.replace(/\D/g, '').substring(0, 10);
	const left = input.substring(0, 3);
	const middle = input.substring(3, 6);
	const right = input.substring(6, 10);

	if (input.length > 6) {
		return `(${left}) ${middle} - ${right}`;
	} if (input.length > 3) {
		return `(${left}) ${middle}`;
	} if (input.length > 1) {
		return `(${left}`;
	} 
		return left;
};
