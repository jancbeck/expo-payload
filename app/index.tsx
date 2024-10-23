import { Image, Text, View } from "react-native";

export default async function HomePage() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/2");
  const json = await res.json();
  return (
    <View style={{ padding: 8, borderWidth: 1 }}>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>{json.name}</Text>
      <Image
        source={{ uri: json.sprites.front_default }}
        style={{ width: 100, height: 100 }}
      />

      {json.abilities.map((ability) => (
        <Text key={ability.ability.name}>- {ability.ability.name}</Text>
      ))}
    </View>
  );
}
