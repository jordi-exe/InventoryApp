import { useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

type AutocompleteInputProps = {
	label: string;
	value: string;
	setValue: (value: string) => void;
	options: string[];
	placeholder?: string;
};

export const AutoCompleteInput = ({
	label,
	value,
	setValue,
	options,
	placeholder,
}: AutocompleteInputProps) => {
	const [focused, setFocused] = useState(false);

	const filteredOptions = options.filter((option) =>
		option.toLowerCase().includes(value.toLowerCase()),
	);

	return (
		<View style={styles.autocompleteContainer}>
			<Text
				style={{ alignSelf: "center", marginBottom: 5, fontStyle: "italic" }}
			>
				{label}
			</Text>

			<TextInput
				style={styles.textInput}
				value={value}
				onChangeText={setValue}
				placeholder={placeholder}
				placeholderTextColor="gray"
				onFocus={() => setFocused(true)}
				onBlur={() => {
					//Lets the suggestions turn invisible when selecting a new textbox
					setTimeout(() => setFocused(false), 100);
				}}
			/>

			{focused && filteredOptions.length > 0 && (
				<View style={styles.suggestionsContainer}>
					<ScrollView
						keyboardShouldPersistTaps="handled"
						nestedScrollEnabled={true}
					>
						{filteredOptions.map((option) => (
							<Pressable
								key={option}
								style={styles.suggestion}
								onPress={() => {
									console.log("Selected suggestion:", option);

									setValue(option);
									setFocused(false);
								}}
							>
								<Text>{option}</Text>
							</Pressable>
						))}
					</ScrollView>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	autocompleteContainer: {
		position: "relative",
		width: "100%",
	},

	suggestionsContainer: {
		position: "absolute",
		top: "100%",
		left: 0,
		right: 0,

		maxHeight: 150,
		overflow: "hidden",

		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "lightgray",
		borderRadius: 5,

		zIndex: 2000,
		elevation: 5,
	},

	suggestion: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: "lightgray",
	},

	textInput: {
		width: 250,
		borderWidth: 1,
		borderColor: "gray",
		color: "black",
	},
});
