import {
  Card,
  Text,
  Input,
  Button,
  Divider,
  Badge,
  Loading,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { TbArrowBackUp, TbFileExport } from "react-icons/tb";
import OrderCard from "../components/ui/OrderCard";
const MotionButton = motion(Button);

const ReportDate = () => {
  const { state } = useLocation();
  const orderData = state?.doc || {};
  console.log(orderData);

  return (
    <motion.div>
      <motion.div className="header">
        <Link to={-1} className="headerLink">
          <TbArrowBackUp className="icoAdjust" />
        </Link>
        <Text b>{orderData._id}</Text>
        <Button size="sm" icon={<TbFileExport />} auto color="error" />
      </motion.div>
      <motion.div className="ordersDiv margin70 alignDivCenter">
        {orderData.orders.length > 0 ? (
          orderData.orders.map((doc) => {
            return <OrderCard key={doc._id} doc={doc} />;
          })
        ) : (
          <Loading type="spinner" />
        )}
      </motion.div>
    </motion.div>
  );
};

export default ReportDate;
