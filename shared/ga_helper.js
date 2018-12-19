// Google Analytics Helper
import { Analytics, PageHit, Event } from 'expo-analytics';
import { GA_KEY } from '../config/keys';

const analytics = new Analytics(GA_KEY);

export const pageHit = async (screen) => {
	try {
		const result = await analytics.hit(new PageHit(screen));
	} catch (e) {
		console.log(e);
	}
};

export const event = async (category, action, label, value) => {
	try {
		const result = await analytics.event(new Event(category, action, label, value));
	} catch (e) {
		console.log(e);
	}
};
