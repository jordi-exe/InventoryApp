import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
			<Text>{label}</Text>

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
					{filteredOptions.map((option) => (
						<Pressable
							key={option}
							style={styles.suggestion}
							onPress={() => {
								setValue(option);
								setFocused(false);
							}}
						>
							<Text>{option}</Text>
						</Pressable>
					))}
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

		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "lightgray",
		borderRadius: 5,

		zIndex: 1000,
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
