import { useState } from "react";
import { Input, Button, Text, Loading } from "@nextui-org/react";
import { TbPlus, TbMinus } from "react-icons/tb";
import { motion } from "framer-motion";
import useInput from "../../hooks/useInput";
import { useSelector, useDispatch } from "react-redux";
import { invtryActions } from "../../redux/inventorySlice";

const MotionButton = motion(Button);
const btnAnim = {
  whileTap: { scale: 0.9 },
};

const QuantityInput = (props) => {
  const token = useSelector((state) => state.invtry.token);
  const dispatch = useDispatch();
  const {
    inputValue: numValue,
    error: numError,
    isValid: numValid,
    inputHandler: numHandler,
    blurHandler: numBlur,
    clearInput: clearNum,
  } = useInput((value) => value != "" || value != 0);

  const [loading, setLoading] = useState(false);
  const storedIphones = useSelector((state) => state.invtry.storedIphones);
  const storedIpods = useSelector((state) => state.invtry.storedIpods);
  const storedWatches = useSelector((state) => state.invtry.storedWatches);

  const addHandler = () => {
    if (numValid) {
      setLoading(true);
      fetch("/add-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          variantId: props.variant._id,
          id: props.id,
          name: props.name,
          pid: props.pid,
          desc:
            props.variant.storage ||
            props.variant.size + " " + props.variant.type,
          add: numValue,
          category: props.category,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.log("Error");
          }
          return res.json();
        })
        .then((data) => {
          if (props.category === "iPhones") {
            props.update(data.response);
            let copyProds = [...storedIphones],
              findIndex;
            findIndex = copyProds.findIndex((doc) => {
              return doc._id.toString() === data.response._id.toString();
            });
            if (findIndex >= 0) {
              copyProds[findIndex] = data.response;
              dispatch(invtryActions.setStoredIphones(copyProds));
            }
          } else if (props.category === "AirPods") {
            props.update(data.response);
            let copyProds = [...storedIpods],
              findIndex;
            findIndex = copyProds.findIndex((doc) => {
              return doc._id.toString() === data.response._id.toString();
            });
            console.log(findIndex);
            if (findIndex >= 0) {
              copyProds[findIndex] = data.response;
              dispatch(invtryActions.setStoredIpods(copyProds));
            }
          } else if (props.category === "Watches") {
            props.update(data.response);
            let copyProds = [...storedWatches],
              findIndex;
            findIndex = copyProds.findIndex((doc) => {
              return doc._id.toString() === data.response._id.toString();
            });
            if (findIndex >= 0) {
              copyProds[findIndex] = data.response;
              dispatch(invtryActions.setStoredWatches(copyProds));
            }
          }

          clearNum();
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const subHandler = () => {
    if (numValid) {
      setLoading(true);
      fetch("/sub-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          variantId: props.variant._id,
          id: props.id,
          name: props.name,
          pid: props.pid,
          desc:
            props.variant.storage ||
            props.variant.size + " " + props.variant.type,
          sub: -Number(numValue),
          category: props.category,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            console.log("Error");
          }
          return res.json();
        })
        .then((data) => {
          if (props.category === "iPhones") {
            props.update(data.response);
            let copyProds = [...storedIphones],
              findIndex;
            findIndex = copyProds.findIndex((doc) => {
              return doc._id.toString() === data.response._id.toString();
            });
            if (findIndex >= 0) {
              copyProds[findIndex] = data.response;
              dispatch(invtryActions.setStoredIphones(copyProds));
            }
          } else if (props.category === "AirPods") {
            props.update(data.response);
            let copyProds = [...storedIpods],
              findIndex;
            findIndex = copyProds.findIndex((doc) => {
              return doc._id.toString() === data.response._id.toString();
            });
            if (findIndex >= 0) {
              copyProds[findIndex] = data.response;
              dispatch(invtryActions.setStoredIpods(copyProds));
            }
          } else if (props.category === "Watches") {
            props.update(data.response);
            let copyProds = [...storedWatches],
              findIndex;
            findIndex = copyProds.findIndex((doc) => {
              return doc._id.toString() === data.response._id.toString();
            });
            if (findIndex >= 0) {
              copyProds[findIndex] = data.response;
              dispatch(invtryActions.setStoredWatches(copyProds));
            }
          }
          clearNum();
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  return (
    <div className="qtyInputLine">
      <Text css={{ w: "20%", wordWrap: "break-word" }} size="15px">
        {props.variant.storage || props.variant.size + " " + props.variant.type}
      </Text>

      <div className="qty">
        <Text color="$blue800" size="15px" className="qtyProd" b>
          {props.variant.quantity}
        </Text>
        |
        <Input
          type="number"
          className="qtyInput"
          size="sm"
          css={{ w: "70%" }}
          aria-label="Quantity"
          placeholder="Number..."
          onChange={numHandler}
          value={numValue}
        />
      </div>

      <MotionButton
        icon={loading ? <Loading type="spinner" /> : <TbMinus />}
        color="error"
        auto
        size="sm"
        flat
        onClick={subHandler}
        {...btnAnim}
      />
      <MotionButton
        icon={loading ? <Loading type="spinner" /> : <TbPlus />}
        color="success"
        auto
        size="sm"
        flat
        onClick={addHandler}
        {...btnAnim}
      />
    </div>
  );
};

export default QuantityInput;
