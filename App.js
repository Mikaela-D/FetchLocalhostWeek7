// C:\Users\Mikaela\Mobile App Development\FetchLocalhostWeek7\FetchLocalhostWeek7\App.js

// import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Fetch" component={FetchScreen} />
        <Stack.Screen name="ViewProduct" component={ViewProductScreen} />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Go to Fetch Screen"
        onPress={() => navigation.navigate("Fetch")}
      />
      <Button
        title="Go to View Product Screen"
        onPress={() => navigation.navigate("ViewProduct")}
      />
      <Button
        title="Go to Product List"
        onPress={() => navigation.navigate("ProductList")}
      />
    </View>
  );
};

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://a9ee-193-1-57-1.ngrok-free.app/");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Product List</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.ourId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ViewProduct", { ourId: item.ourId })
            }
          >
            <Text style={{ padding: 10, fontSize: 18 }}>
              {item.name} - ${item.price}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const ViewProductScreen = ({ route }) => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    ourId: "",
  });

  const callAPI = async () => {
    try {
      const res = await fetch(
        "https://a9ee-193-1-57-1.ngrok-free.app/getSpecificProduct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ourId: route.params.ourId }),
        }
      );

      const data = await res.json();
      setProductData(data.theProduct);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <Text>{"Product Name: " + productData.name}</Text>
      <Text>{"Product ID: " + productData.ourId}</Text>
      <Text>{"Product Price: " + productData.price}</Text>
      <Button title="Get product details" onPress={callAPI} />
    </View>
  );
};

const FetchScreen = () => {
  const [text, setText] = useState(". . . waiting for fetch API");

  const callAPI = async () => {
    try {
      const res = await fetch(
        "https://a9ee-193-1-57-1.ngrok-free.app/getSpecificProduct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ourId: "1" }),
        }
      );

      const data = await res.json();
      setText(JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      <Text>{text}</Text>
      <Button title="Go Fetch Some Data" onPress={callAPI} />
    </View>
  );
};
