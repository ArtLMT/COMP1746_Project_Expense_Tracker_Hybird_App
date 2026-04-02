// import { View, Text, Button } from "react-native";
// import { addProduct, getProducts } from "../services/productService";

// export default function Home() {

//   const handleAdd = async () => {
//     await addProduct({
//       name: "Laptop",
//       price: 2000,
//     });
//     console.log("Added!");
//   };

//   const handleGet = async () => {
//     const data = await getProducts();
//     console.log(data);
//   };

//   return (
//     <View style={{ marginTop: 50 }}>
//       <Text>Firestore Test 🚀</Text>
//       <Button title="Add Product" onPress={handleAdd} />
//       <Button title="Get Products" onPress={handleGet} />
//     </View>
//   );
// }

import { View, Text, Button } from "react-native";
import { getProjects, getExpenses } from "../services/testConnection";

export default function Home() {

  const handleTest = async () => {
    try {
      const projects = await getProjects();
      const expenses = await getExpenses();

      console.log("Projects:", projects);
      console.log("Expenses:", expenses);

    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Text>Test Firestore</Text>
      <Button title="Test Connection" onPress={handleTest} />
    </View>
  );
}