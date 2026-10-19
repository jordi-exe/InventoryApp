import { AutoCompleteInput } from "@/components/autocompleteInput";
import { DateSelector } from "@/components/dateSelector";
import { loadOptions } from "@/database/database";
import { Feather } from "@react-native-vector-icons/feather";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
	Button,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

type FormErrorProps = {
	itemName?: string;
	quantity?: string;
	unit?: string;
	category?: string;
	location?: string;
};

type InventoryItem = {
	id: number;
	title: string;
	itemCount: number;
	unit: string;
	location: string;
	category: string;
	expiryDate?: string;
};

type EditItemProps = {
	item: InventoryItem;
};

const FormatDate = (date?: Date) => {
	if (!date) return "DD-MM-YYYY";

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};

export default function EditItem({ item }: EditItemProps) {
	const db = useSQLiteContext();

	const [visible, setVisible] = useState(false);

	//The visible state for the date selector modal
	const [visibleDate, setVisibleDate] = useState(false);
	const [selected, setSelected] = useState<Date>();

	//Form states
	const [itemName, setItemName] = useState("");
	const [quantity, setQuantity] = useState("");
	const [unit, setUnit] = useState("");
	const [category, setCategory] = useState("");
	const [location, setLocation] = useState("");
	const [errors, setErrors] = useState<FormErrorProps>({});

	//The position of the date selector modal
	const triggerRef = useRef<View>(null);
	const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
	const dropdownWidth = 300;

	//Autocomplete states
	const [units, setUnits] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [locations, setLocations] = useState<string[]>([]);

	useEffect(() => {
		if (visible) {
			loadSuggestions();
		}
	}, [visible]);

	async function loadSuggestions() {
		const options = await loadOptions(db);

		setUnits(options.units);
		setCategories(options.categories);
		setLocations(options.locations);
	}

	function populateFormData() {
		setItemName(item.title);
		setQuantity(String(item.itemCount));
		setUnit(item.unit);
		setCategory(item.category);
		setLocation(item.location);

		setSelected(
			item.expiryDate
				? new Date(`${item.expiryDate.slice(0, 10)}T00:00:00`)
				: undefined,
		);
	}

	return (
		<View>
			<Feather
				name="edit"
				size={24}
				color="black"
				onPress={() => {
					populateFormData();
					setVisible(!visible);
				}}
			/>

			{visible && (
				<Modal transparent={true} visible={visible} animationType="fade">
					<KeyboardAvoidingView
						style={styles.keyboardAvoidingView}
						behavior={Platform.OS === "ios" ? "padding" : "height"}
					>
						<Pressable
							style={styles.modalOverlay}
							onPress={() => setVisible(!visible)}
						>
							<View
								style={styles.modalContainer}
								onStartShouldSetResponder={() => true}
							>
								<View style={styles.modalHeader}>
									<Text style={styles.modalTitle}>Edit Item</Text>
								</View>

								<ScrollView
									style={styles.formScrollView}
									contentContainerStyle={styles.formContent}
									keyboardShouldPersistTaps="handled"
								>
									<View style={styles.modalBody}>
										<Text style={styles.label}>Expiry Date</Text>
										<Pressable
											onPress={() => {
												triggerRef.current?.measure(
													(_fx, _fy, width, height, px, py) => {
														setPosition({
															x: px,
															y: py + height,
															width,
														});

														setVisibleDate(true);
													},
												);
											}}
										>
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
													{FormatDate(selected)}
												</Text>
											</View>
										</Pressable>

										<Text style={styles.label}>Name of Item</Text>
										<TextInput
											style={styles.textInput}
											value={itemName}
											onChangeText={setItemName}
											placeholder="Potatos"
											placeholderTextColor="gray"
										/>
										{errors.itemName && (
											<Text style={styles.errorText}>{errors.itemName}</Text>
										)}

										<Text style={styles.label}>Number of Items</Text>
										<TextInput
											style={styles.textInput}
											value={quantity}
											onChangeText={(text) => {
												if (/^\d*\.?\d*$/.test(text)) {
													setQuantity(text);
												}
											}}
											placeholder="99"
											placeholderTextColor="gray"
											keyboardType="numeric"
										/>
										{errors.quantity && (
											<Text style={styles.errorText}>{errors.quantity}</Text>
										)}

										<AutoCompleteInput
											label="Units"
											value={unit}
											setValue={setUnit}
											options={units}
											placeholder="Units"
										/>
										{errors.unit && (
											<Text style={styles.errorText}>{errors.unit}</Text>
										)}

										<AutoCompleteInput
											label="Item Category"
											value={category}
											setValue={setCategory}
											options={categories}
											placeholder="Item Category"
										/>
										{errors.category && (
											<Text style={styles.errorText}>{errors.category}</Text>
										)}

										<AutoCompleteInput
											label="Item Location"
											value={location}
											setValue={setLocation}
											options={locations}
											placeholder="Item Location"
										/>
										{errors.location && (
											<Text style={styles.errorText}>{errors.location}</Text>
										)}

										<View
											style={{
												paddingTop: 15,
												width: "60%",
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											<Button title="Update" />
											<Button
												title="Cancel"
												onPress={() => {
													setVisible(false);
												}}
											/>
										</View>

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
									</View>
								</ScrollView>
							</View>
						</Pressable>
					</KeyboardAvoidingView>
				</Modal>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
	},
	formScrollView: {
		width: "100%",
		flex: 1,
	},

	formContent: {
		alignItems: "center",
		paddingTop: 20,
		paddingBottom: 100,
	},

	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		alignItems: "center",
		backgroundColor: "white",
		width: "90%",
		height: "80%",
		borderRadius: 10,
		overflow: "visible",
	},
	modalHeader: {
		padding: 5,
	},
	modalTitle: {
		padding: 15,
		fontSize: 20,
		fontWeight: "bold",
	},
	modalBody: {
		alignItems: "center",
		gap: 5,
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

	label: {
		fontStyle: "italic",
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

	errorText: {
		color: "red",
		marginBottom: 4,
	},
});
