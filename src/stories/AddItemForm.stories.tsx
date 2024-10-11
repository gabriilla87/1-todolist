import { AddItemForm } from "../components/AddItemForm/AddItemForm";
import { action } from "@storybook/addon-actions";

export default {
  title: "Add Item Form",
};

const addItemCallback = action("Value changed");

export const AddItemFormDemo = () => {
  return <AddItemForm addItem={addItemCallback} />;
};
export const DisabledAddItemFormDemo = () => {
  return <AddItemForm addItem={addItemCallback} disabled={true} />;
};
