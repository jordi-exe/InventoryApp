import { StyleSheet } from "react-native";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";

export const DateSelector = ({ selected, setSelected }: any) => {
	const defaultStyles = useDefaultStyles();

	return (
		<DateTimePicker
			mode="single"
			date={selected}
			onChange={({ date }) => setSelected(date as Date)}
			style={{ backgroundColor: "white", borderRadius: 10, padding: 10 }}
			styles={{
				...defaultStyles,
				...calendarLightStyles,
				//Will eventually add logic to swap between light and dark mode based on settings
			}}
		/>
	);
};

const calendarLightStyles = StyleSheet.create({
	year_selector_label: {
		color: "black",
	},
	month_selector_label: {
		color: "black",
	},
	weekday_label: {
		color: "grey",
	},
	button_prev_image: {
		tintColor: "black",
	},
	button_next_image: {
		tintColor: "black",
	},

	day_label: {
		color: "black",
	},
	month_label: {
		color: "black",
	},
	year_label: {
		color: "black",
	},

	selected: {
		backgroundColor: "#c4c4c4",
		borderRadius: 10,
	},
	selected_month: {
		backgroundColor: "#c4c4c4",
		borderRadius: 10,
		borderWidth: 0,
	},
	selected_year: {
		backgroundColor: "#c4c4c4",
		borderRadius: 10,
		borderWidth: 0,
	},
});
