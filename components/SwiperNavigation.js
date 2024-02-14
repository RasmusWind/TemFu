import { View, StyleSheet, Text, Button } from "react-native";
export default function SwiperNavigation({
  labels,
  activeLabelIndex,
  setScreenIndex,
}) {
  return (
    <View style={styles.labelsContainer}>
      {labels.map((label, index) => (
        <View key={index}>
          <Text
            onPress={() => setScreenIndex(index)}
            style={{
              ...(index == activeLabelIndex
                ? styles.activelabel
                : styles.label),
              ...styles.labels,
            }}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  labelsContainer: {
    borderTopWidth: 1,
    height: "200px",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  labels: {
    color: "black",
    padding: 5,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderRadius: 2,
  },
  label: {
    borderColor: "pink",
  },
  activelabel: {
    fontWeight: "bold",
    borderColor: "red",
  },
});
