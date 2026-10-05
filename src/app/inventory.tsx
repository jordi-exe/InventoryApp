import AddItem from "@/components/addItemBtn";
import InventoryItem from "@/components/inventoryItems";
import { loadInventory, type InventoryItemProps } from "@/database/database";
import { globalStyles } from "@/styles/globalClasses";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DropdownMenu, MenuOption } from "../components/dropdownMenu";

type SortOption = "category" | "location";

export default function InventoryScreen() {
	const db = useSQLiteContext();

	const [inventory, setInventory] = useState<InventoryItemProps[]>([]);
	const [currentSort, setCurrentSort] = useState<SortOption>("category");

	const [visible, setVisible] = useState(false);

	useEffect(() => {
		loadInventoryItems();
	}, []);

	async function loadInventoryItems() {
		const items = await loadInventory(db);
		setInventory(items);
	}

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

			<AddItem onItemAdded={loadInventoryItems} />
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
