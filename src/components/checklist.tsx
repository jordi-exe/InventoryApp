import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Checklist() {
	const [isChecked, setChecked] = useState(false);

	return (
		<View style={styles.container}>
			<View style={styles.item}>
				<Checkbox
					style={styles.checkbox}
					value={isChecked}
					onValueChange={setChecked}
				/>
				<Text style={styles.label}>Checkbox 1</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "flex-start",
		height: "100%",
		width: "100%",
		// Temporary to visualize border of container
		borderColor: "blue",
		borderWidth: 2,
	},
	item: {
		flexDirection: "row",
		justifyContent: "center",
		// Temporary to visualize border of container
		borderColor: "blue",
		borderWidth: 2,
	},
	checkbox: {
		margin: 12,
	},
	label: {
		justifyContent: "center",
		fontSize: 16,
		margin: 10,
		// Temporary to visualize border of container
		borderColor: "green",
		borderWidth: 2,
	},
});
