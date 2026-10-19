import { Feather } from "@react-native-vector-icons/feather";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditItem from "./editItem";

type InventoryItem = {
	id: number;
	title: string;
	itemCount: number;
	unit: string;
	location: string;
	category: string;
	expiryDate?: string;
};

type InventoryItemProps = {
	group: string;

	items: InventoryItem[];
};

const FormatDate = (date?: Date) => {
	if (!date) return null;

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};

type ExpiryStatus = "valid" | "expiringSoon" | "expired";

const GetExpiryStatus = (expiryDate?: string): ExpiryStatus => {
	if (!expiryDate) return "valid";

	const currentDate = new Date();
	const expiry = new Date(expiryDate);

	const difference = expiry.getTime() - currentDate.getTime();
	const daysRemaining = Math.ceil(difference / (1000 * 3600 * 24));

	if (daysRemaining < 0) {
		return "expired";
	} else if (daysRemaining <= 7) {
		return "expiringSoon";
	} else {
		return "valid";
	}
};

export default function InventoryItem({ group, items }: InventoryItemProps) {
	const [expanded, setExpanded] = useState(true);

	function toggleItem() {
		setExpanded(!expanded);
	}

	return (
		<View style={styles.sortContainer}>
			<TouchableOpacity style={styles.sortHeader} onPress={toggleItem}>
				<Text style={styles.sortTitle}>{group}</Text>
				<Feather
					name={expanded ? "arrow-up-circle" : "arrow-down-circle"}
					size={24}
					color="black"
				/>
			</TouchableOpacity>

			{expanded &&
				[...items]
					.sort((a, b) => a.title.localeCompare(b.title))
					.map((item) => (
						<View key={item.id} style={styles.itemBody}>
							<View style={styles.itemMain}>
								<View style={styles.itemInfo}>
									<View style={styles.counterBorder}>
										<Text style={styles.itemCounter}>{item.itemCount}</Text>
									</View>

									<Text style={styles.itemTitle}>{item.title}</Text>
								</View>

								<View style={styles.itemButtons}>
									<EditItem item={item} />
									<Feather name="trash" size={24} color="black" />
								</View>
							</View>

							{item.expiryDate && (
								<Text
									style={[
										styles.itemExpiry,
										styles[GetExpiryStatus(item.expiryDate)],
									]}
								>
									{FormatDate(new Date(item.expiryDate))}
								</Text>
							)}

							<View style={styles.itemTags}>
								<Text style={styles.tags}>{item.location}</Text>
							</View>
						</View>
					))}
		</View>
	);
}

const styles = StyleSheet.create({
	listContainer: {
		alignItems: "flex-start",
		height: "100%",
		width: "100%",
	},
	sortContainer: {
		width: "100%",
	},
	sortHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 12,
		borderBottomColor: "grey",
		borderBottomWidth: 2,
	},
	sortTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	itemBody: {
		padding: 12,
	},
	itemMain: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	itemExpiry: {
		paddingBottom: 10,
		paddingLeft: 0,

		fontSize: 13,
	},
	valid: {
		color: "grey",
	},
	expiringSoon: {
		color: "#ee9f55",
	},
	expired: {
		color: "red",
	},
	itemInfo: {
		flexDirection: "row",
		flex: 3,
	},
	itemCounter: {
		fontSize: 18,
	},
	counterBorder: {
		alignItems: "center",
		width: 40,
		borderColor: "black",
		borderWidth: 2,
		borderRadius: 8,
	},
	itemTitle: {
		paddingLeft: 10,
		fontSize: 20,
	},
	itemButtons: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	itemTags: {
		flexDirection: "row",
		width: "100%",
	},
	tags: {
		color: "white",
		fontSize: 14,
		fontStyle: "italic",
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: "green",
	},
});
