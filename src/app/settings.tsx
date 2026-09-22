import { globalStyles } from "@/styles/globalClasses";
import { StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
	return (
		<View style={globalStyles.mainContainer}>
			<Text>This will be the settings screen.</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
