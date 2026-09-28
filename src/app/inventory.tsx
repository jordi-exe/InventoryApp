import InventoryItem from "@/components/inventoryItems";
import { globalStyles } from "@/styles/globalClasses";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DropdownMenu, MenuOption } from "../components/dropdownMenu";

type InventoryItemProps = {
	title: string;
	itemCount: number;
	category: string;
	location: string;
};

type SortOption = "category" | "location";

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
	const [currentSort, setCurrentSort] = useState<SortOption>("category");
	const [isExpanded, setIsExpanded] = useState(false);

	const [visible, setVisible] = useState(false);

	const groupedItems = inventory.reduce(
		(acc, item) => {
			const group = item[currentSort];

			//Checks if the category array exists
			if (!acc[group]) {
				acc[group] = [];
			}

			acc[group].push(item);

			return acc;
		},
		{} as Record<string, InventoryItemProps[]>,
	);

	function Capitalize(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	return (
		<View style={globalStyles.mainContainer}>
			<View style={globalStyles.header}>
				<Text style={globalStyles.pageTitle}>Inventory</Text>
			</View>

			<View style={styles.optionsContainer}>
				<DropdownMenu
					visible={visible}
					handleOpen={() => setVisible(true)}
					handleClose={() => setVisible(false)}
					trigger={
						<View style={styles.triggerStyle}>
							<Text style={styles.triggerText}>
								Sort By: {Capitalize(currentSort)}
							</Text>
						</View>
					}
				>
					<MenuOption
						onSelect={() => {
							setCurrentSort("category");
							setVisible(false);
						}}
					>
						<Text>Category</Text>
					</MenuOption>
					<MenuOption
						onSelect={() => {
							setCurrentSort("location");
							setVisible(false);
						}}
					>
						<Text>Location</Text>
					</MenuOption>
					<MenuOption
						onSelect={() => {
							setVisible(false);
						}}
					>
						{/* Not Implemented Yet */}
						<Text>[Date Added]</Text>
					</MenuOption>
					<MenuOption
						onSelect={() => {
							setVisible(false);
						}}
					>
						{/* Not Implemented Yet */}
						<Text>[Expiry Date]</Text>
					</MenuOption>
				</DropdownMenu>

				<Text>Filter</Text>
			</View>

			<SafeAreaView style={styles.inventoryContainer} edges={["right", "left"]}>
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					{Object.entries(groupedItems).map(([group, items]) => (
						<InventoryItem key={group} group={group} items={items} />
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
	sortContainer: {
		borderBottomColor: "red",
		borderWidth: 5,
	},
	triggerStyle: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 10,

		backgroundColor: "white",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 20,
	},
	triggerText: {
		fontSize: 16,
	},
});
