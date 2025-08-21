import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No TODOs</Text>
      <Text style={styles.subtitle}>Add your first task to get started.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 24 },
  title: { color: colors.fg, fontSize: 18, fontWeight: "700" },
  subtitle: { color: colors.muted, marginTop: 6 },
});
