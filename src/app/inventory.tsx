import InventoryItem from "@/components/inventoryItems";
import { globalStyles } from "@/styles/globalClasses";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type InventoryItemProps = {
	title: string;
	itemCount: number;
	category: string;
	location: string;
};

const inventory: InventoryItemProps[] = [
	{
		title: "Tuna",
		itemCount: 3,
		category: "Canned Food",
		location: "Lower Cupboard",
	},
	{
		title: "Sardines",
		itemCount: 7,
		category: "Canned Food",
		location: "Lower Cupboard",
	},
	{
		title: "Milk",
		itemCount: 72,
		category: "Dairy",
		location: "Lower Cupboard",
	},
	{
		title: "Extra Beans",
		itemCount: 480,
		category: "Canned Food",
		location: "Lower Cupboard",
	},
	{
		title: "Onions",
		itemCount: 2,
		category: "Vegetables",
		location: "Fridge",
	},
	{
		title: "Tomatos",
		itemCount: 5,
		category: "Vegetables",
		location: "Fridge",
	},
	{
		title: "Cheese",
		itemCount: 20,
		category: "Dairy",
		location: "Fridge",
	},
];

export default function InventoryScreen() {
	const groupedItems = inventory.reduce(
		(acc, item) => {
			const { category } = item;

			//Checks if the category array exists
			if (!acc[category]) {
				acc[category] = [];
			}

			acc[category].push(item);

			return acc;
		},
		{} as Record<string, InventoryItemProps[]>,
	);

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
					{Object.entries(groupedItems).map(([category, items]) => (
						<InventoryItem key={category} category={category} items={items} />
					))}
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
