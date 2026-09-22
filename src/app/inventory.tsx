import AccordionItem from "@/components/checklist";
import { globalStyles } from "@/styles/globalClasses";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InventoryScreen() {
	return (
		<View style={globalStyles.mainContainer}>
			<View style={globalStyles.header}>
				<Text style={globalStyles.pageTitle}>Inventory</Text>
			</View>

			<View style={styles.optionsContainer}>
				<Text>
					Sort By:
					<Text> Category</Text>
				</Text>

				<Text>Filter</Text>
			</View>

			<SafeAreaView style={styles.inventoryContainer} edges={["right", "left"]}>
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					<AccordionItem title="Canned Food">
						<Text>Tuna</Text>
						<Text>Sardines</Text>
						<Text>Beans</Text>
						<Text>Extra Beans</Text>
					</AccordionItem>
					<AccordionItem title="Vegetables">
						<Text>Onions</Text>
						<Text>Tomatos</Text>
						<Text>Potatos</Text>
					</AccordionItem>
				</ScrollView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	inventoryContainer: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 20,
	},
	optionsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		paddingHorizontal: 20,
		paddingBottom: 20,
		marginBottom: 20,

		borderBottomColor: "black",
		borderBottomWidth: 6,
	},
});
