import { Feather } from "@react-native-vector-icons/feather";
import { PropsWithChildren, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AccordionItemProps = PropsWithChildren<{
	title: string;
}>;

export default function AccordionItem({ children, title }: AccordionItemProps) {
	const [expanded, setExpanded] = useState(false);
	var expandIcon;
	function toggleItem() {
		setExpanded(!expanded);
	}

	const body = <View style={styles.itemBody}>{children}</View>;

	const item = (
		<View style={styles.itemBody}>
			<View style={styles.itemMain}>
				<View style={styles.itemInfo}>
					<View style={styles.counterBorder}>
						<Text style={styles.itemCounter}>4</Text>
					</View>

					<Text style={styles.itemTitle}>Title</Text>
				</View>

				<View style={styles.itemButtons}>
					<Text>Edit</Text>
					<Text>Bin</Text>
				</View>
			</View>
			<View style={styles.itemTags}>
				<Text style={styles.tags}>Item Tags</Text>
			</View>
		</View>
	);

	return (
		<View style={styles.sortContainer}>
			<TouchableOpacity style={styles.sortHeader} onPress={toggleItem}>
				<Text style={styles.sortTitle}>{title}</Text>
				<Feather
					name={expanded ? "arrow-up-circle" : "arrow-down-circle"}
					size={24}
					color="black"
				/>
			</TouchableOpacity>
			{expanded && item}
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
		justifyContent: "space-around",
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
