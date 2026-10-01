import { useEffect, useRef, useState } from "react";
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import DateTimePicker, {
	DateType,
	useDefaultStyles,
} from "react-native-ui-datepicker";

const DateSelector = ({ selected, setSelected }: any) => {
	const defaultStyles = useDefaultStyles();

	return (
		<DateTimePicker
			mode="single"
			date={selected}
			onChange={({ date }) => setSelected(date)}
			style={{ backgroundColor: "black" }}
			styles={{
				...defaultStyles,
			}}
		/>
	);
};

export default function AddItem() {
	const [visible, setVisible] = useState(false);

	const [visibleDate, setVisibleDate] = useState(false);
	const [selected, setSelected] = useState<DateType>();

	const triggerRef = useRef<View>(null);
	const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
	const dropdownWidth = 300;

	useEffect(() => {
		if (triggerRef.current && visibleDate) {
			triggerRef.current.measure((fx, fy, width, height, px, py) => {
				setPosition({
					x: px,
					y: py + height,
					width: width,
				});
			});
		}
	}, [visibleDate]);

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

							<View style={{ alignItems: "center", marginTop: 20 }}>
								<Text>Expiry Date</Text>
								<Pressable onPress={() => setVisibleDate(!visibleDate)}>
									<View ref={triggerRef} style={styles.dateInput}>
										<Text
											style={{
												flex: 1,
												textAlign: "center",
												textAlignVertical: "center",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											DD-MM-YYYY
										</Text>
									</View>
								</Pressable>

								<Text>Name of Item</Text>
								<TextInput
									style={styles.textInput}
									placeholder="Potatos"
									placeholderTextColor="gray"
								/>

								<Text>Number of Items</Text>
								<TextInput
									style={styles.textInput}
									placeholder="Potatos"
									placeholderTextColor="gray"
								/>

								<Text>Units</Text>
								<TextInput
									style={styles.textInput}
									placeholder="Potatos"
									placeholderTextColor="gray"
								/>

								<Text>Item Category</Text>
								<TextInput
									style={styles.textInput}
									placeholder="Potatos"
									placeholderTextColor="gray"
								/>

								<Text>Item Location</Text>
								<TextInput
									style={styles.textInput}
									placeholder="Potatos"
									placeholderTextColor="gray"
								/>

								{visibleDate && (
									<Modal
										transparent={true}
										visible={visibleDate}
										animationType="fade"
										onRequestClose={() => setVisibleDate(!visibleDate)}
									>
										<Pressable
											style={styles.calendarOverlay}
											onPress={() => setVisibleDate(!visibleDate)}
										>
											<View
												style={[
													styles.calendarMenu,
													{
														top: position.y,
														left:
															position.x +
															position.width / 2 -
															dropdownWidth / 2,
														width: dropdownWidth,
													},
												]}
											>
												<DateSelector
													selected={selected}
													setSelected={setSelected}
												/>
											</View>
										</Pressable>
									</Modal>
								)}

								{/* <DateSelector selected={selected} setSelected={setSelected} /> */}
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

	textInput: {
		width: 250,
		borderWidth: 1,
		borderColor: "gray",
		color: "black",
	},
	dateInput: {
		width: 200,
		height: 40,
		borderWidth: 2,
		borderColor: "black",
		color: "black",
	},

	calendarOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	calendarMenu: {
		position: "absolute",

		borderRadius: 5,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
});
