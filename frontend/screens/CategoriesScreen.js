import { View, FlatList } from "react-native";
import { CATEGORIES } from "../data/dummy-data";

const CategoriesScreen = () => {
  return <FlatList data={CATEGORIES}/>;
};
export default CategoriesScreen;
