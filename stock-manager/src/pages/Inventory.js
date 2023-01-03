import { useEffect, useState, Fragment, useRef } from "react";
import { Text, Button, Loading } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { TbArrowBackUp, TbChartBar } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { invtryActions } from "../redux/inventorySlice";

import Quantity from "../components/quantity/Quantity";

const dummyProduct = [
  {
    category: "iPhones",
    products: [
      {
        name: "iPhone 13 Pro",
        variants: [
          { variant: "128GB", qty: 214 },
          { variant: "256GB", qty: 60 },
        ],
      },
      {
        name: "iPhone 13 Pro Max",
        variants: [
          { variant: "128GB", qty: 214 },
          { variant: "256GB", qty: 60 },
        ],
      },
      {
        name: "iPhone 13",
        variants: [
          { variant: "128GB", qty: 214 },
          { variant: "256GB", qty: 60 },
        ],
      },
    ],
  },
  {
    category: "MacBooks",
    products: [
      {
        name: "Macbook Pro",
        variants: [
          { variant: "128GB", qty: 214 },
          { variant: "256GB", qty: 60 },
        ],
      },
      {
        name: "MacBook Air",
        variants: [
          { variant: "128GB", qty: 214 },
          { variant: "256GB", qty: 60 },
        ],
      },
      {
        name: "MacBook Pro 15",
        variants: [
          { variant: "128GB", qty: 214 },
          { variant: "256GB", qty: 60 },
        ],
      },
    ],
  },
];

const Inventory = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.invtry.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  //Set redux products
  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("/get-inventory", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          setError(true);
        }
        return res.json();
      })
      .then((data) => {
        dispatch(invtryActions.setStoredIphones(data.iphones));
        dispatch(invtryActions.setStoredIpods(data.ipods));
        dispatch(invtryActions.setStoredWatches(data.iwatches));
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, []);

  //Get products from redux
  const storedIphones = useSelector((state) => state.invtry.storedIphones);
  const storedIpods = useSelector((state) => state.invtry.storedIpods);
  const storedWatches = useSelector((state) => state.invtry.storedWatches);

  //ScrollTo Refs
  const scrollTo = (ref) => {
    const element = ref;
    if (element) {
      element.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  return (
    <motion.div>
      <motion.div className="header">
        <Link to="/" className="headerLink">
          <TbArrowBackUp className="icoAdjust" />
        </Link>
        <Text b>Inventory</Text>
        <div className="headerLink headerLinkAddon">
          <Button
            auto
            size="sm"
            color="error"
            icon={<TbChartBar />}
            onClick={() => {
              navigate("/inventory-history");
            }}
          />
        </div>
      </motion.div>
      <motion.div className="qtyContainer alignDivCenter">
        {loading ? (
          <Loading type="spinner" />
        ) : (
          <Fragment>
            {error && (
              <Text
                color="error"
                css={{ br: "12px", bgColor: "$red50", py: "5px", px: "10px" }}
              >
                An error occured while trying to retrieve data from the server!
              </Text>
            )}
            {storedIphones.length > 0 && (
              <Quantity
                refer={ref1}
                key="iphones"
                doc={storedIphones}
                category="iPhones"
              />
            )}
            {storedIpods.length > 0 && (
              <Quantity
                refer={ref2}
                key="airpods"
                doc={storedIpods}
                category="AirPods"
              />
            )}
            {storedWatches.length > 0 && (
              <Quantity
                refer={ref3}
                key="watches"
                doc={storedWatches}
                category="Watches"
              />
            )}
            <div className="spaceDiv"></div>
            <motion.div className="invtryNav">
              <Button.Group className="boxShadow">
                <Button onClick={() => scrollTo(ref1)}>iPhones</Button>
                <Button onClick={() => scrollTo(ref2)}>AirPods</Button>
                <Button onClick={() => scrollTo(ref3)}>iWatch</Button>
              </Button.Group>
            </motion.div>
          </Fragment>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Inventory;
