import Checklist from "@/components/checklist";
import { StyleSheet, Text, View } from "react-native";

export default function InventoryScreen() {
	return (
		<View style={styles.container}>
			<Text>This will be the inventory screen.</Text>

			<Checklist />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: 50,
		// Temporary to visualize border of screen
		borderColor: "red",
		borderWidth: 2,
	},
});
