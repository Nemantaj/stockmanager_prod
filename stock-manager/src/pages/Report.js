import { Card, Text, Input, Button, Loading } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { TbArrowBackUp, TbDownload } from "react-icons/tb";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { invtryActions } from "../redux/inventorySlice";
import GroupCard from "../components/ui/GroupCard";

const MotionButton = motion(Button);
const btnAnim = { whileTap: { scale: 0.9 } };

const Report = () => {
  const token = useSelector((state) => state.invtry.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const storedReports = useSelector((state) => state.invtry.storedReports);
  const dateGte = useSelector((state) => state.invtry.dateGte);
  const dateLte = useSelector((state) => state.invtry.dateLte);

  useEffect(() => {
    if (storedReports.length === 0) {
      setLoading(true);
      setError(false);
      fetch(`/group-orders?gte=${dateGte}&lte=${dateLte}`, {
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
          dispatch(invtryActions.setStoredReports(data));
          setLoading(false);
        })
        .catch((err) => {
          setError(true);
          setLoading(false);
        });
    }
  }, []);

  const fetchReport = () => {
    if (!dateGte || !dateLte) {
      return;
    }

    setLoading(true);
    setError(false);
    fetch(`/group-orders?gte=${dateGte}&lte=${dateLte}`, {
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
        dispatch(invtryActions.setStoredReports(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <motion.div>
      <motion.div className="header">
        <Link to="/" className="headerLink">
          <TbArrowBackUp className="icoAdjust" />
        </Link>
        <Text b>Orders Report</Text>
        <div className="headerLink"></div>
      </motion.div>
      <motion.div className="qtyContainer alignDivCenter">
        <Card variant="bordered" css={{ mw: "550px" }}>
          <Card.Body className="reportDate " css={{ py: "10px" }}>
            <Input
              label="Start Date"
              aria-label="Start Date"
              type="date"
              size="xs"
              css={{ w: "auto" }}
              bordered
              value={dateGte}
              onChange={(event) =>
                dispatch(invtryActions.setGte(event.target.value))
              }
            />{" "}
            <Input
              label="End Date"
              aria-label="End Date"
              type="date"
              size="xs"
              bordered
              css={{ w: "auto" }}
              value={dateLte}
              onChange={(event) =>
                dispatch(invtryActions.setLte(event.target.value))
              }
            />
          </Card.Body>
          <Card.Divider />
          <Card.Footer
            css={{ display: "inline-flex", justifyContent: "end", gap: "10px" }}
          >
            <MotionButton size="sm" auto onClick={fetchReport} {...btnAnim}>
              {loading ? <Loading type="spinner" color="white" /> : "Orders"}
            </MotionButton>
            <MotionButton
              size="sm"
              auto
              color="secondary"
              onClick={() =>
                navigate(`/products-report?gte=${dateGte}&lte=${dateLte}`)
              }
              {...btnAnim}
            >
              Products
            </MotionButton>
            <MotionButton
              size="sm"
              auto
              color="secondary"
              onClick={() =>
                navigate(`/table-report?gte=${dateGte}&lte=${dateLte}`)
              }
              {...btnAnim}
            >
              View Table
            </MotionButton>
          </Card.Footer>
        </Card>
      </motion.div>
      <motion.div className="ordersDiv alignDivCenter">
        {!loading && error && (
          <Text
            color="error"
            css={{
              br: "12px",
              bgColor: "$red50",
              py: "5px",
              px: "10px",
              my: "10px",
            }}
          >
            An error occured while trying to retrieve data from the server!
          </Text>
        )}
        {!loading &&
          storedReports.length > 0 &&
          storedReports.map((doc) => {
            return <GroupCard key={doc._id} doc={doc} />;
          })}
      </motion.div>
    </motion.div>
  );
};

export default Report;
