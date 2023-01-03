import { Card, Text, Divider } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionCard = motion(Card);

const GroupCard = (props) => {
  return (
    <Link
      to={`/details`}
      state={{ doc: props.doc }}
      className="linkWidth"
    >
      <MotionCard
        variant="bordered"
        css={{ mw: "550px", cursor: "pointer" }}
        whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
      >
        <Card.Header
          css={{
            display: "inline-flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: "5px",
          }}
        >
          <Text b size="14px">
            {props.doc._id}
          </Text>
          <Text
            b
            size="12px"
            css={{ br: "12px", bgColor: "$purple50", px: "10px", py: "5px" }}
            color="$purple800"
          >
            {props.doc.orders.length}&nbsp;Orders
          </Text>
        </Card.Header>
        <Card.Divider />
        <Card.Body
          css={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            py: "5px",
            alignItems: "center",
          }}
        >
          <div className="groupCardFlex">
            <Text size="13px" b>
              Total
            </Text>
            <Text size="13px" b>
              &#8377;{props.doc.total}
            </Text>
          </div>
          <Divider />
          <div className="groupCardFlex">
            <Text size="13px" b>
              Products
            </Text>
            <Text size="13px" b>
              {props.doc.products} Sold
            </Text>
          </div>
        </Card.Body>
      </MotionCard>
    </Link>
  );
};

export default GroupCard;
