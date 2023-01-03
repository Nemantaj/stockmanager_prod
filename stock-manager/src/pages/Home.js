import { Text, Button, Card } from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  TbChartBar,
  TbPaperBag,
  TbArrowAutofitUp,
  TbChartArcs,
  TbLogout,
} from "react-icons/tb";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { invtryActions } from "../redux/inventorySlice";

const MotionText = motion(Text);
const MotionCard = motion(Card);

const btnAnim = {
  whileTap: { scale: 0.9 },
  whileHover: { scale: 1.05 },
};

const Home = () => {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(invtryActions.revokeAuth());
    localStorage.removeItem("token");
  };

  return (
    <motion.div className="alignDivCenter homeDiv">
      <MotionText h2>Marvans</MotionText>
      <MotionCard
        variant="bordered"
        css={{ mw: "550px", mt: "50px", border: "none" }}
      >
        <Card.Body className="homeActionCon">
          <Link to="/report">
            <motion.div className="homeAction" {...btnAnim}>
              <Text size="40px">
                <TbChartBar />
              </Text>
              <Text b>Reports</Text>
            </motion.div>
          </Link>

          <Link to="/inventory">
            <motion.div className="homeAction" {...btnAnim}>
              <Text size="40px">
                <TbPaperBag />
              </Text>
              <Text b>Inventory</Text>
            </motion.div>
          </Link>
          <a
            href="https://scan.mrsaini.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div className="homeAction" {...btnAnim}>
              <Text size="40px">
                <TbArrowAutofitUp />
              </Text>
              <Text b>Updates</Text>
            </motion.div>
          </a>
          <motion.div className="homeAction" {...btnAnim} onClick={logout}>
            <Text size="40px">
              <TbLogout />
            </Text>
            <Text b>Logout</Text>
          </motion.div>
        </Card.Body>
      </MotionCard>
    </motion.div>
  );
};

export default Home;
