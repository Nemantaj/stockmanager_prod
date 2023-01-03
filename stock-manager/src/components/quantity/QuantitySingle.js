import { Text, Card } from "@nextui-org/react";
import QuantityInput from "./QuantityInput";
import { memo } from "react";

const QuantitySingle = (props) => {
  return (
    <Card variant="bordered">
      <Card.Header css={{ py: "5px" }}>
        <Text size="15px" b>{props.products.name}</Text>
      </Card.Header>
      <Card.Divider />
      <Card.Body
        css={{
          py: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {props.products["variants"] &&
          props.products.variants.map((doc, index) => {
            return (
              <QuantityInput
                variant={doc}
                key={index}
                category={props.category}
                name={props.products.name}
                pid={props.products.pid}
                id={props.products._id}
                update={props.update}
              />
            );
          })}
        {!props.products["variants"] && (
          <QuantityInput
            key={props.products._id}
            variant={{
              storage: "Stock",
              quantity: props.products.quantity,
              _id: "",
            }}
            category={props.category}
            name={props.products.name}
            pid={props.products.pid}
            id={props.products._id}
            update={props.update}
          />
        )}
      </Card.Body>
    </Card>
  );
};

const compareProps = (prevProps, nextProps) => {
  if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
    return true;
  }
  return false;
};

export default memo(QuantitySingle, compareProps);
