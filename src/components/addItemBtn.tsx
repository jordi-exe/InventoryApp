import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, {
	DateType,
	useDefaultStyles,
} from "react-native-ui-datepicker";

export default function AddItem() {
	const [visible, setVisible] = useState(false);
	const [selected, setSelected] = useState<DateType>();
	const defaultStyles = useDefaultStyles();

	return (
		<View>
			<Pressable
				onPress={() => setVisible(!visible)}
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? "dimgrey" : "slategrey",
					},
					styles.addBtn,
				]}
			/>

			{visible && (
				<Modal transparent={true} visible={visible} animationType="fade">
					<Pressable
						style={styles.modalOverlay}
						onPress={() => setVisible(!visible)}
					>
						<View
							style={styles.modalContainer}
							onStartShouldSetResponder={() => true}
						>
							<View>
								<Text>New Item</Text>
							</View>

							<View>
								<Text>Name of Item</Text>
								<Text>Number of Items</Text>
								<Text>Units</Text>
								<Text>Item Category</Text>
								<Text>Item Location</Text>
								<Text>Expiry Date</Text>
								<DateTimePicker
									mode="single"
									date={selected}
									onChange={({ date }) => setSelected(date)}
									styles={{
										...defaultStyles,
										days: { backgroundColor: "red" },
									}}
								/>
							</View>
						</View>
					</Pressable>
				</Modal>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	calendarTest: {
		backgroundColor: "red",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",

		borderColor: "red",
		borderWidth: 2,
	},
	modalContainer: {
		alignItems: "center",
		backgroundColor: "white",
		width: "90%",
		height: "70%",
		marginBottom: 60,
	},
	addBtn: {
		position: "absolute",
		width: 100,
		height: 100,
		left: 60,
		bottom: 30,

		padding: 10,
		borderRadius: "50%",
	},
});
