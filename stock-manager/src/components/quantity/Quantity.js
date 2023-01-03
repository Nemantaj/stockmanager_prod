import { useEffect, useState } from "react";
import { Card, Text, Input, Button } from "@nextui-org/react";
import { TbSearch, TbSortAscending } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import QuantitySingle from "./QuantitySingle";
import { invtryActions } from "../../redux/inventorySlice";

const MotionCard = motion(Card);
const MotionButton = motion(Button);

const Quantity = (props) => {
  const dispatch = useDispatch();
  const [currentSort, setCurrentSort] = useState({
    field: "name",
    asc: false,
  });
  const [adjList, setAdjList] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value !== "") {
      return;
    } else {
      setAdjList(props.doc);
    }
  }, [props.doc]);

  useEffect(() => {
    if (props.doc.length > 0) {
      const listCopy = [...props.doc];
      let sortCurrent;
      if (currentSort.field === "name") {
        sortCurrent = listCopy.sort((a, b) => {
          let fa = a[currentSort.field].toLowerCase();
          let fb = b[currentSort.field].toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
      } else {
        sortCurrent = listCopy.sort((a, b) => {
          let fa =
            props.category === "AirPods"
              ? a.quantity
              : a.variants.reduce((acc, o) => acc + parseInt(o.quantity), 0);
          let fb =
            props.category === "AirPods"
              ? b.quantity
              : b.variants.reduce((acc, o) => acc + parseInt(o.quantity), 0);

          return fa - fb;
        });
      }
      if (props.category == "iPhones") {
        dispatch(
          invtryActions.setStoredIphones(
            currentSort.asc ? sortCurrent : sortCurrent.reverse()
          )
        );
      } else if (props.category == "AirPods") {
        dispatch(
          invtryActions.setStoredIpods(
            currentSort.asc ? sortCurrent : sortCurrent.reverse()
          )
        );
      } else if (props.category == "Watches") {
        dispatch(
          invtryActions.setStoredWatches(
            currentSort.asc ? sortCurrent : sortCurrent.reverse()
          )
        );
      }
    }
  }, [currentSort]);

  useEffect(() => {
    if (value === "" && props.doc.length > 0) {
      setAdjList(props.doc);
    }

    if (value !== "" && adjList.length > 0) {
      const timeoutId = setTimeout(() => {
        let listCopy = [...props.doc];
        const regex = new RegExp(value, "i");
        const filteredList = listCopy.filter((doc) => {
          return regex.test(doc.name);
        });

        setAdjList(filteredList);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [value]);

  const updateValue = (data) => {
    let newAdj = [...adjList];
    let dataIndex = newAdj.findIndex((doc) => {
      return doc._id.toString() === data._id.toString();
    });
    if (dataIndex >= 0) {
      newAdj[dataIndex] = data;
      setAdjList(newAdj);
    }
  };

  return (
    <MotionCard variant="bordered" css={{ mw: "550px" }}>
      <Card.Header
        css={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div className="qtyHeader spcBtn" ref={props.refer}>
          <Text b>{props.category}</Text>
          <Text
            b
            size="12px"
            css={{ bgColor: "$pink50", py: "5px", px: "10px", br: "12px" }}
            color="$pink800"
          >
            {props.doc.length} Products
          </Text>
        </div>
        <div className="qtyHeader">
          <MotionButton
            size="sm"
            color="$pink800"
            flat
            auto
            icon={<TbSortAscending />}
            onClick={() =>
              setCurrentSort({ field: "name", asc: !currentSort.asc })
            }
          >
            Name
          </MotionButton>
          <MotionButton
            size="sm"
            color="$pink800"
            flat
            auto
            icon={<TbSortAscending />}
            onClick={() =>
              setCurrentSort({ field: "qty", asc: !currentSort.asc })
            }
          >
            Qty
          </MotionButton>
          {props.doc.length >= 5 && (
            <Input
              contentLeft={<TbSearch />}
              
              type="text"
              size="sm"
              placeholder="Search"
              aria-label="Search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          )}
        </div>
      </Card.Header>
      <Card.Divider />
      <Card.Body
        css={{
          p: "5px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {adjList.length > 0 &&
          adjList.map((doc, index) => {
            return (
              <QuantitySingle
                category={props.category}
                products={doc}
                key={index}
                update={updateValue}
              />
            );
          })}
      </Card.Body>
    </MotionCard>
  );
};

export default Quantity;
