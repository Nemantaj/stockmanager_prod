import {
  Card,
  Button,
  Input,
  Text,
  Loading,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { invtryActions } from "../redux/inventorySlice";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const handler = () => {
    setLoading(true);
    setError(false);
    fetch("/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pass: value }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.success) {
          setError(true);
          setLoading(false);
          return setMsg(data.msg);
        }

        dispatch(invtryActions.setAuth(data.token));
        localStorage.setItem("token", data.token);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        return setMsg(err);
      });
  };
  return (
    <motion.div
      className="alignDivCenter homeDiv"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card variant="bordered" css={{ mw: "550px" }}>
        <div className="alignDivCenter p1">
          <Text h3 css={{ w: "fit-content" }}>
            Enter password to continue :
          </Text>
          <Divider />

          <Input.Password
            css={{ w: "100%", textAlign: "right" }}
            className="input1"
            clearable
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {error && (
            <Text
              color="error"
              css={{
                bgColor: "$red100",
                padding: "5px 10px",
                borderRadius: "20px",
                textAlign: "center",
              }}
            >
              {msg}
            </Text>
          )}
          <Button
            color="error"
            rounded
            onClick={handler}
            disabled={value !== "" ? false : true}
          >
            {loading ? <Loading type="spinner" color="white" /> : "Enter"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Auth;
