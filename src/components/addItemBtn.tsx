import { AutoCompleteInput } from "@/components/autocompleteInput";
import { DateSelector } from "@/components/dateSelector";
import { addItem, loadOptions } from "@/database/database";
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

const FormatDate = (date?: Date) => {
	if (!date) return "DD-MM-YYYY";

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};

type AddItemProps = {
	onItemAdded?: () => void;
};

type FormErrorProps = {
	itemName?: string;
	quantity?: string;
	unit?: string;
	category?: string;
	location?: string;
};

export default function AddItem(onItemAdded?: AddItemProps) {
	const db = useSQLiteContext();

	//The visible state for the main Add Item modal
	const [visible, setVisible] = useState(false);

	//The visible state for the date selector modal
	const [visibleDate, setVisibleDate] = useState(false);
	const [selected, setSelected] = useState<Date>();

	//The position of the date selector modal
	const triggerRef = useRef<View>(null);
	const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
	const dropdownWidth = 300;

	//Autocomplete states
	const [units, setUnits] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [locations, setLocations] = useState<string[]>([]);

	//Form states
	const [itemName, setItemName] = useState("");
	const [quantity, setQuantity] = useState("");
	const [unit, setUnit] = useState("");
	const [category, setCategory] = useState("");
	const [location, setLocation] = useState("");
	const [errors, setErrors] = useState<FormErrorProps>({});

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

	const formatDatabaseDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		return `${year}-${month}-${day}`;
	};

	function clearForm() {
		setItemName("");
		setQuantity("");
		setUnit("");
		setCategory("");
		setLocation("");
		setSelected(undefined);
		setVisibleDate(false);
		setErrors({});
	}

	async function handleAddItem() {
		const trimmedItemName = itemName.trim();
		const trimmedUnit = unit.trim();
		const trimmedCategory = category.trim();
		const trimmedLocation = location.trim();

		const numericQuantity = Number(quantity);

		const validationErrors: FormErrorProps = {};

		if (!trimmedItemName) {
			validationErrors.itemName = "Item name is required";
		}

		if (!trimmedUnit) {
			validationErrors.unit = "Unit is required";
		}

		if (!quantity.trim()) {
			validationErrors.quantity = "Quantity is required";
		} else if (!Number.isFinite(numericQuantity)) {
			validationErrors.quantity = "Quantity must be a number";
		} else if (numericQuantity < 0) {
			validationErrors.quantity = "Quantity cannot be negative";
		}

		if (!trimmedCategory) {
			validationErrors.category = "Category is required";
		}

		if (!trimmedLocation) {
			validationErrors.location = "Location is required";
		}

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setErrors({});

		try {
			await addItem(db, {
				itemName: trimmedItemName,
				quantity: numericQuantity,
				unit: trimmedUnit,
				category: trimmedCategory,
				location: trimmedLocation,
				expiryDate: selected ? formatDatabaseDate(selected) : null,
			});

			console.log("Item added successfully");

			clearForm();
			setVisible(false);

			onItemAdded?.onItemAdded?.();
		} catch (error) {
			console.error("Failed to add item:", error);
		}
	}

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
								<View>
									<Text>New Item</Text>
								</View>

								<ScrollView
									style={styles.formScrollView}
									contentContainerStyle={styles.formContent}
									keyboardShouldPersistTaps="handled"
								>
									<View style={{ alignItems: "center", marginTop: 20 }}>
										<Text>Expiry Date</Text>
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

										<Text>Name of Item</Text>
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

										<Text>Number of Items</Text>
										<TextInput
											style={styles.textInput}
											value={quantity}
											onChangeText={(text) => {
												if (/^\d*\.?\d*$/.test(text)) {
													setQuantity(text);
												}
											}}
											placeholder="Potatos"
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

										<Button title="Add Item" onPress={handleAddItem} />
										<Button
											title="Cancel"
											onPress={() => {
												clearForm();
												setVisible(false);
											}}
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
	calendarTest: {
		backgroundColor: "red",
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

	errorText: {
		color: "red",
		marginBottom: 4,
	},
});
