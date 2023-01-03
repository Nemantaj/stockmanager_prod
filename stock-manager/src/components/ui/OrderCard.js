import { Card, Text } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionCard = motion(Card);

const OrderCard = (props) => {
  return (
    <Link
      to={`/details/${props.doc._id}`}
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
            {props.doc.order_date.slice(0, 10)}
          </Text>
          <Text b size="14px">
            Total:- &#8377;{props.doc.total}
          </Text>
        </Card.Header>
        <Card.Divider />
        <Card.Body
          css={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "5px",
            py: "5px",
          }}
        >
          <div className="orderCardInfo">
            <Text
              size="13px"
              css={{ br: "12px", bgColor: "$green50" }}
              color="$green900"
            >
              Paid
              <br /> &#8377;{props.doc.total_paid}
            </Text>
          </div>

          <div className="orderCardInfo">
            <Text
              size="13px"
              css={{ br: "12px", bgColor: "$red50" }}
              color="$red900"
            >
              Type
              <br />
              {props.doc.payment_type}
            </Text>
          </div>

          <div className="orderCardInfo">
            <Text
              size="13px"
              css={{ br: "12px", bgColor: "$cyan50" }}
              color="$cyan900"
            >
              Advance
              <br />
              &#8377;{props.doc.advance || 0}
            </Text>
          </div>
          <div className="orderCardInfo">
            <Text
              size="13px"
              css={{ br: "12px", bgColor: "$purple50" }}
              color="$purple800"
            >
              BillNo.
              <br />
              {props.doc.billno}
            </Text>
          </div>
        </Card.Body>
      </MotionCard>
    </Link>
  );
};

export default OrderCard;
